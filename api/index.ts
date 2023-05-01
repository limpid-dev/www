import * as Errors from "./errors";
import * as Health from "./health";
import * as Helpers from "./helpers";
import { QueryParams } from "./helpers";
import * as ProfileSertificationFile from "./profile-certificate-files";
import * as ProfileSertifications from "./profile-certificates";
import * as ProfilesEducations from "./profile-educations";
import * as ProfilesExperiences from "./profile-experiences";
import * as ProfilesSkills from "./profile-skills";
import * as Profiles from "./profiles";
import * as ProjectFiles from "./project-file";
import * as Projects from "./projects";
import * as Recovery from "./recovery";
import * as Session from "./session";
import * as TenderBids from "./tender-bid";
import * as TenderFiles from "./tender-file";
import * as Tenders from "./tenders";
import * as UserFiles from "./user-file";
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
    await this.csrf();
    return this.handle<D>(
      fetch(input, {
        method: "POST",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          "X-XSRF-TOKEN": this.xsrf,
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
    await this.csrf();
    return this.handle<D>(
      fetch(input, {
        method: "PATCH",
        headers: {
          Accept: this.json,
          "Content-Type": this.json,
          "X-XSRF-TOKEN": this.xsrf,
          ...init?.headers,
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
          ...init?.headers,
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
      avatar: (id: number, payload: UserFiles.Store["Payload"]) => {
        this.patch<UserFiles.Store["Data"], UserFiles.Store["Payload"]>(
          `${this.baseUrl}/users/${id}/`,
          payload,
          {
            headers: {
              ContentType: "multipart/form-data",
              Accept: "application/json",
            },
            body: payload,
            credentials: "include",
          }
        );
      },
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
      show: (profileId: number, id: number) =>
        this.get<ProfilesEducations.Show["Data"]>(
          `${this.baseUrl}/profiles/${profileId}/educations/${id}`
        ),
      index: (profileId: number) =>
        this.get<ProfilesEducations.Index["Data"]>(
          `${this.baseUrl}/profiles/${profileId}/educations?page=1&perPage=20`
        ),
      store: (
        payload: ProfilesEducations.Store["Payload"],
        profileId: number
      ) =>
        this.post<
          ProfilesEducations.Store["Data"],
          ProfilesEducations.Store["Payload"]
        >(`${this.baseUrl}/profiles/${profileId}/educations`, payload),
      update: (
        profileId: number,
        id: number,
        payload: ProfilesEducations.Update["Payload"]
      ) =>
        this.patch<
          ProfilesEducations.Update["Data"],
          ProfilesEducations.Update["Payload"]
        >(`${this.baseUrl}/profiles/${profileId}/educations/${id}`, payload),
      destroy: (profileId: number, id: number) =>
        this.delete(`${this.baseUrl}/profiles/${profileId}/educations/${id}`),
    };
  }

  get experiences() {
    return {
      index: (profileId: number) =>
        this.get<ProfilesExperiences.Index["Data"]>(
          `${this.baseUrl}/profiles/${profileId}/experiences?page=1&perPage=20`
        ),
      store: (
        payload: ProfilesExperiences.Store["Payload"],
        profileId: number
      ) =>
        this.post<
          ProfilesExperiences.Store["Data"],
          ProfilesExperiences.Store["Payload"]
        >(`${this.baseUrl}/profiles/${profileId}/experiences`, payload),
    };
  }

  get certifications() {
    return {
      index: (profileId: number) =>
        this.get<ProfileSertifications.Index["Data"]>(
          `${this.baseUrl}/profiles/${profileId}/certificates?page=1&perPage=20`
        ),
      store: (
        payload: ProfileSertifications.Store["Payload"],
        profileId: number
      ) =>
        this.post<
          ProfileSertifications.Store["Data"],
          ProfileSertifications.Store["Payload"]
        >(`${this.baseUrl}/profiles/${profileId}/certificates`, payload),
    };
  }

  get skills() {
    return {
      index: (profileId: number) =>
        this.get<ProfilesSkills.Index["Data"]>(
          `${this.baseUrl}/profiles/${profileId}/skills?page=1&perPage=20`
        ),
      store: (payload: ProfilesSkills.Store["Payload"], profileId: number) =>
        this.post<
          ProfilesSkills.Store["Data"],
          ProfilesSkills.Store["Payload"]
        >(`${this.baseUrl}/profiles/${profileId}/skills`, payload),
      destroy: (profileId: number, id: number) =>
        this.delete(`${this.baseUrl}/profiles/${profileId}/skills/${id}`),
    };
  }

  get projects() {
    return {
      index: (id: number) =>
        this.get<Projects.Index["Data"]>(
          `${this.baseUrl}/projects?page=1&perPage=100&filter[userId]=${id}`
        ),
      show: (id: number) =>
        this.get<Projects.Show["Data"]>(`${this.baseUrl}/projects/${id}`),
      store: (payload: Profiles.Store["Payload"]) =>
        this.post<Profiles.Store["Data"], Profiles.Store["Payload"]>(
          `${this.baseUrl}/projects`,
          payload
        ),
      destroy: (id: number) => this.delete(`${this.baseUrl}/profiles/${id}`),
      files: (projectID: number) => {
        return {
          index: (
            qp: Pick<QueryParams<ProjectFiles.Entity>, "page" | "perPage">,
            init?: Helpers.FetchRequestInit
          ) => {
            const url = Helpers.buildQueryParamsUrl(
              `${this.baseUrl}/projects/${projectID}/files`,
              qp
            );

            return this.get<ProjectFiles.Index["Data"]>(url.toString(), init);
          },
          store: (
            payload: ProjectFiles.Store["Payload"],
            init?: Helpers.FetchRequestInit
          ) =>
            this.post<
              ProjectFiles.Store["Data"],
              ProjectFiles.Store["Payload"]
            >(`${this.baseUrl}/projects/${projectID}/files`, payload, {
              headers: {
                ContentType: "multipart/form-data",
                Accept: "application/json",
              },
              body: payload,
              credentials: "include",
              ...init,
            }),
          delete: (id: number, init?: Helpers.FetchRequestInit) =>
            this.delete(
              `${this.baseUrl}/projects/${projectID}/files/${id}`,
              init
            ),
        };
      },
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

      bids: (tenderId: number) => {
        return {
          index: (
            qp: Pick<QueryParams<TenderBids.Entity>, "page" | "perPage">,
            init?: Helpers.FetchRequestInit
          ) => {
            const url = Helpers.buildQueryParamsUrl(
              `${this.baseUrl}/tenders/${tenderId}/bids`,
              qp
            );

            return this.get<TenderBids.Index["Data"]>(url.toString(), init);
          },
          store: (
            payload: TenderBids.Store["Payload"],
            init?: Helpers.FetchRequestInit
          ) =>
            this.post<TenderBids.Store["Data"], TenderBids.Store["Payload"]>(
              `${this.baseUrl}/tenders/${tenderId}/bids`,
              payload,
              init
            ),

          update: (
            payload: TenderBids.Update["Payload"],
            init?: Helpers.FetchRequestInit
          ) =>
            this.patch<TenderBids.Update["Data"], TenderBids.Update["Payload"]>(
              `${this.baseUrl}/tenders/${tenderId}/bids`,
              payload,
              init
            ),
        };
      },

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

  get certificateFile() {
    return {
      store: (
        payload: ProfileSertificationFile.Store["Payload"],
        profileId: number,
        fileId: number
      ) =>
        this.post<
          ProfileSertificationFile.Store["Data"],
          ProfileSertificationFile.Store["Payload"]
        >(
          `${this.baseUrl}/profiles/${profileId}/certificates/${fileId}/files`,
          // prosto zaglushka ne imeet smysl po idee
          payload,
          {
            headers: {
              ContentType: "multipart/form-data",
              Accept: "application/json",
            },
            body: payload,
          }
        ),
      index: (
        profileId: number,
        certificateId: number,
        qp: Pick<
          QueryParams<ProfileSertificationFile.Entity>,
          "page" | "perPage"
        >,
        init?: Helpers.FetchRequestInit
      ) => {
        const url = Helpers.buildQueryParamsUrl(
          `${this.baseUrl}/profiles/${profileId}/certificates/${certificateId}/files`,
          qp
        );
        return this.get<ProfileSertificationFile.Index["Data"]>(
          url.toString(),
          init
        );
      },
    };
  }
}

const api = new Api(process.env.NEXT_PUBLIC_API_URL);

export default api;
