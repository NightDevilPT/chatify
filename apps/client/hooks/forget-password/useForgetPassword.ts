import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiErrorResponse, ApiResponse } from "@/interfaces/api.interface";

// Define the DTO for forgot password
interface ForgotPasswordDto {
	email: string;
}

// Define the mutation function to request a password reset
const forgotPassword = async (
	data: ForgotPasswordDto
): Promise<ApiResponse<void>> => {
	const response = await apiClient.post<ApiResponse<void>>(
		"/users/forgot-password",
		data
	);
	return response.data;
};

export const useForgotPassword = (
	options?: UseMutationOptions<ApiResponse<void>, Error, ForgotPasswordDto>
) => {
	return useMutation({
		mutationFn: forgotPassword,
		onError: (error: any) => {
			const apiError = error.response?.data as ApiErrorResponse;
			console.error(
				"Forgot Password Error:",
				apiError?.message || error.message
			);
		},
		onSuccess: (response: ApiResponse<void>) => {
			if (response.status === "error") {
				const apiError = response as ApiErrorResponse;
				console.error(
					"Error during password reset request:",
					apiError.message
				);
			} else {
				console.log("Password reset link sent successfully:", response);
			}
		},
		...options,
	});
};
