import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ToastAction } from "../components/primitives/toast";
import { toast } from "../hooks/useToast";
import { components, paths } from "./api-paths";

export interface AxiosError extends Error {
  response?: {
    status?: number;
    data?: any;
  };
}

const API_BASE_URL = "https://limpid.kz/api";

// const API_BASE_URL = "http://localhost:3000/api";

class APIClient {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  constructor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 402) {
          this.handlePaymentRequiredError();
        }
        return Promise.reject(error);
      }
    );
  }

  private handlePaymentRequiredError() {
    toast({
      title: "Нет попыток",
      description: "Купите подписку",
      variant: "destructive",
      action: (
        <ToastAction altText="try">
          <a href="https://limpid.kz/#pricing">Купить</a>
        </ToastAction>
      ),
    });
  }

  // Users
  async createUser(
    userData: paths["/users"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["User"] }>> {
    return this.axiosInstance.post("/users", userData);
  }

  // Session
  async loginUser(
    email: string,
    password: string
  ): Promise<
    AxiosResponse<{
      data: { type?: string; token?: string; expires_at?: string };
    }>
  > {
    return this.axiosInstance.post("/session", { email, password });
  }

  async logoutUser(): Promise<AxiosResponse<void>> {
    return this.axiosInstance.delete("/session");
  }

  // Email Verification
  async verifyEmailRequest(email: string): Promise<AxiosResponse<void>> {
    return this.axiosInstance.post("/email-verification", { email });
  }

  async verifyEmail(
    email: string,
    token: string
  ): Promise<AxiosResponse<void>> {
    return this.axiosInstance.patch("/email-verification", { email, token });
  }

  //Password recovery
  async recoverPassword(
    recoveryData: paths["/password-recovery"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<void>> {
    return this.axiosInstance.post("/password-recovery", recoveryData);
  }

  async updateRecoveredPassword(
    passwordData: paths["/password-recovery"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<void>> {
    return this.axiosInstance.patch("/password-recovery", passwordData);
  }

  // User
  async getUser(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data: components["schemas"]["User"] }>> {
    return this.axiosInstance.get("/user", config);
  }

  async updateUser(
    userData: components["schemas"]["User"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["User"] }>> {
    return this.axiosInstance.patch("/user", userData);
  }

  // Profiles
  async getProfiles(
    params: paths["/profiles"]["get"]["parameters"]["query"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Profile"][];
    }>
  > {
    return this.axiosInstance.get("/profiles", { params, ...config });
  }

  async createProfile(
    profileData: paths["/profiles"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    return this.axiosInstance.post("/profiles", profileData);
  }

  async getProfileById(
    profileId: number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    return this.axiosInstance.get(`/profiles/${profileId}`, config);
  }

  async updateProfile(
    profileId: number,
    profileData: paths["/profiles/{profile_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    const f = new FormData();

    Object.entries(profileData).forEach(([k, v]) => {
      if (v) {
        if (v === true) {
          f.append(k, `${v}`);
        }
        if (v instanceof File) {
          f.append(k, v);
        }
        if (typeof v === "string") {
          f.append(k, v);
        }
      }
    });

    return this.axiosInstance.patch(`/profiles/${profileId}`, f);
  }

  async deleteProfile(profileId: number): Promise<AxiosResponse<void>> {
    return this.axiosInstance.delete(`/profiles/${profileId}`);
  }

  // Profiles Education
  async createEducation(
    profile_id: number,
    educationData: paths["/profiles/{profile_id}/educations"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Education"] }>> {
    return this.axiosInstance.post(
      `/profiles/${profile_id}/educations`,
      educationData
    );
  }

  async getEducations(
    profile_id: number,
    params?: paths["/profiles/{profile_id}/educations"]["get"]["parameters"]["query"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Education"][];
    }>
  > {
    return this.axiosInstance.get(`/profiles/${profile_id}/educations`, {
      params,
      ...config,
    });
  }

  //Profile Education
  async getEducation(
    pathParams: paths["/profiles/{profile_id}/educations/{education_id}"]["get"]["parameters"]["path"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Education"] }>> {
    const { profile_id, education_id } = pathParams;
    return this.axiosInstance.get(
      `/profiles/${profile_id}/educations/${education_id}`
    );
  }

  async updateEducation(
    pathParams: paths["/profiles/{profile_id}/educations/{education_id}"]["patch"]["parameters"]["path"],
    educationData: paths["/profiles/{profile_id}/educations/{education_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Education"] }>> {
    const { profile_id, education_id } = pathParams;
    return this.axiosInstance.patch(
      `/profiles/${profile_id}/educations/${education_id}`,
      educationData
    );
  }

  async deleteEducation(
    pathParams: paths["/profiles/{profile_id}/educations/{education_id}"]["delete"]["parameters"]["path"]
  ): Promise<AxiosResponse<void>> {
    const { profile_id, education_id } = pathParams;
    return this.axiosInstance.delete(
      `/profiles/${profile_id}/educations/${education_id}`
    );
  }

  //Certificates
  async getCertificates(
    params: paths["/profiles/{profile_id}/certificates"]["get"]["parameters"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Certificate"][];
    }>
  > {
    const {
      path: { profile_id },
      query: queryParams,
    } = params;

    return this.axiosInstance.get(`/profiles/${profile_id}/certificates`, {
      ...config,
      params: queryParams,
    });
  }

  // Profiles Certificates
  async createCertificate(
    profile_id: number,
    certificateData: paths["/profiles/{profile_id}/certificates"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Certificate"] }>> {
    const f = new FormData();
    f.append("institution", certificateData.institution);
    f.append("title", certificateData.title);
    f.append("description", certificateData.description);
    f.append("issued_at", certificateData.issued_at);
    if (certificateData.expired_at) {
      f.append("expired_at", certificateData.expired_at);
    }
    f.append("attachment", certificateData.attachment);
    return this.axiosInstance.post(`/profiles/${profile_id}/certificates`, f);
  }

  async deleteCertificate(
    params: paths["/profiles/{profile_id}/certificates/{certificate_id}"]["delete"]["parameters"]["path"],
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<void>> {
    const { profile_id, certificate_id } = params;
    return this.axiosInstance.delete(
      `/profiles/${profile_id}/certificates/${certificate_id}`,
      config
    );
  }

  //Profile skills
  async getSkills(
    params: paths["/profiles/{profile_id}/skills"]["get"]["parameters"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Skill"][];
    }>
  > {
    const {
      path: { profile_id },
      query: queryParams,
    } = params;
    return this.axiosInstance.get(`/profiles/${profile_id}/skills`, {
      ...config,
      params: queryParams,
    });
  }

  async addSkill(
    params: paths["/profiles/{profile_id}/skills"]["post"]["parameters"],
    body: paths["/profiles/{profile_id}/skills"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["Skill"];
    }>
  > {
    const {
      path: { profile_id },
    } = params;
    return this.axiosInstance.post(`/profiles/${profile_id}/skills`, body);
  }

  async deleteSkill(
    params: paths["/profiles/{profile_id}/skills/{skill_id}"]["delete"]["parameters"]
  ): Promise<AxiosResponse<void>> {
    const {
      path: { profile_id, skill_id },
    } = params;
    return this.axiosInstance.delete(
      `/profiles/${profile_id}/skills/${skill_id}`
    );
  }

  //Profiles experiences
  async getExperiences(
    profile_id: number,
    params?: paths["/profiles/{profile_id}/experiences"]["get"]["parameters"]["query"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Experience"][];
    }>
  > {
    return this.axiosInstance.get(`/profiles/${profile_id}/experiences`, {
      params,
      ...config,
    });
  }

  async createExperience(
    profile_id: number,
    educationData: paths["/profiles/{profile_id}/experiences"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Education"] }>> {
    return this.axiosInstance.post(
      `/profiles/${profile_id}/experiences`,
      educationData
    );
  }

  async getExperience(
    params: paths["/profiles/{profile_id}/experiences/{experience_id}"]["get"]["parameters"]["path"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Experience"] }>> {
    const { profile_id, experience_id } = params;
    return this.axiosInstance.get(
      `/profiles/${profile_id}/experiences/${experience_id}`
    );
  }

  async deleteExperience(
    pathParams: paths["/profiles/{profile_id}/experiences/{experience_id}"]["delete"]["parameters"]["path"]
  ): Promise<AxiosResponse<void>> {
    const { profile_id, experience_id } = pathParams;
    return this.axiosInstance.delete(
      `/profiles/${profile_id}/experiences/${experience_id}`
    );
  }

  async updateExperience(
    pathParams: paths["/profiles/{profile_id}/experiences/{experience_id}"]["patch"]["parameters"]["path"],
    experienceData: paths["/profiles/{profile_id}/experiences/{experience_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Experience"] }>> {
    const { profile_id, experience_id } = pathParams;
    return this.axiosInstance.patch(
      `/profiles/${profile_id}/experiences/${experience_id}`,
      experienceData
    );
  }

  // Projects
  async getProjects(
    params?: paths["/projects"]["get"]["parameters"]["query"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Project"][];
    }>
  > {
    return this.axiosInstance.get(`/projects`, {
      params,
      ...config,
    });
  }

  // Project
  async createProject(
    data: paths["/projects"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Project"] }>> {
    return this.axiosInstance.post(`/projects`, data);
  }

  async getProject(
    project_id: number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data: components["schemas"]["Project"] }>> {
    return this.axiosInstance.get(`/projects/${project_id}`, config);
  }

  async updateProject(
    params: paths["/projects/{project_id}"]["patch"]["parameters"]["path"],
    projectData: paths["/projects/{project_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["Project"];
    }>
  > {
    const { project_id } = params;
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append(key, value);
        }
        if (typeof value === "string") {
          formData.append(key, value);
        }
      }
    });
    return this.axiosInstance.patch(`/projects/${project_id}`, formData);
  }

  async deleteProject(
    params: paths["/projects/{project_id}"]["delete"]["parameters"]["path"]
  ): Promise<AxiosResponse<void>> {
    const { project_id } = params;
    return this.axiosInstance.delete(`/projects/${project_id}`);
  }

  // Auction
  async getAuction(
    auction_id: number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Auction"] }>> {
    return this.axiosInstance.get(`/auctions/${auction_id}`, config);
  }

  async deleteAuction(auctionId: number): Promise<AxiosResponse<void>> {
    return this.axiosInstance.delete(`/auctions/${auctionId}`);
  }

  async getAuctionBids(
    params: {
      page: number;
      per_page?: number;
      auction_id?: number;
      industry?: string[];
      search?: string;
    },
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta?: components["schemas"]["Pagination"];
      data?: components["schemas"]["AuctionBid"][];
    }>
  > {
    const { auction_id, ...restParams } = params;
    return this.axiosInstance.get(`/auctions/${auction_id}/bids`, {
      ...config,
      params: restParams,
    });
  }

  async createAuctionBid(
    auctionId: number,
    price: number
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["AuctionBid"];
    }>
  > {
    return this.axiosInstance.post(`/auctions/${auctionId}/bids`, price);
  }

  async updateAuctionBid(
    pathParams: { auction_id: number; auction_bid_id: number },
    auctionBidData: { [key: string]: any }
  ): Promise<AxiosResponse<{ data?: components["schemas"]["AuctionBid"] }>> {
    const { auction_id, auction_bid_id } = pathParams;
    return this.axiosInstance.patch(
      `/auctions/${auction_id}/bids/${auction_bid_id}`,
      auctionBidData
    );
  }

  async getUserAuctionBid(
    auctionId: number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data?: components["schemas"]["AuctionBid"] }>> {
    return this.axiosInstance.get(`/auctions/${auctionId}/bids/user`, config);
  }

  // Project members
  async getProjectMembers(
    project_id: number,
    query?: { page?: number; per_page?: number },
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta?: components["schemas"]["Pagination"];
      data?: components["schemas"]["ProjectMember"][];
    }>
  > {
    return this.axiosInstance.get(`/projects/${project_id}/members`, {
      params: query,
      ...config,
    });
  }

  async addProjectMember(
    pathParams: paths["/projects/{project_id}/members"]["post"]["parameters"]["path"],
    applicationMessage: paths["/projects/{project_id}/members"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data?: components["schemas"]["ProjectMember"] }>> {
    const { project_id } = pathParams;
    return this.axiosInstance.post(
      `/projects/${project_id}/members`,
      applicationMessage
    );
  }

  async acceptProjectMember(
    project_id: number,
    member_id: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["ProjectMember"] }>> {
    return this.axiosInstance.post(
      `/projects/${project_id}/members/${member_id}/accept`
    );
  }

  async rejectProjectMember(
    project_id: number,
    member_id: number,
    rejection_message?: string
  ): Promise<AxiosResponse<{ data?: components["schemas"]["ProjectMember"] }>> {
    const formData = new FormData();
    if (rejection_message) {
      formData.append("rejection_message", rejection_message);
    }
    return this.axiosInstance.post(
      `/projects/${project_id}/members/${member_id}/reject`,
      formData
    );
  }

  async deleteProjectMember(
    project_id: number,
    member_id: number
  ): Promise<AxiosResponse<void>> {
    return this.axiosInstance.delete(
      `/projects/${project_id}/members/${member_id}`
    );
  }

  // Chats
  async createChat(
    requestBody: paths["/chats"]["post"]["requestBody"]["content"]["multipart/form-data"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["Chat"];
    }>
  > {
    return this.axiosInstance.post("/chats", requestBody, config);
  }

  async getChats(config?: AxiosRequestConfig): Promise<
    AxiosResponse<{
      data: components["schemas"]["Chat"][];
    }>
  > {
    return this.axiosInstance.get("/chats", {
      ...config,
    });
  }

  async getChat(
    id: number,
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      data: components["schemas"]["Chat"];
    }>
  > {
    return this.axiosInstance.get(`/chat/${id}`, {
      ...config,
    });
  }

  // Messages
  async getMessages(
    params: paths["/chats/{chat_id}/messages"]["get"]["parameters"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      // meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Message"][];
    }>
  > {
    const {
      path: { chat_id },
    } = params;
    return this.axiosInstance.get(`/chats/${chat_id}/messages`, {
      ...config,
    });
  }

  async sendMessage(
    chat_id: number,
    message: string
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Message"] }>> {
    const formData = new FormData();
    formData.append("message", message);
    return this.axiosInstance.post(`/chats/${chat_id}/messages`, formData);
  }

  // Organizations
  async getOrganizations(
    params: paths["/organizations"]["get"]["parameters"]["query"]
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Profile"][];
    }>
  > {
    return this.axiosInstance.get("/organizations", { params });
  }

  async createOrganization(
    organizationData: paths["/organizations"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    return this.axiosInstance.post("/organizations", organizationData);
  }

  async updateOrganization(
    organizationId: number,
    organizationData: paths["/organizations/{organization_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    const f = new FormData();

    Object.entries(organizationData).forEach(([k, v]) => {
      if (v) {
        if (v === true) {
          f.append(k, `${v}`);
        }
        if (v instanceof File) {
          f.append(k, v);
        }
        if (typeof v === "string") {
          f.append(k, v);
        }
      }
    });

    return this.axiosInstance.patch(`/organizations/${organizationId}`, f);
  }

  // Organization certificates
  async getOrganizationCertificates(
    params: paths["/organizations/{profile_id}/certificates"]["get"]["parameters"]
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Certificate"][];
    }>
  > {
    const { path, query } = params;
    return this.axiosInstance.get(
      `/organizations/${path.profile_id}/certificates`,
      { params: query }
    );
  }

  async createOrganizationCertificate(
    profile_id: number,
    certificateData: paths["/organizations/{profile_id}/certificates"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Certificate"] }>> {
    const f = new FormData();
    f.append("institution", certificateData.institution);
    f.append("title", certificateData.title);
    f.append("description", certificateData.description);
    f.append("issued_at", certificateData.issued_at);
    if (certificateData.expired_at) {
      f.append("expired_at", certificateData.expired_at);
    }
    f.append("attachment", certificateData.attachment);
    return this.axiosInstance.post(
      `/organizations/${profile_id}/certificates`,
      f
    );
  }

  // Auctions
  async getAuctions(
    params: paths["/auctions"]["get"]["parameters"]["query"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Auction"][];
    }>
  > {
    return this.axiosInstance.get("/auctions", { params, ...config });
  }

  async createAuction(
    body: paths["/auctions"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["Auction"];
    }>
  > {
    return this.axiosInstance.post("/auctions", body);
  }

  async updateAuction(
    auctionId: number,
    auctionData: paths["/auctions/{auction_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Auction"] }>> {
    const formData = new FormData();
    Object.entries(auctionData).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string" || typeof value === "number") {
          formData.append(key, String(value));
        }
      }
    });

    return this.axiosInstance.patch(`/auctions/${auctionId}`, formData);
  }

  //Tenders
  async getTenders(
    params: paths["/tenders"]["get"]["parameters"],
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta?: components["schemas"]["Pagination"];
      data?: components["schemas"]["Tender"][];
    }>
  > {
    const { query: queryParams } = params;
    return this.axiosInstance.get("/tenders", {
      ...config,
      params: queryParams,
    });
  }

  async getTender(
    tenderId: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Tender"] }>> {
    return this.axiosInstance.get(`/tenders/${tenderId}`);
  }

  async createTender(
    body: paths["/tenders"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<
    AxiosResponse<{
      data?: components["schemas"]["Tender"];
    }>
  > {
    return this.axiosInstance.post("/tenders", body);
  }

  async deleteTender(tenderId: number): Promise<AxiosResponse<never>> {
    return this.axiosInstance.delete(`/tenders/${tenderId}`);
  }

  async createTenderBid(
    tenderId: number,
    price: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["TenderBid"] }>> {
    const bidData = { price };
    return this.axiosInstance.post(`/tenders/${tenderId}/bid`, bidData);
  }

  async getTenderBids(
    tenderId: number,
    queryParams: { page: number; per_page?: number },
    config?: AxiosRequestConfig
  ): Promise<
    AxiosResponse<{
      meta?: components["schemas"]["Pagination"];
      data?: components["schemas"]["TenderBid"][];
    }>
  > {
    const endpoint = `/tenders/${tenderId}/bids`;
    const { page, per_page } = queryParams;
    const params = { page, per_page };
    return this.axiosInstance.get(endpoint, { ...config, params });
  }

  async getTenderBid(
    tenderId: number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<{ data?: components["schemas"]["TenderBid"] }>> {
    return this.axiosInstance.get(`/tenders/${tenderId}/bid`, config);
  }

  async updateTenderBid(
    tenderId: number,
    price?: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["TenderBid"] }>> {
    const requestBody = {
      price,
    };
    return this.axiosInstance.patch(`/tenders/${tenderId}/bid`, requestBody);
  }

  async updateTenderWinner(
    tenderId: number,
    wonTenderBidId: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Tender"] }>> {
    const requestBody = {
      won_tender_bid_id: wonTenderBidId,
    };

    return this.axiosInstance.patch(`/tenders/${tenderId}/winner`, requestBody);
  }

  // Payments
  async getInvoices(
    sub_plan_id: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Invoices"][] }>> {
    return this.axiosInstance.get(`/payments/${sub_plan_id}`);
  }

  //Notifications
  async getNotifications(
    page: number,
    perPage?: number
  ): Promise<
    AxiosResponse<{
      meta?: components["schemas"]["Pagination"];
      data?: components["schemas"]["Notification"][];
    }>
  > {
    const params = {
      page,
      per_page: perPage,
    };

    return this.axiosInstance.get("/notifications", { params });
  }

  async markNotificationAsRead(
    notificationId: number
  ): Promise<AxiosResponse<{ data?: components["schemas"]["Notification"] }>> {
    return this.axiosInstance.post(`/notifications/${notificationId}/read`);
  }
}

const api = new APIClient();

export default api;
