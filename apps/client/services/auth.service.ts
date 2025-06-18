// services/auth-service.ts
import { apiClient } from "@/lib/api-client";
import { User } from "@/interfaces/user.interface";
import { ApiSuccessResponse } from "@/interfaces/api.interface";
import { FormData } from "@/app/auth/signup/_components/signup-form";

export class AuthService {
	async register(
		credentials: FormData
	): Promise<ApiSuccessResponse<{ data: User }>> {
		return apiClient.post("/users/register", credentials);
	}

	async logout() {
		return apiClient.post("/auth/logout");
	}

	async getCurrentUser() {
		return apiClient.get("/auth/me");
	}

	async refreshToken() {
		return apiClient.post("/auth/refresh");
	}
}
