import apiClient from '../../config/apiClient';
import { PlayerInPosition } from '../../../models/PlayerInPosition';

const ALIGNMENTS_URL = '/games';

export const fetchTeamAlignment = async (
    gameId: string,
    teamId: string,
): Promise<PlayerInPosition[]> => {
    try {
        const response = await apiClient.get<PlayerInPosition[]>(
            `${ALIGNMENTS_URL}/${gameId}/alignments/${teamId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch team alignment:', error);
        throw new Error('Unable to fetch team alignment. Please try again later.');
    }
};

export const fetchAllTeamPlayerInPositions = async (
    seasonId: string,
    serieId: string,
    teamId: string
): Promise<PlayerInPosition[]> => {
    try {
        const response = await apiClient.get<PlayerInPosition[]>(
            `playerspositions/${seasonId}/${serieId}/${teamId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch all team player positions:', error);
        throw new Error('Unable to fetch all team player positions. Please try again later.');
    }
};

export const saveTeamAlignment = async (
    gameId: string,
    teamId: string,
    alignment: PlayerInPosition[]
): Promise<void> => {
    try {
        await apiClient.put(
            `${ALIGNMENTS_URL}/${gameId}/alignments/${teamId}`,
            {
                gameId: gameId,
                teamId: teamId,
                alignment: alignment
            } 
        );
    } catch (error) {
        console.error('Failed to save team alignment:', error);
        throw new Error('Unable to save team alignment. Please try again later.');
    }
};
