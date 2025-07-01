import api from '@shared/api'; // Assuming @shared/api is configured to point to your backend base URL
import type { ApiErrorResponse } from '@shared/api/types'; // Assuming you have a type for API error responses
import axios, { AxiosError } from 'axios';

// Possible event types
export type EventType = "general" | "personal" | "group";

// Type for event received from API (matches your JSON structure)
export interface ApiEvent {
    id: string;
    name: string;
    description: string;
    timeStart: string; // ISO date string (e.g., "2025-07-01T14:14:45.060Z")
    timeEnd: string;   // ISO date string
    location: string;
    createdById: string; // Creator's ID (e.g., UUID)
    type: EventType;     // Added type field
    keywords: string[];  // From your sample data
    status: string;      // From your sample data
}

// Helper function for Axios error handling
const handleAxiosError = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
            // Check for a specific error message from the backend
            return axiosError.response.data.error;
        } else if (axiosError.message) {
            // Fallback to Axios's own error message
            return axiosError.message;
        }
    } else if (error instanceof Error) {
        // Handle generic JavaScript errors
        return error.message;
    }
    return defaultMessage; // Catch-all for unknown errors
};

/**
 * Fetches all events from the API.
 * @returns {Promise<ApiEvent[]>} A Promise that resolves to an array of events from the API.
 */
export const fetchEvents = async (): Promise<ApiEvent[]> => {
    try {
        // Assuming your `api` instance correctly prefixes with /api/v1 as implied by console log
        const response = await api.post<ApiEvent[]>('/Event/search', {});
        console.log('API Call: POST /Event/search - Response:', response.data);
        return response.data;
    } catch (error) {
        const msg = handleAxiosError(error, 'Неизвестная ошибка при загрузке событий');
        console.error('API Call: POST /Event/search - Error:', error);
        throw new Error(msg); // Re-throw with a user-friendly message
    }
};