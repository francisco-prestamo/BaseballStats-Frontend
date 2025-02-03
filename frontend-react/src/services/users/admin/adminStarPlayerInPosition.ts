import apiClient from "../../config/apiClient";
import { StarPlayerInPosition } from "../../../models/crud/StarPlayerInPosition";

// Define the URLs for the star player resources
const STAR_PLAYERS_URL = "/starPlayers";

const starPlayerService = {
  // Get all star players
  getStarPlayers: async (): Promise<StarPlayerInPosition[]> => {
    const response = await apiClient.get(STAR_PLAYERS_URL);
    return response.data;
  },

  // Create a new star player
  createStarPlayer: async (
    starPlayerData: Omit<StarPlayerInPosition, "idPlayer">
  ): Promise<StarPlayerInPosition> => {
    console.log(starPlayerData);

    const response = await apiClient.post(STAR_PLAYERS_URL, starPlayerData);
    return response.data;
  },

  // Delete a star player
  deleteStarPlayer: async (playerId: number): Promise<void> => {
    await apiClient.delete(`${STAR_PLAYERS_URL}/${playerId}`);
  },
};

export default starPlayerService;
