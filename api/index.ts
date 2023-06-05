import axios, { AxiosResponse } from "axios";
import { components, paths } from "./api-paths";

const API_BASE_URL = "http://localhost:3000/api";

class APIClient {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  async createUser(
    userData: components["schemas"]["User"]
  ): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.post("/users", userData);
  }

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

  async logoutUser(): Promise<AxiosResponse> {
    return this.axiosInstance.delete("/session");
  }

  async getUser(): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.get("/user");
  }

  async updateUser(
    userData: components["schemas"]["User"]
  ): Promise<AxiosResponse<components["schemas"]["User"]>> {
    return this.axiosInstance.patch("/user", userData);
  }

  async getProfiles(
    queryParams: paths["/profiles"]["get"]["parameters"]["query"]
  ): Promise<AxiosResponse<components["schemas"]["Profile"][]>> {
    return this.axiosInstance.get("/profiles", { params: queryParams });
  }

  async createProfile(
    profileData: paths["/profiles"]["post"]["requestBody"]["content"]["multipart/form-data"]
  ): Promise<AxiosResponse<components["schemas"]["Profile"]>> {
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
