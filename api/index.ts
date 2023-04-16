import * as Csrf from "./csrf";
import * as Errors from "./errors";
import * as Health from "./health";
import * as Users from "./users";

export class Api {
  private _xsrf?: string;

  get xsrf() {
    if (this._xsrf) {
      return this._xsrf;
    }

    if (typeof window !== "undefined") {
      const xsrf = this.parse(window.document.cookie, "XSRF-TOKEN");

      if (xsrf) {
        this._xsrf = xsrf;
        return xsrf;
      }

      this.csrf().then(([_, response]) => {
        const cookies = response.headers.get("set-cookie");

        if (cookies) {
          const xsrf = this.parse(cookies, "XSRF-TOKEN");
          if (xsrf) {
            this._xsrf = xsrf;
          }
        }
      });
    }

    return "";
  }

  private headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": this.xsrf,
  };

  private parse(cookies: string, find: string) {
    for (const cookie of cookies.split(";")) {
      const [key, value] = cookie.split("=");

      if (key.trim() === find) {
        return value;
      }
    }

    return null;
  }

  constructor(private readonly baseUrl: string) {}

  async handle<T>(response: Response) {
    const json = await response.json();

    if (!response.ok) {
      if (Errors.isBadCsrfToken(json)) {
        const [_, response] = await this.csrf();

        const cookies = response.headers.get("set-cookie");

        if (cookies) {
          const xsrf = this.parse(cookies, "XSRF-TOKEN");
          if (xsrf) {
            this._xsrf = xsrf;
          }
        }
      }

      throw new Error(json);
    }

    return [json as T, response] as const;
  }

  async get<T>(url: string) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return this.handle<T>(response);
  }

  async post<T, P>(url: string, body: P) {
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return this.handle<T>(response);
  }

  async patch<T, P>(url: string, body: P) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return this.handle<T>(response);
  }

  async delete<T>(url: string) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.headers,
    });

    return this.handle<T>(response);
  }

  async health() {
    return this.get<Health.Show["Data"]>(`${this.baseUrl}/health`);
  }

  async csrf() {
    return this.get<Csrf.Show["Data"]>(`${this.baseUrl}/csrf`);
  }

  get users() {
    return {
      show: (id: number) =>
        this.get<Users.Show["Data"]>(`${this.baseUrl}/users/${id}`),
      store: (payload: Users.Store["Payload"]) =>
        this.post(`${this.baseUrl}/users`, payload),
      update: (id: number, payload: Users.Update["Payload"]) =>
        this.patch(`${this.baseUrl}/users/${id}`, payload),
    };
  }
}

const api = new Api("http://localhost:3333");

export default api;
