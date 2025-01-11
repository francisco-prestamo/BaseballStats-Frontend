import apiClient from "../../config/apiClient";
import { Player } from "../../../models/crud/Player";
import { Team } from "../../../models/crud/Team";

// Define the URLs for the player and team resources
const PLAYERS_URL = "/players";
const TEAMS_URL = "/teams";

const adminPlayerService = {
  // Get all players
  getPlayers: async (): Promise<Player[]> => {
    const response = await apiClient.get(PLAYERS_URL);
    return response.data;
  },

  // Create a new player
  createPlayer: async (playerData: Omit<Player, "id">): Promise<Player> => {
    console.log(playerData);

    const response = await apiClient.post(PLAYERS_URL, playerData);
    return response.data;
  },

  // Update an existing player
  updatePlayer: async (player: Player): Promise<Player> => {
    const response = await apiClient.put(`${PLAYERS_URL}/${player.id}`, player);
    return response.data;
  },

  // Delete a player
  deletePlayer: async (playerId: number): Promise<void> => {
    await apiClient.delete(`${PLAYERS_URL}/${playerId}`);
  },

  // Get all teams
  getTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get(TEAMS_URL);
    return response.data;
  },
};

export default adminPlayerService;
