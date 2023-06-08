import axios, { AxiosResponse } from "axios";
import { components, paths } from "./api-paths";

const API_BASE_URL = "http://localhost:3000/api";

class APIClient {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  // Users
  async createUser(
    userData: paths["/users"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.post("/users", userData);
  }

  // Session
  async loginUser(
    email: string,
    password: string
  ): Promise<
    AxiosResponse<{ type?: string; token?: string; expires_at?: string }>
  > {
    return this.axiosInstance.post("/session", {
      email,
      password,
    });
  }

  // Session
  async logoutUser(): Promise<AxiosResponse> {
    return this.axiosInstance.delete("/session");
  }

  // Email Verification
  async verifyEmailRequest(email: string): Promise<AxiosResponse> {
    return this.axiosInstance.post("/email-verification", {
      email,
    });
  }

  async verifyEmail(email: string, token: string): Promise<AxiosResponse> {
    return this.axiosInstance.patch("/email-verification", {
      email,
      token,
    });
  }

  //Password recovery
  async recoverPassword(
    recoveryData: paths["/password-recovery"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<void> {
    await this.axiosInstance.post("/password-recovery", recoveryData);
  }

  async updateRecoveredPassword(
    passwordData: paths["/password-recovery"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<void> {
    await this.axiosInstance.patch("/password-recovery", passwordData);
  }

  // User
  async getUser(): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.get("/user");
  }

  async updateUser(
    userData: components["schemas"]["User"]
  ): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.patch("/user", userData);
  }

  // Profiles
  async getProfiles(
    queryParams: paths["/profiles"]["get"]["parameters"]["query"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"][] }>> {
    return this.axiosInstance.get("/profiles", { params: queryParams });
  }

  async createProfile(
    profileData: paths["/profiles"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<{ data: components["schemas"]["Profile"] }>> {
    return this.axiosInstance.post("/profiles", profileData);
  }

  async getProfileById(
    profileId: number
  ): Promise<AxiosResponse<components["schemas"]["Profile"]>> {
    return this.axiosInstance.get(`/profiles/${profileId}`);
  }

  async updateProfile(
    profileId: number,
    profileData: paths["/profiles/{profile_id}"]["patch"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<components["schemas"]["Profile"]>> {
    return this.axiosInstance.patch(`/profiles/${profileId}`, profileData);
  }

  async deleteProfile(profileId: number): Promise<AxiosResponse> {
    return this.axiosInstance.delete(`/profiles/${profileId}`);
  }
}

const api = new APIClient();

export default api;
