// hooks/useLogin.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client"; // Axios instance
import { ApiErrorResponse, ApiResponse } from "@/interfaces/api.interface"; // Error & Success Response Interfaces
import { User } from "@/interfaces/user.interface"; // User Interface

// Define the request payload structure for login (email and password)
interface LoginPayload {
	email: string;
	password: string;
}

// Define the response structure for successful login
interface LoginResponse {
	user: User;
}

// Define the mutation function to login a user
const loginUser = async (
	data: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
	const response = await apiClient.post<ApiResponse<LoginResponse>>(
		"/users/login",
		data
	);
	return response.data; // This returns the response object with access token, refresh token, and user data
};

// Define the `useLogin` hook
export const useLogin = (
	options?: UseMutationOptions<
		ApiResponse<LoginResponse>,
		Error,
		LoginPayload
	>
) => {
	return useMutation({
		mutationFn: loginUser, // The mutation function for login
		onError: (error: any) => {
			// Handle the error response and log it
			if (error.response?.data?.status === "error") {
				const apiError = error.response.data as ApiErrorResponse;
				console.error("API Error:", apiError.message);
			}
		},
		onSuccess: (response: ApiResponse<LoginResponse>) => {
			if (response.status === "error") {
				const apiError = response as ApiErrorResponse;
				console.error("Login error:", apiError.message);
			} else {
				console.log("Login successful:", response);
				// Handle successful login logic (e.g., saving tokens in localStorage or redirecting the user)
			}
		},
		...options, // Allow for additional options to be passed to the mutation
	});
};
