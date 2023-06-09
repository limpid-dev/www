export interface paths {
  "/users": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
            password: string;
            first_name: string;
            last_name: string;
          };
        };
      };
      responses: {
        /** @description User is created */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["User"];
            };
          };
        };
      };
    };
  };
  "/session": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
            password: string;
          };
        };
      };
      responses: {
        /** @description User is logged in */
        200: {
          content: {
            "application/json": {
              data?: {
                type?: string;
                token?: string;
                expires_at?: string;
              };
            };
          };
        };
      };
    };
    delete: {
      responses: {
        /** @description User is logged out */
        200: never;
      };
    };
  };
  "/email-verification": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
          };
        };
      };
      responses: {
        /** @description User email verification mail send */
        200: never;
      };
    };
    patch: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
            token: string;
          };
        };
      };
      responses: {
        /** @description User email verified */
        200: never;
      };
    };
  };
  "/password-recovery": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
          };
        };
      };
      responses: {
        /** @description Password recovery mail send */
        200: never;
      };
    };
    patch: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email: string;
            password: string;
            token: string;
          };
        };
      };
      responses: {
        /** @description User's password is changed */
        200: never;
      };
    };
  };
  "/user": {
    get: {
      responses: {
        /** @description User data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["User"];
            };
          };
        };
      };
    };
    patch: {
      requestBody: {
        content: {
          "multipart/form-data": {
            email?: string | null;
            password?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            patronymic?: string | null;
            born_at?: string | null;
            selected_profile_id?: number | null;
          };
        };
      };
      responses: {
        /** @description Updated user's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["User"];
            };
          };
        };
      };
    };
  };
  "/profiles": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
          user_id?: number;
          industry?: string;
          search?: string;
        };
      };
      responses: {
        /** @description User's profiles */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Profile"][];
            };
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            display_name: string;
            description: string;
            location: string;
            industry: string;
            owned_intellectual_resources?: string;
            owned_material_resources?: string;
            tin: string;
            is_visible: boolean;
            /** Format: binary */
            avatar?: string;
            instagram_url?: string | null;
            whatsapp_url?: string | null;
            website_url?: string | null;
            telegram_url?: string | null;
            two_gis_url?: string | null;
          };
        };
      };
      responses: {
        /** @description Profile is created */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Profile"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}": {
    get: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Profile"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            display_name?: string;
            description?: string;
            location?: string;
            industry?: string;
            owned_intellectual_resources?: string;
            owned_material_resources?: string;
            tin?: string;
            is_visible?: boolean;
            /** Format: binary */
            avatar?: string;
            instagram_url?: string | null;
            whatsapp_url?: string | null;
            website_url?: string | null;
            telegram_url?: string | null;
            two_gis_url?: string | null;
          };
        };
      };
      responses: {
        /** @description Updated profile's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Profile"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/certificates": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile's certificates */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Certificate"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title: string;
            description: string;
            institution: string;
            issued_at: string;
            expired_at?: string;
            /** Format: binary */
            attachment: string;
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/certificates/{certificate_id}": {
    get: {
      parameters: {
        path: {
          profile_id: number;
          certificate_id: number;
        };
      };
      responses: {
        /** @description Certificate data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Certificate"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          profile_id: number;
          certificate_id: number;
        };
      };
      responses: {
        /** @description Certificate is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          profile_id: number;
          certificate_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            institution?: string;
            issued_at?: string;
            expired_at?: string;
            /** Format: binary */
            attachment?: string;
          };
        };
      };
      responses: {
        /** @description Updated certificate's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Certificate"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/educations": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile's educations */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Education"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title: string;
            description: string;
            institution: string;
            started_at: string;
            finished_at?: string;
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/educations/{education_id}": {
    get: {
      parameters: {
        path: {
          profile_id: number;
          education_id: number;
        };
      };
      responses: {
        /** @description Education data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Education"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          profile_id: number;
          education_id: number;
        };
      };
      responses: {
        /** @description Education is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          profile_id: number;
          education_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            institution?: string;
            started_at?: string;
            finished_at?: string;
          };
        };
      };
      responses: {
        /** @description Updated education's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Education"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/experiences": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile's experiences */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Experience"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title: string;
            description: string;
            institution: string;
            started_at: string;
            finished_at?: string | null;
          };
        };
      };
      responses: {
        /** @description Experience data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Experience"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/experiences/{experience_id}": {
    get: {
      parameters: {
        path: {
          profile_id: number;
          experience_id: number;
        };
      };
      responses: {
        /** @description Experience data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Experience"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          profile_id: number;
          experience_id: number;
        };
      };
      responses: {
        /** @description Experience is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          profile_id: number;
          experience_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            institution?: string;
            started_at?: string;
            finished_at?: string | null;
          };
        };
      };
      responses: {
        /** @description Updated experience's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Experience"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/skills": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          profile_id: number;
        };
      };
      responses: {
        /** @description Profile's skills */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Skill"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          profile_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Skill data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Skill"];
            };
          };
        };
      };
    };
  };
  "/profiles/{profile_id}/skills/{skill_id}": {
    get: {
      parameters: {
        path: {
          profile_id: number;
          skill_id: number;
        };
      };
      responses: {
        /** @description Skill data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Skill"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          profile_id: number;
          skill_id: number;
        };
      };
      responses: {
        /** @description Skill is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          profile_id: number;
          skill_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            name?: string;
          };
        };
      };
      responses: {
        /** @description Updated skill's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Skill"];
            };
          };
        };
      };
    };
  };
  "/projects": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
          profile_id?: number;
          industry?: string[];
          stage?: string[];
          required_money_amount?: {
            min?: number;
            max?: number;
          };
          owned_money_amount?: {
            min?: number;
            max?: number;
          };
          search?: string;
        };
      };
      responses: {
        /** @description Projects */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Project"][];
            };
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            title: string;
            description: string;
            location: string;
            industry: string;
            stage: string;
            required_money_amount: number;
            owned_money_amount: number;
            required_intellectual_resources: string;
            owned_intellectual_resources: string;
            required_material_resources: string;
            owned_material_resources: string;
            profitability: string;
          };
        };
      };
      responses: {
        /** @description Project data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Project"];
            };
          };
        };
      };
    };
  };
  "/projects/{project_id}": {
    get: {
      parameters: {
        path: {
          project_id: number;
        };
      };
      responses: {
        /** @description Project data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Project"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          project_id: number;
        };
      };
      responses: {
        /** @description Project is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          project_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            location?: string;
            industry?: string;
            stage?: string;
            required_money_amount?: number;
            owned_money_amount?: number;
            required_intellectual_resources?: string;
            owned_intellectual_resources?: string;
            required_material_resources?: string;
            owned_material_resources?: string;
            profitability?: string;
          };
        };
      };
      responses: {
        /** @description Updated project's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Project"];
            };
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    Pagination: {
      total?: number;
      per_page?: number;
      current_page?: number;
      last_page?: number;
      first_page?: number;
      first_page_url?: string;
      last_page_url?: string;
      next_page_url?: string;
      previous_page_url?: string | null;
    };
    User: {
      id?: number;
      email?: string;
      selected_profile_id?: number | null;
      first_name?: string;
      last_name?: string;
      patronymic?: string | null;
      email_verified_at?: string | null;
      born_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Profile: {
      id?: number;
      user_id?: number;
      display_name?: string;
      description?: string;
      location?: string;
      industry?: string;
      owned_intellectual_resources?: string | null;
      owned_material_resources?: string | null;
      tin?: string;
      legal_structure?: string | null;
      is_visible?: boolean;
      is_personal?: boolean;
      avatar?: components["schemas"]["Attachment"];
      instagram_url?: string | null;
      whatsapp_url?: string | null;
      website_url?: string | null;
      telegram_url?: string | null;
      two_gis_url?: string | null;
      tin_verified_at?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Attachment: {
      url?: string | null;
      name?: string | null;
      size?: string;
      extname?: string;
      mimeType?: string;
    };
    Certificate: {
      id?: number;
      title?: string;
      description?: string;
      institution?: string;
      profile_id?: number;
      attachment?: components["schemas"]["Attachment"];
      issued_at?: string;
      expired_at?: string | null;
    };
    Education: {
      id?: number;
      title?: string;
      description?: string;
      institution?: string;
      profile_id?: number;
      started_at?: string;
      finished_at?: string | null;
    };
    Experience: {
      id?: number;
      title?: string;
      description?: string;
      institution?: string;
      profile_id?: number;
      started_at?: string;
      finished_at?: string | null;
    };
    Project: {
      id?: number;
      profile_id?: number;
      chat_id?: number;
      title?: string;
      description?: string;
      location?: string;
      industry?: string;
      stage?: string;
      required_money_amount?: number;
      owned_money_amount?: number;
      required_material_resources?: string;
      owned_material_resources?: string;
      required_intellectual_resources?: string;
      owned_intellectual_resources?: string;
      profitability?: string;
      created_at?: string;
      updated_at?: string;
    };
    Skill: {
      id?: number;
      profile_id?: number;
      name?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
