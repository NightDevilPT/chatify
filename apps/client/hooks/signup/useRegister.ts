// hooks/useRegister.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client"; // Axios instance
import { FormData } from "@/app/auth/signup/_components/signup-form";
import { User } from "@/interfaces/user.interface"; // Import the User interface
import { ApiErrorResponse, ApiResponse } from "@/interfaces/api.interface";

// Define the mutation function to register a user
const registerUser = async (data: FormData): Promise<ApiResponse<User>> => {
	const response = await apiClient.post<ApiResponse<User>>(
		"/users/register",
		data
	);
	return response.data;
};

export const useRegister = (
	options?: UseMutationOptions<ApiResponse<User>, Error, FormData>
) => {
	return useMutation({
		mutationFn: registerUser,
		onError: (error: any) => {
			// Handle the error response and log it
			if (error.response?.data?.status === "error") {
				// You can display a custom error message or further handle it
			}
			const apiError = error.response.data as ApiErrorResponse;
			console.error("API Error:", apiError.message);
		},
		onSuccess: (response: ApiResponse<User>) => {
			if (response.status === "error") {
				const apiError = response as ApiErrorResponse;
				console.error("Error during registration:", apiError.message);
				// Handle specific error responses, such as "User already exists"
				if (apiError.statusCode === 409) {
					// You can show a message to the user about the conflict
					alert(apiError.message); // For example
				}
			} else {
				console.log("Registration successful:", response);
				// Handle successful registration logic (e.g., user redirects, etc.)
			}
		},
		...options,
	});
};
