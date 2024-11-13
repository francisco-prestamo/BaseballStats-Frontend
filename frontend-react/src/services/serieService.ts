import axios from 'axios';
import { Game, Team } from './types';
import {API_URL} from "./config.ts";


const SERIES_URL = `${API_URL}/series`;

// Fetch games in a specific series
export const fetchGamesInSeries = async (seasonId: string, serieId: string): Promise<Game[]> => {
    try {
        const response = await axios.get(`${SERIES_URL}/${seasonId}/${serieId}/games`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch games in the series');
    }
};

// Fetch teams in a specific series
export const fetchTeamsInSeries = async (seasonId: string, serieId: string): Promise<Team[]> => {
    try {
        const response = await axios.get(`${SERIES_URL}/${seasonId}/${serieId}/teams`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch teams in the series');
    }
};