import apiClient from '../../config/apiClient';
import { PlayerInPosition } from '../../../models/PlayerInPosition';
import {IsPitcher} from "../../../models/IsPitcher.ts";


const PLAYERS_URL = '/players';

export const fetchPlayerDetailsForSeasonAndSeries = async (
    playerId: string
): Promise<IsPitcher> => {
    const response = await apiClient.get(
        `${PLAYERS_URL}/orPitchers/${playerId}`
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
