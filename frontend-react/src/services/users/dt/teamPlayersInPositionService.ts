import { PlayerInPosition } from '../../../models/crud/PlayerInPosition';


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
