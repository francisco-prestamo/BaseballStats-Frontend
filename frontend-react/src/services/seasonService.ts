import axios from 'axios';
import { Season, Series } from './types';

const API_URL = 'api-url';
const SEASONS_URL = `${API_URL}/seasons`;
const SERIES_URL = `${API_URL}/series`;

// Fetch all seasons
export const fetchSeasons = async (): Promise<Season[]> => {
    try {
        const response = await axios.get(SEASONS_URL);
        return response.data as Season[];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch seasons');
    }
};

// Fetch all series for a specific season
export const fetchSeriesBySeason = async (seasonId: string): Promise<Series[]> => {
    try {
        const response = await axios.get(`${SERIES_URL}/${seasonId}`);
        return response.data as Series[];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch series for the selected season');
    }
};