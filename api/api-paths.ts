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
            /** Format: binary */
            logo?: string;
            /** Format: binary */
            video_introduction?: string;
            /** Format: binary */
            presentation?: string;
            /** Format: binary */
            business_plan?: string;
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
            /** Format: binary */
            logo?: string;
            /** Format: binary */
            video_introduction?: string;
            /** Format: binary */
            presentation?: string;
            /** Format: binary */
            business_plan?: string;
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
  "/projects/{project_id}/members": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          project_id: number;
        };
      };
      responses: {
        /** @description Project's members */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["ProjectMember"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          project_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            application_message: string;
          };
        };
      };
      responses: {
        /** @description Project's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["ProjectMember"];
            };
          };
        };
      };
    };
  };
  "/projects/{project_id}/members/{member_id}": {
    delete: {
      parameters: {
        path: {
          project_id: number;
          member_id: number;
        };
      };
      responses: {
        /** @description Project's member is deleted */
        200: never;
      };
    };
  };
  "/projects/{project_id}/members/{member_id}/accept": {
    post: {
      responses: {
        /** @description Project's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["ProjectMember"];
            };
          };
        };
      };
    };
  };
  "/projects/{project_id}/members/{member_id}/reject": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            rejection_message?: string;
          };
        };
      };
      responses: {
        /** @description Project's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["ProjectMember"];
            };
          };
        };
      };
    };
  };
  "/chats": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
      };
      responses: {
        /** @description Chats */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Chat"][];
            };
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            user_ids: number[];
            name: string;
          };
        };
      };
    };
  };
  "/chats/{chat_id}": {
    get: {
      parameters: {
        path: {
          chat_id: number;
        };
      };
      responses: {
        /** @description Chat */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Chat"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          chat_id: number;
        };
      };
      responses: {
        /** @description Chat is deleted */
        200: never;
      };
    };
  };
  "/chats/{chat_id}/messages": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          chat_id: number;
        };
      };
      responses: {
        /** @description Messages */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Message"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          chat_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            message: string;
          };
        };
      };
      responses: {
        /** @description Message */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Message"];
            };
          };
        };
      };
    };
  };
  "/auctions": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
          profile_id?: number;
          industry?: string[];
          search?: string;
        };
      };
      responses: {
        /** @description Auctions */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Auction"][];
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
            industry: string;
            duration: string;
            starting_price: number;
            purchase_price?: number;
            /** Format: binary */
            technical_specification?: string;
            /** Format: binary */
            photo_one?: string;
            /** Format: binary */
            photo_two?: string;
            /** Format: binary */
            photo_three?: string;
            /** Format: binary */
            photo_four?: string;
            /** Format: binary */
            photo_five?: string;
          };
        };
      };
      responses: {
        /** @description Auction data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Auction"];
            };
          };
        };
      };
    };
  };
  "/auctions/{auction_id}": {
    get: {
      parameters: {
        path: {
          auction_id: number;
        };
      };
      responses: {
        /** @description Auction data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Auction"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          auction_id: number;
        };
      };
      responses: {
        /** @description Auction is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          auction_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            industry?: string;
            duration?: string;
            starting_price?: number;
            purchase_price?: number;
            won_auction_bid_id?: number;
          };
        };
      };
      responses: {
        /** @description Updated auctions's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Auction"];
            };
          };
        };
      };
    };
  };
  "/auctions/{auction_id}/bids": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
          auction_id?: number;
          industry?: string[];
          search?: string;
        };
      };
      responses: {
        /** @description AuctionBids */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["AuctionBid"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        query: {
          auction_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            price: number;
          };
        };
      };
      responses: {
        /** @description AuctionBid data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["AuctionBid"];
            };
          };
        };
      };
    };
  };
  "/auctions/{auction_id}/bids/{auction_bid_id}": {
    get: {
      parameters: {
        path: {
          auction_id: number;
          auction_bid_id: number;
        };
      };
      responses: {
        /** @description AuctionBid data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["AuctionBid"];
            };
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          auction_id: number;
          auction_bid_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            price?: number;
          };
        };
      };
      responses: {
        /** @description Updated auctionBid's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["AuctionBid"];
            };
          };
        };
      };
    };
  };
  "/organizations": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
          user_id?: number;
          industry?: string[];
          search?: string;
        };
      };
      responses: {
        /** @description Organizations */
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
            perfomance: string;
            legal_structure: string;
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
        /** @description Organization data */
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
  "/organizations/{organization_id}": {
    get: {
      parameters: {
        path: {
          organization_id: number;
        };
      };
      responses: {
        /** @description Organization data */
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
          organization_id: number;
        };
      };
      responses: {
        /** @description Deleted organization's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Profile"];
            };
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          organization_id: number;
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
            perfomance?: string;
            legal_structure?: string;
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
        /** @description Updated organization's data */
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
  "/organizations/{organization_id}/members": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
        path: {
          organization_id: number;
        };
      };
      responses: {
        /** @description Organization's members */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["OrganizationMember"][];
            };
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          organization_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            application_message: string;
          };
        };
      };
      responses: {
        /** @description Organization's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["OrganizationMember"];
            };
          };
        };
      };
    };
  };
  "/organizations/{organization_id}/members/{member_id}": {
    delete: {
      parameters: {
        path: {
          organization_id: number;
          member_id: number;
        };
      };
      responses: {
        /** @description Organization's member is deleted */
        200: never;
      };
    };
  };
  "/organizations/{organization_id}/members/{member_id}/accept": {
    post: {
      responses: {
        /** @description Organization's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["OrganizationMember"];
            };
          };
        };
      };
    };
  };
  "/organizations/{organization_id}/members/{member_id}/reject": {
    post: {
      requestBody: {
        content: {
          "multipart/form-data": {
            rejection_message?: string;
          };
        };
      };
      responses: {
        /** @description Organization's member */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["OrganizationMember"];
            };
          };
        };
      };
    };
  };
  "/organizations/{profile_id}/certificates": {
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
  "/organizations/{organization_id}/certificates/{certificate_id}": {
    get: {
      parameters: {
        path: {
          organization_id: number;
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
          organization_id: number;
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
          organization_id: number;
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
  "/tenders": {
    get: {
      parameters: {
        query: {
          page: number;
          per_page?: number;
        };
      };
      responses: {
        /** @description Tenders */
        200: {
          content: {
            "application/json": {
              meta?: components["schemas"]["Pagination"];
              data?: components["schemas"]["Tender"][];
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
            starting_price: number;
            duration: number;
            /** Format: binary */
            tecnical_specification?: string;
          };
        };
      };
      responses: {
        /** @description Tender */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Tender"];
            };
          };
        };
      };
    };
  };
  "/tenders/{tender_id}": {
    get: {
      parameters: {
        path: {
          tender_id: number;
        };
      };
      responses: {
        /** @description Tender */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Tender"];
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          tender_id: number;
        };
      };
      responses: {
        /** @description Tender is deleted */
        200: never;
      };
    };
    patch: {
      parameters: {
        path: {
          tender_id: number;
        };
      };
      requestBody: {
        content: {
          "multipart/form-data": {
            title?: string;
            description?: string;
            starting_price?: number;
            duration?: number;
            /** Format: binary */
            tecnical_specification?: string;
          };
        };
      };
      responses: {
        /** @description Updated tender's data */
        200: {
          content: {
            "application/json": {
              data?: components["schemas"]["Tender"];
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
      views?: number;
      display_name?: string;
      description?: string;
      location?: string;
      industry?: string;
      owned_intellectual_resources?: string | null;
      owned_material_resources?: string | null;
      tin?: string;
      legal_structure?: string | null;
      perfomance?: string | null;
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
      logo?: components["schemas"]["Attachment"];
      video_introduction?: components["schemas"]["Attachment"];
      presentation?: components["schemas"]["Attachment"];
      business_plan?: components["schemas"]["Attachment"];
      created_at?: string;
      updated_at?: string;
    };
    Skill: {
      id?: number;
      profile_id?: number;
      name?: string;
    };
    Chat: {
      id?: number;
      project_id?: number | null;
      name?: string;
      created_at?: string;
    };
    Message: {
      id?: number;
      user_id?: number;
      chat_id?: number;
      message?: string;
      created_at?: string;
    };
    Auction: {
      id?: number;
      profile_id?: number;
      title?: string;
      description?: string;
      industry?: string;
      duration?: string;
      starting_price?: number | null;
      purchase_price?: number | null;
      technical_specification?: components["schemas"]["Attachment"];
      photo_one?: components["schemas"]["Attachment"];
      photo_two?: components["schemas"]["Attachment"];
      photo_three?: components["schemas"]["Attachment"];
      photo_four?: components["schemas"]["Attachment"];
      photo_five?: components["schemas"]["Attachment"];
      won_auction_bid_id?: number;
      won_auction_bid?: components["schemas"]["AuctionBid"];
      verified_at?: string;
      created_at?: string;
      updated_at?: string;
    };
    AuctionBid: {
      id?: number;
      profile_id?: number;
      auction_id?: number;
      price?: number;
      created_at?: string;
      updated_at?: string;
    };
    ProjectMember: {
      id?: number;
      project_id?: number;
      profile_id?: number;
      application_message?: string;
      rejection_message?: string | null;
      /** Format: date-time */
      applied_at?: string;
      accepted_at?: string | null;
      rejected_at?: string | null;
    };
    OrganizationMember: {
      id?: number;
      profile_id?: number;
      application_message?: string;
      rejection_message?: string | null;
      /** Format: date-time */
      applied_at?: string;
      accepted_at?: string | null;
      rejected_at?: string | null;
    };
    Tender: {
      id?: number;
      profile_id?: number;
      won_tender_bid_id?: number | null;
      won_tender_bid?: components["schemas"]["TenderBid"];
      title?: string;
      description?: string;
      industry?: string;
      starting_price?: number | null;
      duration?: string;
      technical_specification?: components["schemas"]["Attachment"];
      /** Format: date-time */
      verified_at?: string;
      /** Format: date-time */
      created_at?: string;
      /** Format: date-time */
      updated_at?: string;
    };
    TenderBid: {
      id?: number;
      profile_id?: number;
      tender_id?: number;
      price?: number;
      /** Format: date-time */
      created_at?: string;
      /** Format: date-time */
      updated_at?: string;
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
