import apiClient from "../../config/apiClient";
import { PlayerInPosition } from "../../../models/crud/PlayerInPosition";

const PlayerInPosition_URL = "/playerInPositions";

const adminPlayerInPositionService = {
  // Obtener todos los PlayerInPosition
  getPlayerInPositions: async (): Promise<PlayerInPosition[]> => {
    const response = await apiClient.get(PlayerInPosition_URL);
    return response.data;
  },

  // Crear un nuevo PlayerInPosition
  createPlayerInPosition: async (
    playerInPosition: PlayerInPosition
  ): Promise<void> => {
    await apiClient.post(PlayerInPosition_URL, playerInPosition);
  },

  // Eliminar un PlayerInPosition (por ID del jugador y posición)
  deletePlayerInPosition: async (
    playerInPositionId: number,
    position: string
  ): Promise<void> => {
    await apiClient.delete(
      `${PlayerInPosition_URL}/${playerInPositionId}/${position}`
    );
  },

  // Actualizar un PlayerInPosition existente
  updatePlayerInPosition: async (
    playerInPosition: PlayerInPosition
  ): Promise<void> => {
    const { player, position } = playerInPosition;
    await apiClient.put(
      `${PlayerInPosition_URL}/${player.id}/${position}`,
      playerInPosition
    );
  },
};

export default adminPlayerInPositionService;
