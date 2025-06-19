import { apiClient } from "@/lib/api-client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ApiErrorResponse, ApiResponse } from "@/interfaces/api.interface";

// Define the mutation function to verify email
const verifyEmail = async (token: string): Promise<ApiResponse<void>> => {
	const response = await apiClient.get<ApiResponse<void>>(
		"/users/verify-email",
		{
			params: { token },
		}
	);
	return response.data;
};

export const useVerifyEmail = (
	options?: UseMutationOptions<ApiResponse<void>, Error, string>
) => {
	return useMutation({
		mutationFn: verifyEmail,
		onError: (error: any) => {
			const apiError = error.response?.data as ApiErrorResponse;
			console.error(
				"Verification Error:",
				apiError?.message || error.message
			);
		},
		onSuccess: (response: ApiResponse<void>) => {
			if (response.status === "error") {
				const apiError = response as ApiErrorResponse;
				console.error("Error during verification:", apiError.message);
			} else {
				console.log("Email verification successful:", response);
			}
		},
		...options,
	});
};
