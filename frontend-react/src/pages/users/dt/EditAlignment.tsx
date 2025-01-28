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
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAlignmentAndPlayers = async () => {
      if (!gameId || !teamId || !seasonId || !serieId) {
        setError("Missing required parameters.");
        return;
      }

      try {
        const [existingAlignment, crudPositions, players] = await Promise.all([
          fetchTeamAlignment(gameId, teamId),
          fetchAllTeamPlayerInPositions(seasonId, serieId, teamId),
          fetchTeamPlayersInASerie(seasonId, serieId, teamId),
        ]);

        if (crudPositions && players) {
          let initialAlignment: PlayerInPosition[];

          if (existingAlignment && existingAlignment.length > 0) {
            // Use existing alignment if available
            initialAlignment = existingAlignment.map(pos => {
              const player = players.find(p => p.id === pos.player.id);
              if (!player) {
                // If somehow the player is not found, use the first available player
                console.warn(`Player ${pos.player.id} not found, using default player`);
                return {
                  position: pos.position,
                  efectividad: pos.efectividad || 0,
                  player: players[0], // Use first player as default
                };
              }
              return {
                position: pos.position,
                efectividad: pos.efectividad || 0,
                player: player,
              };
            });
          } else {
            // Create default alignment from crudPositions with first player as default
            initialAlignment = crudPositions.map(pos => ({
              position: pos.position,
              efectividad: pos.efectividad || 0,
              player: players[0], // Use first player as default
            }));
          }

          setAlignment(initialAlignment);
          setTeamPlayers(players);

          // Update selected players set
          const selectedPlayerIds = initialAlignment.map(pos => pos.player.id);
          setSelectedPlayers(new Set(selectedPlayerIds));
        } else {
          setError("Failed to load player or position data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    loadAlignmentAndPlayers();
  }, [gameId, teamId, seasonId, serieId]);

  const handlePlayerChange = (index: number, newPlayerId: number) => {
    setAlignment((prevAlignment) => {
      const updatedAlignment = [...prevAlignment];
      const oldPlayerId = updatedAlignment[index].player.id;
      const newPlayer = teamPlayers.find((player) => player.id === newPlayerId);

      if (!newPlayer) {
        console.error("New player not found");
        return prevAlignment;
      }

      setSelectedPlayers((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(oldPlayerId);
        updatedSet.add(newPlayerId);
        return updatedSet;
      });

      updatedAlignment[index] = {
        ...updatedAlignment[index],
        player: newPlayer,
      };

      return updatedAlignment;
    });
  };

  const handleSaveAlignment = async () => {
    if (!gameId || !teamId) {
      setError("Missing required parameters.");
      return;
    }

    try {
      setIsSaving(true);
      const alignmentToSave = alignment.map((pos) => ({
        position: pos.position,
        player: pos.player,
        efectividad: pos.efectividad,
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

  if (!alignment.length || !teamPlayers.length) {
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
            <div className="bg-red-500 text-white p-4 rounded-lg">
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
                    value={playerInPosition.player.id}
                    onChange={(e) => handlePlayerChange(index, parseInt(e.target.value))}
                    className="border rounded-lg px-4 py-2 w-64"
                >
                  {teamPlayers
                      .filter(
                          (player) =>
                              !selectedPlayers.has(player.id) || player.id === playerInPosition.player.id
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