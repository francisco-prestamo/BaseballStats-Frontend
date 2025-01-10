import apiClient from '../../config/apiClient';
import { PlayerInPosition } from '../../../models/PlayerInPosition';
import {Player} from "../../../models/Player.ts";
import {Team} from "../../../models/Team.ts";

const PLAYERS_URL = '/players';

export const fetchPlayerDetailsForSeasonAndSeries = async (
    playerId: string,
    seasonId: string,
    serieId: string
): Promise<Player> => {
    const response = await apiClient.get(
        `${PLAYERS_URL}/${playerId}/season/${seasonId}/series/${serieId}`
    );
    return response.data;
};

export const fetchPlayerPositionsForSeasonAndSeries = async (
    playerId: string,
    seasonId: string,
    serieId: string
): Promise<PlayerInPosition[]> => {
    const response = await apiClient.get(
        `${PLAYERS_URL}/${playerId}/season/${seasonId}/series/${serieId}/positions`
    );
    return response.data;
};

export const fetchPlayerTeamForSeasonAndSeries = async (
    playerId: string,
    seasonId: string,
    serieId: string
): Promise<Team> => {
    const response = await apiClient.get(
        `${PLAYERS_URL}/${playerId}/season/${seasonId}/series/${serieId}/team`
    );
    return response.data;
};