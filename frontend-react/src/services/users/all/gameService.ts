import apiClient from '../../config/apiClient.ts';
import {Game} from "../../../models/Game.ts";
import {PlayerInPosition} from "../../../models/PlayerInPosition.ts";
import {Change} from "../../../models/Change.ts";


const GAMES_URL = '/games';

// Fetch detailed info for a specific game
export const fetchGameDetails = async (gameId: string): Promise<Game> => {
    const response = await apiClient.get(`${GAMES_URL}/${gameId}`);
    return response.data;
};

// Fetch alignments of the teams in a game
export const fetchTeamAlignments = async (gameId: string): Promise<{ team1Alignment: PlayerInPosition[]; team2Alignment: PlayerInPosition[] }> => {
    const response = await apiClient.get(`${GAMES_URL}/${gameId}/alignments`);
    return response.data;
};

// Fetch player substitutions made during the game
export const fetchPlayerSubstitutions = async (gameId: string): Promise<{ team1Substitutions: Change[]; team2Substitutions: Change[] }> => {
    const response = await apiClient.get(`${GAMES_URL}/${gameId}/substitutions`);
    return response.data;
};