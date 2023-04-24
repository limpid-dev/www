import * as Errors from "./errors";
import * as Health from "./health";
import * as Helpers from "./helpers";
import { QueryParams } from "./helpers";
import * as ProfileSertificationFile from "./profileCertifiationFile";
import * as Profiles from "./profiles";
import * as ProfileSertifications from "./profilesCertifiations";
import * as ProfilesEducations from "./profilesEducation";
import * as ProfilesExperiences from "./profilesExperience";
import * as ProfilesSkills from "./profilesSkills";
import * as Projects from "./projects";
import * as Recovery from "./recovery";
import * as Session from "./session";
import * as TenderFiles from "./tender-file";
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

  async get<D>(input: string, init?: Helpers.FetchRequestInit) {
    return this.handle<D>(
      fetch(input, {
        method: "GET",
        headers: {
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
        ...init,
      })
    );
  }

  async patch<D, P>(
    input: string,
    payload: P,
    init?: Helpers.FetchRequestInit
  ) {
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
        ...init,
      })
    );
  }

  async delete(input: string, init?: Helpers.FetchRequestInit) {
    await this.csrf();
    return this.handle(
      fetch(input, {
        method: "DELETE",
        headers: {
          "X-XSRF-TOKEN": this.xsrf,
        },
        credentials: "include",
        ...init,
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

  get profiles() {
    return {
      index: (
        qp: QueryParams<Profiles.Entity>,
        init?: Helpers.FetchRequestInit
      ) => {
        const url = Helpers.buildQueryParamsUrl(`${this.baseUrl}/profiles`, qp);

        return this.get<Profiles.Index["Data"]>(url.toString(), init);
      },
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
          `${this.baseUrl}/profiles/${portfolioId}/experiences?page=1&perPage=20`
        ),
      store: (
        payload: ProfilesExperiences.Store["Payload"],
        portfolioId: number
      ) =>
        this.post<
          ProfilesExperiences.Store["Data"],
          ProfilesExperiences.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/experiences`, payload),
    };
  }

  get certifications() {
    return {
      index: (portfolioId: number) =>
        this.get<ProfileSertifications.Index["Data"]>(
          `${this.baseUrl}/profiles/${portfolioId}/certificates?page=1&perPage=20`
        ),
      store: (
        payload: ProfileSertifications.Store["Payload"],
        portfolioId: number
      ) =>
        this.post<
          ProfileSertifications.Store["Data"],
          ProfileSertifications.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/certificates`, payload),
    };
  }

  get certificateFile() {
    return {
      store: (
        payload: ProfileSertificationFile.Store["Payload"],
        portfolioId: number,
        fileId: number
      ) =>
        this.post<
          ProfileSertificationFile.Store["Data"],
          ProfileSertificationFile.Store["Payload"]
        >(
          `${this.baseUrl}/profiles/${portfolioId}/certificates/${fileId}/files`,
          payload
        ),
    };
  }

  get skills() {
    return {
      index: (portfolioId: number) =>
        this.get<ProfilesSkills.Index["Data"]>(
          `${this.baseUrl}/profiles/${portfolioId}/skills?page=1&perPage=20`
        ),
      store: (payload: ProfilesSkills.Store["Payload"], portfolioId: number) =>
        this.post<
          ProfilesSkills.Store["Data"],
          ProfilesSkills.Store["Payload"]
        >(`${this.baseUrl}/profiles/${portfolioId}/skills`, payload),
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
      index: (
        qp: QueryParams<Tenders.Entity>,
        init?: Helpers.FetchRequestInit
      ) => {
        const url = Helpers.buildQueryParamsUrl(`${this.baseUrl}/tenders`, qp);

        return this.get<Tenders.Index["Data"]>(url.toString(), init);
      },
      show: (id: number, init?: Helpers.FetchRequestInit) =>
        this.get<Tenders.Show["Data"]>(`${this.baseUrl}/tenders/${id}`, init),
      store: (
        payload: Tenders.Store["Payload"],
        init?: Helpers.FetchRequestInit
      ) =>
        this.post<Tenders.Store["Data"], Tenders.Store["Payload"]>(
          `${this.baseUrl}/tenders`,
          payload,
          init
        ),
      destroy: (id: number, init?: Helpers.FetchRequestInit) =>
        this.delete(`${this.baseUrl}/tenders/${id}`, init),

      files: (tenderId: number) => {
        return {
          index: (
            qp: Pick<QueryParams<TenderFiles.Entity>, "page" | "perPage">,
            init?: Helpers.FetchRequestInit
          ) => {
            const url = Helpers.buildQueryParamsUrl(
              `${this.baseUrl}/tenders/${tenderId}/files`,
              qp
            );

            return this.get<TenderFiles.Index["Data"]>(url.toString(), init);
          },
          store: (
            payload: TenderFiles.Store["Payload"],
            init?: Helpers.FetchRequestInit
          ) =>
            this.post<TenderFiles.Store["Data"], TenderFiles.Store["Payload"]>(
              `${this.baseUrl}/tenders/${tenderId}/files`,
              payload,
              {
                headers: {
                  ContentType: "multipart/form-data",
                  Accept: "application/json",
                },
                body: payload,
                credentials: "include",
                ...init,
              }
            ),
          delete: (id: number, init?: Helpers.FetchRequestInit) =>
            this.delete(
              `${this.baseUrl}/tenders/${tenderId}/files/${id}`,
              init
            ),
        };
      },
    };
  }
}

const api = new Api("http://localhost:3333");

export default api;
