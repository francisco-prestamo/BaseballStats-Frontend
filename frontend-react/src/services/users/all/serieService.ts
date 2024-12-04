import apiClient from '../../config/apiClient.ts';
import {Serie} from "../../../models/Serie.ts";
import {Game} from "../../../models/Game.ts";
import {TeamWithExtras} from "../../../models/TeamWithExtras.ts";


const SERIES_URL = '/series';

// Fetch games in a specific series
export const fetchGamesInSeries = async (seasonId: string, serieId: string): Promise<Game[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}/${serieId}/games`);
    return response.data;
};

// Fetch teams in a specific series
export const fetchTeamsInSeries = async (seasonId: string, serieId: string): Promise<TeamWithExtras[]> => {
    const response = await apiClient.get(`${SERIES_URL}/${seasonId}/${serieId}/teams`);
    return response.data;
};

// Fetch all series
export const fetchAllSeries = async (): Promise<Serie[]> => {
    const response = await apiClient.get(SERIES_URL);
    return response.data;
};