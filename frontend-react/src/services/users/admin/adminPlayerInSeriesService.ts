// src/services/users/admin/adminPlayerInSeriesService.ts
import apiClient from "../../config/apiClient";
import { PlayerInSeries } from "../../../models/crud/PlayerInSeries";

const PlayerInSeries_URL = "/PlayerInSeries"; // Ajustar según la URL de tu backend

const adminPlayerInSeriesService = {
  getPlayerInSeries: async (): Promise<PlayerInSeries[]> => {
    const response = await apiClient.get(PlayerInSeries_URL);
    return response.data;
  },

  createPlayerInSeries: async (
    PlayerInSerie: PlayerInSeries
  ): Promise<void> => {
    await apiClient.post(PlayerInSeries_URL, PlayerInSerie);
  },

  deletePlayerInSeries: async (
    playerInSerie: Omit<PlayerInSeries, "teamId">
  ): Promise<void> => {
    await apiClient.delete(
      `${PlayerInSeries_URL}/${playerInSerie.playerId}/${playerInSerie.seasonId}/${playerInSerie.serieId}`
    );
  },

  updatePlayerInSeries: async (
    playerInSerie: PlayerInSeries
  ): Promise<void> => {
    await apiClient.put(
      `${PlayerInSeries_URL}/${playerInSerie.playerId}/${playerInSerie.seasonId}/${playerInSerie.serieId}`,
      playerInSerie
    );
  },
};

export default adminPlayerInSeriesService;
