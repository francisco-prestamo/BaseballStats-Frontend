import apiClient from "../../config/apiClient";
import { PlayerInPosition } from "../../../models/crud/PlayerInPosition";

const PlayerInPosition_URL = "/PlayerInPositions"; // Ajustar según la URL de tu backend

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
    await apiClient.put(
      `${PlayerInPosition_URL}/${playerInPosition.playerId}/${playerInPosition.position}`,
      playerInPosition
    );
  },
};

export default adminPlayerInPositionService;
