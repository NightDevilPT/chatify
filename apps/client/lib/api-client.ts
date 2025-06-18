// lib/api-client.ts
import {
	ApiErrorResponse,
	ApiSuccessResponse,
} from "@/interfaces/api.interface";
import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosError,
	AxiosResponse,
} from "axios";

export class ApiClient {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.initializeInterceptors();
	}

	private initializeInterceptors() {
		// Response interceptor
		this.instance.interceptors.response.use(
			(response: AxiosResponse<ApiSuccessResponse>) => {
				// Transform success responses to standard format
				return {
					...response,
					data: this.transformSuccessResponse(response.data),
				};
			},
			(error: AxiosError<ApiErrorResponse>) => {
				// Transform error responses to standard format
				return Promise.reject(this.transformErrorResponse(error));
			}
		);
	}

	private transformSuccessResponse(response: any): ApiSuccessResponse {
		// Ensure response matches our success format
		return {
			status: "success",
			statusCode: response.statusCode || 200,
			message: response.message || "Request succeeded",
			data: response.data || {},
			meta: {
				timeTakenMs: response.meta?.timeTakenMs || 0,
				timestamp: response.meta?.timestamp || new Date().toISOString(),
				path: response.meta?.path || "",
				...(response.meta || {}),
			},
		};
	}

	private transformErrorResponse(
		error: AxiosError<ApiErrorResponse>
	): ApiErrorResponse {
		if (error.response) {
			// Server responded with error status (4xx, 5xx)
			return {
				status: "error",
				statusCode: error.response.status,
				message: error.response.data?.message || error.message,
				error: error.response.data?.error || undefined,
				data: null,
				meta: {
					timestamp:
						error.response.data?.meta?.timestamp ||
						new Date().toISOString(),
					path:
						error.response.data?.meta?.path ||
						error.config?.url ||
						"",
				},
			};
		} else if (error.request) {
			// Request was made but no response received
			return {
				status: "error",
				statusCode: 503,
				message: "Service unavailable",
				error: "No response from server",
				data: null,
				meta: {
					timestamp: new Date().toISOString(),
					path: error.config?.url || "",
				},
			};
		} else {
			// Something happened in setting up the request
			return {
				status: "error",
				statusCode: 500,
				message: "Request failed",
				error: error.message,
				data: null,
				meta: {
					timestamp: new Date().toISOString(),
					path: error.config?.url || "",
				},
			};
		}
	}

	// Public methods
	public get<T>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<ApiSuccessResponse<T>> {
		return this.instance.get(url, config);
	}

	public post<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<ApiSuccessResponse<T>> {
		return this.instance.post(url, data, config);
	}

	public put<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<ApiSuccessResponse<T>> {
		return this.instance.put(url, data, config);
	}

	public patch<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<ApiSuccessResponse<T>> {
		return this.instance.patch(url, data, config);
	}

	public delete<T>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<ApiSuccessResponse<T>> {
		return this.instance.delete(url, config);
	}
}

export const apiClient = new ApiClient();
