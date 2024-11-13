import axios from 'axios';
import { Game, PlayerInPosition } from './types';
import { API_URL } from "./config.ts";

const GAMES_URL = `${API_URL}/games`;

// Fetch detailed info for a specific game
export const fetchGameDetails = async (gameId: string): Promise<Game> => {
    try {
        const response = await axios.get(`${GAMES_URL}/${gameId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch game details');
    }
};

// Fetch alignments of the teams in a game
export const fetchTeamAlignments = async (gameId: string): Promise<{ team1Alignment: PlayerInPosition[]; team2Alignment: PlayerInPosition[] }> => {
    try {
        const response = await axios.get(`${GAMES_URL}/${gameId}/alignments`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch team alignments');
    }
};

// Fetch player substitutions made during the game
export const fetchPlayerSubstitutions = async (gameId: string): Promise<{ team1Substitutions: PlayerInPosition[]; team2Substitutions: PlayerInPosition[] }> => {
    try {
        const response = await axios.get(`${GAMES_URL}/${gameId}/substitutions`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch player substitutions');
    }
};