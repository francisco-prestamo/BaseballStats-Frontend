import apiClient from '../../config/apiClient';

const LOGIN_URL = 'auth/login';


// Login function
export const login = async (username: string, password: string): Promise<{ token: string; userType: string }> => {
    const response = await apiClient.post(LOGIN_URL, { username, password });
    const { token, userType } = response.data;


    return { token, userType };
};
