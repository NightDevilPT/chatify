// types/api-response.ts

/** Standard success response format */
export interface ApiSuccessResponse<T = any> {
	status: "success";
	statusCode: number;
	message: string;
	data: T;
	meta: {
		timeTakenMs: number;
		timestamp: string;
		path: string;
		[key: string]: any; // Additional meta properties
	};
}

/** Standard error response format */
export interface ApiErrorResponse {
	status: "error";
	statusCode: number;
	message: string;
	error?: any;
	data: null;
	meta: {
		timestamp: string;
		path: string;
	};
}

/** Union type for all API responses */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
