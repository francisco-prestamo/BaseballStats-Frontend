import apiClient from "../../config/apiClient.ts";
import { Season } from "../../../models/Season.ts";

const SEASONS_URL = '/seasons';

const adminSeasonService = {
    // Get all seasons
    getSeasons: async (): Promise<Season[]> => {
        const response = await apiClient.get(SEASONS_URL);
        return response.data;
    },

    // Create a new season
    createSeason: async (seasonData: Season): Promise<Season> => {
        const response = await apiClient.post(SEASONS_URL, seasonData);
        return response.data;
    },

    // Update an existing season 
    updateSeason: async (oldId: number, updatedSeason: Season): Promise<Season> => {
        const response = await apiClient.put(`${SEASONS_URL}/${oldId}`, updatedSeason);
        return response.data;
    },

    // Delete a season
    deleteSeason: async (seasonId: number): Promise<void> => {
        await apiClient.delete(`${SEASONS_URL}/${seasonId}`);
    },
};

export default adminSeasonService;
