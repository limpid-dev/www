import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { components, paths } from "./api-paths";

// const API_BASE_URL = "https://limpid.kz/api";
const API_BASE_URL = "http://localhost:3000/api";

class APIClient {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

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
    params: paths["/profiles"]["get"]["parameters"]["query"]
  ): Promise<
    AxiosResponse<{
      meta: components["schemas"]["Pagination"];
      data: components["schemas"]["Profile"][];
    }>
  > {
    return this.axiosInstance.get("/profiles", { params });
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

  async createExperience(
    profile_id: number,
    educationData: paths["/profiles/{profile_id}/experiences"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Education"] }>> {
    return this.axiosInstance.post(
      `/profiles/${profile_id}/experiences`,
      educationData
    );
  }
}

const api = new APIClient();

export default api;
