import apiClient from '../../config/apiClient.ts';
import {Season} from "../../../models/Season.ts";
import {Serie} from "../../../models/Serie.ts";

const SEASONS_URL = '/seasons';
const SERIES_URL = '/series';

// Fetch all seasons
export const fetchSeasons = async (): Promise<Season[]> => {
    const response = await apiClient.get(SEASONS_URL);
    return response.data;
};

// Fetch all series for a specific season
export const fetchSeriesBySeason = async (seasonId: string): Promise<Serie[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}`);
    return response.data;
};