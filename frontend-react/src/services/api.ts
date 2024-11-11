import axios from 'axios';

const API_URL = 'https://your-api-url.com';
const LOGIN_URL = API_URL+'/login';

export const login = async (username: string, password: string): Promise<{ token: string, userType: string }> => {
    // Replace with your actual API call
    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const data = await response.json();
    return {
        token: data.token,
        userType: data.userType,
    };
};


// Error handling utility
export const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        // Handle Axios errors
        throw new Error(error.response?.data?.message || 'An error occurred during the API call');
    }
    // Handle other types of errors
    throw new Error('An unexpected error occurred');
};