import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ApiErrorResponse, ApiResponse } from "@/interfaces/api.interface";

// Define the DTO for reset password
interface ResetPasswordDto {
	token: string;
	newPassword: string;
}

// Define the mutation function to reset password
const resetPassword = async (
	data: ResetPasswordDto
): Promise<ApiResponse<void>> => {
	const response = await apiClient.post<ApiResponse<void>>(
		"/users/reset-password",
		data
	);
	return response.data;
};

export const useResetPassword = (
	options?: UseMutationOptions<ApiResponse<void>, Error, ResetPasswordDto>
) => {
	return useMutation({
		mutationFn: resetPassword,
		onError: (error: any) => {
			const apiError = error.response?.data as ApiErrorResponse;
			console.error(
				"Reset Password Error:",
				apiError?.message || error.message
			);
		},
		onSuccess: (response: ApiResponse<void>) => {
			if (response.status === "error") {
				const apiError = response as ApiErrorResponse;
				console.error("Error during password reset:", apiError.message);
			} else {
				console.log("Password reset successful:", response);
			}
		},
		...options,
	});
};
