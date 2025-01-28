import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTeamAlignment,
  saveTeamAlignment,
} from "../../../services/users/dt/alignmentService";
import {
  fetchAllTeamPlayerInPositions,
} from "../../../services/users/dt/teamPlayersInPositionService";
import { fetchTeamPlayersInASerie } from "../../../services/users/all/TeamService";
import { PlayerInPosition } from "../../../models/PlayerInPosition";
import { Player } from "../../../models/Player";
import { GiBaseballGlove } from "react-icons/gi";

const EditAlignment: React.FC = () => {
  const { gameId, teamId, seasonId, serieId } = useParams<{
    gameId: string;
    teamId: string;
    seasonId: string;
    serieId: string;
  }>();
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState<PlayerInPosition[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [availablePositions, setAvailablePositions] = useState<
    { playerId: number; position: string }[]
  >([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAlignmentAndPlayers = async () => {
      if (!gameId || !teamId || !seasonId || !serieId) {
        setError("Missing required parameters");
        return;
      }

      try {
        const [defaultAlignment, pairs, players] = await Promise.all([
          fetchTeamAlignment(gameId, teamId),
          fetchAllTeamPlayerInPositions(seasonId, serieId, teamId),
          fetchTeamPlayersInASerie(seasonId, serieId, teamId),
        ]);

        const playersMap = new Map(players.map((player) => [player.id, player]));

        const populatedAlignment = defaultAlignment.map((item) => ({
          ...item,
          player: playersMap.get(item.player?.id || 0) || null,
        }));

        setAlignment(populatedAlignment);
        setAvailablePositions(pairs);
        setTeamPlayers(players);
        
        // Update selected players based on populated alignment
        const selectedPlayerIds = new Set(
          populatedAlignment
            .map((item) => item.player?.id)
            .filter((id): id is number => id !== undefined && id !== null)
        );
        setSelectedPlayers(selectedPlayerIds);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    loadAlignmentAndPlayers();
  }, [gameId, teamId, seasonId, serieId]);

  const handlePlayerChange = (index: number, newPlayerId: string) => {
    if (!newPlayerId) {
      setAlignment((prevAlignment) => {
        const updatedAlignment = [...prevAlignment];
        // Remove player from position
        updatedAlignment[index] = {
          ...updatedAlignment[index],
          player: null,
        };
        
        // Update selected players
        const newSelectedPlayers = new Set(selectedPlayers);
        const oldPlayerId = prevAlignment[index].player?.id;
        if (oldPlayerId) {
          newSelectedPlayers.delete(oldPlayerId);
        }
        setSelectedPlayers(newSelectedPlayers);
        
        return updatedAlignment;
      });
      return;
    }

    const playerIdNumber = parseInt(newPlayerId, 10);
    const selectedPlayer = teamPlayers.find((player) => player.id === playerIdNumber);

    if (!selectedPlayer) {
      console.error(`Player with ID ${playerIdNumber} not found`);
      return;
    }

    setAlignment((prevAlignment) => {
      const updatedAlignment = [...prevAlignment];
      const oldPlayerId = prevAlignment[index].player?.id;
      
      // Update the alignment
      updatedAlignment[index] = {
        ...updatedAlignment[index],
        player: selectedPlayer,
      };

      // Update selected players
      const newSelectedPlayers = new Set(selectedPlayers);
      if (oldPlayerId) {
        newSelectedPlayers.delete(oldPlayerId);
      }
      newSelectedPlayers.add(playerIdNumber);
      setSelectedPlayers(newSelectedPlayers);

      return updatedAlignment;
    });
  };

  const handleSaveAlignment = async () => {
    if (!gameId || !teamId) {
      setError("Missing required parameters");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const alignmentToSave = alignment.map((pos) => ({
        position: pos.position,
        playerId: pos.player?.id || null,
      }));

      await saveTeamAlignment(gameId, teamId, alignmentToSave);
      navigate(`/games/${gameId}/${seasonId}/${serieId}`);
    } catch (err) {
      console.error("Error saving alignment:", err);
      setError("Failed to save alignment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!alignment.length || !teamPlayers.length || !availablePositions.length) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          {error ? (
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold">Edit Team Alignment</h1>

      <div className="space-y-4">
        {alignment.map((playerInPosition, index) => (
          <div
            key={`${playerInPosition.position}-${index}`}
            className="flex items-center space-x-4"
          >
            <select
              value={playerInPosition.player?.id || ""}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              className="border rounded-lg px-4 py-2 w-64"
            >
              <option value="">Select a player</option>
              {teamPlayers
                .filter(
                  (player) =>
                    !selectedPlayers.has(player.id) ||
                    player.id === playerInPosition.player?.id
                )
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
            <span className="font-medium w-24">{playerInPosition.position}</span>
            <GiBaseballGlove className="text-2xl text-blue-600" />
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveAlignment}
        disabled={isSaving}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Alignment"}
      </button>
    </div>
  );
};

export default EditAlignment;
