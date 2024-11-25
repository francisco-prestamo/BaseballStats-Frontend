import apiClient from './apiClient';
import { Season, Series } from './types';

const SEASONS_URL = '/seasons';
const SERIES_URL = '/series';

// Fetch all seasons
export const fetchSeasons = async (): Promise<Season[]> => {
    const response = await apiClient.get(SEASONS_URL);
    return response.data;
};

// Fetch all series for a specific season
export const fetchSeriesBySeason = async (seasonId: string): Promise<Series[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}`);
    return response.data;
};