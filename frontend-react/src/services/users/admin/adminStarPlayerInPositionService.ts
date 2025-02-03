import apiClient from "../../config/apiClient";
import { StarPlayerInPosition } from "../../../models/crud/StarPlayerInPosition";

// Define the URLs for the star player resources
const STAR_PLAYERS_URL = "/starPlayerInPosition";

const starPlayerService = {
  // Get all star players
  getStarPlayersInASerie: async (
    idSeason: string,
    idSerie: string
  ): Promise<StarPlayerInPosition[]> => {
    const response = await apiClient.get(
      `${STAR_PLAYERS_URL}/${idSerie}/${idSeason}`
    );
    return response.data;
  },

  // Create a new star player
  createStarPlayer: async (
    starPlayerData: StarPlayerInPosition
  ): Promise<StarPlayerInPosition> => {
    const response = await apiClient.post(
      `${STAR_PLAYERS_URL}/${starPlayerData.idSerie}/${starPlayerData.idSeason}
      /${starPlayerData.idPlayer}/${starPlayerData.position}`,
      starPlayerData
    );
    return response.data;
  },

  // Delete a star player
  deleteStarPlayer: async (
    starPlayerData: Omit<StarPlayerInPosition, "position">
  ): Promise<void> => {
    await apiClient.delete(`${STAR_PLAYERS_URL}/${starPlayerData.idSerie}/${starPlayerData.idSeason}
      /${starPlayerData.idPlayer}`);
  },
};

export default starPlayerService;
