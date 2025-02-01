import apiClient from "../../config/apiClient";
import { Pitcher } from "../../../models/crud/Pitcher";

// Define the URLs for the pitcher resource
const PITCHERS_URL = "/pitchers";

const adminPitcherService = {
    // Get all pitchers
    getPitchers: async (): Promise<Pitcher[]> => {
        const response = await apiClient.get(PITCHERS_URL);
        return response.data;
    },

    // Create a new pitcher
    createPitcher: async (pitcherData: Omit<Pitcher, "playerId">): Promise<Pitcher> => {
        const response = await apiClient.post(PITCHERS_URL, pitcherData);
        return response.data;
    },

    // Update an existing pitcher
    updatePitcher: async (pitcher: Pitcher): Promise<Pitcher> => {
        const response = await apiClient.put(`${PITCHERS_URL}/${pitcher.id}`, pitcher);
        return response.data;
    },

    // Delete a pitcher
    deletePitcher: async (playerId: number): Promise<void> => {
        await apiClient.delete(`${PITCHERS_URL}/${playerId}`);
    },
};

export default adminPitcherService;