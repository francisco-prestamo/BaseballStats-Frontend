import apiClient from "../../config/apiClient";
import { Game } from "../../../models/crud/Game.ts";

const GAMES_URL = "/games";

const adminGameService = {
  // Get all games
  getGames: async (): Promise<Game[]> => {
    const response = await apiClient.get(GAMES_URL);
    return response.data;
  },

  // Create a new game
  createGame: async (game: Game): Promise<Game> => {
    const response = await apiClient.post(GAMES_URL,
      {...game, date: new Date(game.date).toISOString().split('T')[0]}
    );
    return response.data;
  },

  // Update an existing game
  updateGame: async (game: Game): Promise<Game> => {
    const response = await apiClient.put(`${GAMES_URL}/${game.id}`, game);
    return response.data;
  },

  // Delete a game
  deleteGame: async (gameId: number): Promise<void> => {
    await apiClient.delete(`${GAMES_URL}/${gameId}`);
  },
};

export default adminGameService;
