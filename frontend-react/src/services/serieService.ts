import apiClient from './apiClient';
import { Game, Team } from './types';
import { Series } from './types';

const SERIES_URL = '/series';

// Fetch games in a specific series
export const fetchGamesInSeries = async (seasonId: string, serieId: string): Promise<Game[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}/${serieId}/games`);
    return response.data;
};

// Fetch teams in a specific series
export const fetchTeamsInSeries = async (seasonId: string, serieId: string): Promise<Team[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}/${serieId}/teams`);
    return response.data;
};

// Fetch all series
export const fetchAllSeries = async (): Promise<Series[]> => {
    const response = await apiClient.get(SERIES_URL);
    return response.data;
};