import axios from 'axios';

const API_URL = 'api-url';
const LOGIN_URL = `${API_URL}/login`;
const REGISTER_URL = `${API_URL}/register`;

// Login function
export const login = async (username: string, password: string): Promise<{ token: string; userType: string }> => {
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

// Register function
export const register = async (username: string, password: string): Promise<{ token: string; userType: string }> => {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    const data = await response.json();
    return {
        token: data.token,
        userType: data.userType,
    };
};

// Error handling
export const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred during the API call');
    }
    throw new Error('An unexpected error occurred');
};