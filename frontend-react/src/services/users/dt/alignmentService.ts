import apiClient from '../../config/apiClient';
import { PlayerInPosition } from '../../../models/PlayerInPosition';

const ALIGNMENTS_URL = '/alignments';

export const fetchTeamAlignment = async (
    gameId: string,
    teamId: string,
    seasonId: string,
    serieId: string
): Promise<PlayerInPosition[]> => {
    const response = await apiClient.get(`${ALIGNMENTS_URL}/${gameId}/team/${teamId}/seasons/${seasonId}/series/${serieId}`, {
        params: { seasonId, serieId },
    });
    return response.data;
};

export const saveTeamAlignment = async (
    gameId: string,
    teamId: string,
    seasonId: string,
    serieId: string,
    alignment: PlayerInPosition[]
): Promise<void> => {
    await apiClient.put(`${ALIGNMENTS_URL}/${gameId}/teams/${teamId}`, { alignment }, {
        params: { seasonId, serieId },
    });
};