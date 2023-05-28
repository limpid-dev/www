import * as Errors from "./errors";
import * as Helpers from "./helpers";
import * as Recovery from "./recovery";
import * as Session from "./session";
import * as Verification from "./verification";

class Api {
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

  constructor(private readonly baseUrl: string) {}

  async handle<D>(request: Promise<Response>): Promise<{
    data?: D;
    meta?: Helpers.Meta;
    error?: Error;
  }> {
    try {
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

      if (response.status === 400) {
        return { error: new Errors.BadRequest("Bad Request") };
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
    } catch (error) {
      return { error: new Error("Unknown") };
    }
  }

  async get<D>(input: string, init?: Helpers.FetchRequestInit) {
    return this.handle<D>(
      fetch(input, {
        method: "GET",
        headers: {
          ...init?.headers,
          Accept: this.json,
        },
        credentials: "include",
        ...init,
      })
    );
  }

  async post<D, P>(
    input: string,
    payload?: P,
    init?: Helpers.FetchRequestInit
  ) {
    return this.handle<D>(
      fetch(input, {
        method: "POST",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          ...init?.headers,
        },
        body: JSON.stringify(payload),
        credentials: "include",
        ...init,
      })
    );
  }

  async patch<D, P>(
    input: string,
    payload: P,
    init?: Helpers.FetchRequestInit
  ) {
    return this.handle<D>(
      fetch(input, {
        method: "PATCH",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          ...init?.headers,
        },
        body: JSON.stringify(payload),
        credentials: "include",
        ...init,
      })
    );
  }

  async delete(input: string, init?: Helpers.FetchRequestInit) {
    return this.handle(
      fetch(input, {
        method: "DELETE",
        headers: {
          ...init?.headers,
        },
        credentials: "include",
        ...init,
      })
    );
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
      show: (init?: Helpers.FetchRequestInit) =>
        this.get<Session.Show["Data"]>(`${this.baseUrl}/session`, init),
      store: <M extends "api" | "web">(
        payload: Session.Store<M>["Payload"],
        init?: Helpers.FetchRequestInit
      ) =>
        this.post<Session.Store<M>["Data"], Session.Store<M>["Payload"]>(
          `${this.baseUrl}/session`,
          payload,
          init
        ),
      destroy: (init?: Helpers.FetchRequestInit) =>
        this.delete(`${this.baseUrl}/session`, init),
    };
  }

  get recovery() {
    return {
      store: (payload: Recovery.Store["Payload"]) =>
        this.post<never, Recovery.Store["Payload"]>(
          `${this.baseUrl}/recovery`,
          payload
        ),
      update: (payload: Recovery.Update["Payload"]) =>
        this.patch<never, Recovery.Update["Payload"]>(
          `${this.baseUrl}/recovery`,
          payload
        ),
    };
  }
}

const api = new Api(process.env.NEXT_PUBLIC_API_URL);
// const api = new Api("https://api.limpid.kz");

export default api;
