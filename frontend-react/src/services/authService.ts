import apiClient from './apiClient';

const LOGIN_URL = '/login';
const REGISTER_URL = '/register';

// Login function
export const login = async (username: string, password: string): Promise<{ token: string; userType: string }> => {
    const response = await apiClient.post(LOGIN_URL, { username, password });
    const { token, userType } = response.data;


    return { token, userType };
};

// Register function
export const register = async (username: string, password: string): Promise<{ token: string; userType: string }> => {
    const response = await apiClient.post(REGISTER_URL, { username, password });
    const { token, userType } = response.data;

    return { token, userType };
};