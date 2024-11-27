import apiClient from "../../config/apiClient.ts";
import {User} from "../../../models/User.ts";


// API endpoint paths
const USERS_URL = '/users';

// Admin User Service
const adminUserService = {
    // Register User
    registerUser: async (userData: User) => {
        const response = await apiClient.post(USERS_URL, userData);
        return response.data; // Adjust if API response structure differs
    },

    // Get All Users
    getUsers: async (): Promise<User[]> => {
        const response = await apiClient.get(USERS_URL);
        return response.data; // Adjust if API response structure differs
    },

    // Update User
    updateUser: async (userData: User) => {
        if (!userData.username) {
            throw new Error('Username is required for updating a user');
        }
        const response = await apiClient.put(`${USERS_URL}/${userData.username}`, userData);
        return response.data; // Adjust if API response structure differs
    },

    // Delete User
    deleteUser: async (username: string) => {
        const response = await apiClient.delete(`${USERS_URL}/${username}`);
        return response.data; // Adjust if API response structure differs
    },
};

export default adminUserService;