import { PlayerInPosition } from '../../../models/crud/PlayerInPosition';
import apiClient from '../../config/apiClient';

export const fetchAllTeamPlayerInPositions = async (
    seasonId: string,
    serieId: string,
    teamId: string
): Promise<PlayerInPosition[]> => {
    try {
        const response = await apiClient.get<PlayerInPosition[]>(
            `playerInPositions/series/${seasonId}/${serieId}/team/${teamId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch all team player positions:', error);
        throw new Error('Unable to fetch all team player positions. Please try again later.');
    }
};
