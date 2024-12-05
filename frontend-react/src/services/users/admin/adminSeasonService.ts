import apiClient from "../../config/apiClient.ts";
import { Season } from "../../../models/Season.ts";

// API endpoint paths
const SEASONS_URL = '/seasons';

const adminSeasonService = {
    // Get all seasons
    getSeasons: async (): Promise<Season[]> => {
        const response = await apiClient.get(SEASONS_URL);
        return response.data; // Adjust if API response structure differs
    },

    // Create a new season
    createSeason: async (seasonData: Omit<Season, 'id'>): Promise<Season> => {
        const response = await apiClient.post(SEASONS_URL, seasonData);
        return response.data; // Adjust if API response structure differs
    },

    // Update an existing season
    updateSeason: async (season: Season): Promise<Season> => {
        const response = await apiClient.put(`${SEASONS_URL}/${season.id}`, season);
        return response.data; // Adjust if API response structure differs
    },

    // Delete a season
    deleteSeason: async (seasonId: number): Promise<void> => {
        await apiClient.delete(`${SEASONS_URL}/${seasonId}`);
    },
};

export default adminSeasonService;