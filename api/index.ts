import * as Errors from "./errors";
import * as Health from "./health";
import * as Helpers from "./helpers";
import * as Session from "./session";
import * as Users from "./users";
import * as Verification from "./verification";

class Api {
  private xsrf = "UNDEFINED";
  private json = "application/json";

  private parse(cookies: string) {
    for (const cookie of cookies.split(";")) {
      const [key, value] = cookie.split("=");

      if (key.trim() === "XSRF-TOKEN") {
        return value;
      }
    }

    return null;
  }

  constructor(private readonly baseUrl: string) {
    if (typeof window !== "undefined") {
      const xsrf = this.parse(window.document.cookie);

      if (xsrf) {
        this.xsrf = xsrf;
      }
    }
  }

  async handle<D>(request: Promise<Response>): Promise<{
    data?: D;
    meta?: Helpers.Meta;
    error?: Error;
  }> {
    const response = await request;

    if (response.status === 200) {
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes(this.json)) {
        const json = await response.json();

        const data = json.data as D;

        if (Array.isArray(data)) {
          return {
            data,
            meta: json.meta,
          };
        }

        return { data };
      }

      return {};
    }

    if (response.status === 401) {
      return {
        error: new Errors.Unauthorized("Unauthorized"),
      };
    }

    if (response.status === 403) {
      return { error: new Errors.Forbidden("Forbidden") };
    }

    if (response.status === 422) {
      return { error: new Errors.Validation("Validation") };
    }

    return { error: new Error("Unknown") };
  }

  get<D>(input: string) {
    return this.handle<D>(
      fetch(input, {
        method: "GET",
        headers: {
          Accept: this.json,
        },
        credentials: "include",
      })
    );
  }

  post<D, P>(input: string, payload: P) {
    return this.handle<D>(
      fetch(input, {
        method: "POST",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          "X-XSRF-TOKEN": this.xsrf,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })
    );
  }

  async patch<D, P>(input: string, payload: P) {
    return this.handle<D>(
      fetch(input, {
        method: "PATCH",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          "X-XSRF-TOKEN": this.xsrf,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })
    );
  }

  async delete(input: string) {
    return this.handle(
      fetch(input, {
        method: "DELETE",
        headers: {
          "X-XSRF-TOKEN": this.xsrf,
        },
        credentials: "include",
      })
    );
  }

  health() {
    return this.get<Health.Show["Data"]>(`${this.baseUrl}/health`);
  }

  csrf() {
    return this.get<never>(`${this.baseUrl}/csrf`);
  }

  get users() {
    return {
      show: (id: number) =>
        this.get<Users.Show["Data"]>(`${this.baseUrl}/users/${id}`),
      store: (payload: Users.Store["Payload"]) =>
        this.post<Users.Store["Data"], Users.Store["Payload"]>(
          `${this.baseUrl}/users`,
          payload
        ),
      update: (id: number, payload: Users.Update["Payload"]) =>
        this.patch<Users.Update["Data"], Users.Update["Payload"]>(
          `${this.baseUrl}/users/${id}`,
          payload
        ),
    };
  }

  get verification() {
    return {
      store: (payload: Verification.Store["Payload"]) =>
        this.post<never, Verification.Store["Payload"]>(
          `${this.baseUrl}/verification`,
          payload
        ),
      update: (payload: Verification.Update["Payload"]) =>
        this.patch<never, Verification.Update["Payload"]>(
          `${this.baseUrl}/verification`,
          payload
        ),
    };
  }

  get session() {
    return {
      show: () => this.get<Session.Show["Data"]>(`${this.baseUrl}/session`),
      store: <M extends "api" | "web">(payload: Session.Store<M>["Payload"]) =>
        this.post<Session.Store<M>["Data"], Session.Store<M>["Payload"]>(
          `${this.baseUrl}/session`,
          payload
        ),
      destroy: () => this.delete(`${this.baseUrl}/session`),
    };
  }
}

const api = new Api("http://localhost:3333");

export default api;
