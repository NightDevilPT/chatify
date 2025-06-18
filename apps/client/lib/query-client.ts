// lib/queryClient.ts

import { QueryClient } from "@tanstack/react-query";

// Create a new instance of QueryClient
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false, // Don't refetch on window focus by default
			retry: 1, // Retry failed queries once
		},
		mutations: {
			// You can customize mutation behavior here
		},
	},
});

export default queryClient;
