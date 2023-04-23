import * as Errors from "./errors";
import * as Health from "./health";
import * as Helpers from "./helpers";
import { QueryParams } from "./helpers";
import * as Profiles from "./profiles";
import * as ProfileSertifications from "./profilesCertifiations";
import * as ProfilesEducations from "./profilesEducation";
import * as ProfilesExperiences from "./profilesExperience";
import * as Projects from "./projects";
import * as Recovery from "./recovery";
import * as Session from "./session";
import * as Tenders from "./tenders";
import * as Users from "./users";
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

  public get xsrf() {
    if (typeof window !== "undefined") {
      const xsrf = this.parse(window.document.cookie);

      if (xsrf) {
        return xsrf;
      }
    }

    return "UNDEFINED";
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

  async get<D>(input: string) {
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

  async post<D, P>(input: string, payload?: P) {
    await this.csrf();
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
    await this.csrf();
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
    await this.csrf();
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

  async health() {
    return this.get<Health.Show["Data"]>(`${this.baseUrl}/health`);
  }

  async csrf() {
    await fetch(`${this.baseUrl}/csrf`);
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

  get profiles() {
    return {
      index: (id?: number) =>
        this.get<Profiles.Index["Data"]>(
          `${this.baseUrl}/profiles?page=1&perPage=100${
            id ? `&filter[userId]=${id}` : ""
          }`
        ),
      show: (id: number) =>
        this.get<Profiles.Show["Data"]>(`${this.baseUrl}/profiles/${id}`),
      store: (payload: Profiles.Store["Payload"]) =>
        this.post<Profiles.Store["Data"], Profiles.Store["Payload"]>(
          `${this.baseUrl}/profiles`,
          payload
        ),
      update: (id: number, payload: Profiles.Update["Payload"]) =>
        this.patch<Profiles.Update["Data"], Profiles.Update["Payload"]>(
          `${this.baseUrl}/profiles/${id}`,
          payload
        ),
      destroy: (id: number) => this.delete(`${this.baseUrl}/profiles/${id}`),
    };
  }

  get educations() {
    return {
      index: (portfolioId: number) =>
        this.get<ProfilesEducations.Index["Data"]>(
          `${this.baseUrl}/profiles/${portfolioId}/educations?page=1&perPage=20`
        ),
      store: (
        payload: ProfilesEducations.Store["Payload"],
        portfolioId: number
      ) =>
        this.post<
          ProfilesEducations.Store["Data"],
          ProfilesEducations.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/educations`, payload),
    };
  }

  get experiences() {
    return {
      index: (portfolioId: number) =>
        this.get<ProfilesExperiences.Index["Data"]>(
          `${this.baseUrl}/profiles/${portfolioId}/educations?page=1&perPage=20`
        ),
      store: (
        payload: ProfilesExperiences.Store["Payload"],
        portfolioId: number
      ) =>
        this.post<
          ProfilesExperiences.Store["Data"],
          ProfilesExperiences.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/educations`, payload),
    };
  }

  get certifications() {
    return {
      index: (portfolioId: number) =>
        this.get<ProfileSertifications.Index["Data"]>(
          `${this.baseUrl}/profiles/${portfolioId}/educations?page=1&perPage=20`
        ),
      store: (
        payload: ProfileSertifications.Store["Payload"],
        portfolioId: number
      ) =>
        this.post<
          ProfileSertifications.Store["Data"],
          ProfileSertifications.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/educations`, payload),
    };
  }

  get projects() {
    return {
      index: (id?: number) =>
        this.get<Projects.Index["Data"]>(
          `${this.baseUrl}/projects?page=1&perPage=100${
            id ? `&filter[userId]=${id}` : ""
          }`
        ),
      show: (id: number) =>
        this.get<Projects.Show["Data"]>(`${this.baseUrl}/profiles/${id}`),
      store: (payload: Profiles.Store["Payload"]) =>
        this.post<Profiles.Store["Data"], Profiles.Store["Payload"]>(
          `${this.baseUrl}/projects`,
          payload
        ),
      destroy: (id: number) => this.delete(`${this.baseUrl}/profiles/${id}`),
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

  get tenders() {
    return {
      index: ({
        page,
        perPage,
        filters,
        search,
        sort,
      }: QueryParams<Tenders.Entity>) => {
        const url = new URL(`${this.baseUrl}/tenders`);

        url.searchParams.append("page", page.toString());
        url.searchParams.append("perPage", perPage.toString());

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            url.searchParams.append(`filter[${key}]`, value.toString());
          });
        }

        if (sort) {
          Object.entries(sort).forEach(([key, value]) => {
            url.searchParams.append(
              `sort[]`,
              value === "asc" ? key : `-${key}`
            );
          });
        }

        if (search) {
          url.searchParams.append("search", search);
        }

        return this.get<Tenders.Index["Data"]>(url.toString());
      },
      show: (id: number) =>
        this.get<Tenders.Show["Data"]>(`${this.baseUrl}/tenders/${id}`),
      store: (payload: Tenders.Store["Payload"]) =>
        this.post<Tenders.Store["Data"], Tenders.Store["Payload"]>(
          `${this.baseUrl}/tenders`,
          payload
        ),
      destroy: (id: number) => this.delete(`${this.baseUrl}/tenders/${id}`),
    };
  }
}

const api = new Api("http://localhost:3333");

export default api;
