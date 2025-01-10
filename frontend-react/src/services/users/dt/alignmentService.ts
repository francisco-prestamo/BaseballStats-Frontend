import apiClient from '../../config/apiClient';
import { PlayerInPosition } from '../../../models/PlayerInPosition';

const ALIGNMENTS_URL = '/alignments';

/**
 * Fetches team alignment for a specific game, team, season, and series.
 *
 * @param gameId - The ID of the game.
 * @param teamId - The ID of the team.
 * @param seasonId - The ID of the season.
 * @param serieId - The ID of the series.
 * @returns Promise<PlayerInPosition[]> - The alignment data.
 */
export const fetchTeamAlignment = async (
    gameId: string,
    teamId: string,
    seasonId: string,
    serieId: string
): Promise<PlayerInPosition[]> => {
    try {
        const response = await apiClient.get<PlayerInPosition[]>(
            `${ALIGNMENTS_URL}/${gameId}/${teamId}/${seasonId}/${serieId}`
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch team alignment:', error);
        throw new Error('Unable to fetch team alignment. Please try again later.');
    }
};

/**
 * Saves the team alignment for a specific game, team, season, and series.
 *
 * @param gameId - The ID of the game.
 * @param teamId - The ID of the team.
 * @param seasonId - The ID of the season.
 * @param serieId - The ID of the series.
 * @param alignment - The alignment data to save.
 */
export const saveTeamAlignment = async (
    gameId: string,
    teamId: string,
    seasonId: string,
    serieId: string,
    alignment: PlayerInPosition[]
): Promise<void> => {
    try {
        await apiClient.put(
            `${ALIGNMENTS_URL}/${gameId}/${teamId}/${seasonId}/${serieId}`,
            alignment
        );
    } catch (error) {
        console.error('Failed to save team alignment:', error);
        throw new Error('Unable to save team alignment. Please try again later.');
    }
};