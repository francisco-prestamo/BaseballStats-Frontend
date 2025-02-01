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

const positions = [
  "Pitcher",
  "Catcher",
  "First-Base",
  "Second-Base",
  "Third-Base",
  "Shortstop",
  "Left-Field",
  "Center-Field",
  "Right-Field",
]

const EditAlignment: React.FC = () => {
  const { gameId, teamId, seasonId, serieId } = useParams();
  const navigate = useNavigate();
  const [alignment, setAlignment] = useState<(PlayerInPosition | null)[]>([]);
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
          let initialAlignment = positions.map((pos) => {
            const existing = existingAlignment.find((p) => p.position === pos);
            if (existing) {
              return existing;
            }
            return crudPositions.find((p) => p.position === pos)
              ? null
              : null;
          });

          setAlignment(initialAlignment);
          setTeamPlayers(players);
          const selectedPlayerIds = initialAlignment
            .filter((pos) => pos !== null)
            .map((pos) => pos!.player.id);
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
      const newPlayer = teamPlayers.find((player) => player.id === newPlayerId);

      if (!newPlayer) {
        console.error("New player not found");
        return prevAlignment;
      }

      if (updatedAlignment[index]) {
        const oldPlayerId = updatedAlignment[index]!.player.id;
        setSelectedPlayers((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(oldPlayerId);
          updatedSet.add(newPlayerId);
          return updatedSet;
        });
      }

      updatedAlignment[index] = {
        position: positions[index],
        player: newPlayer,
        effectiveness: updatedAlignment[index]?.effectiveness || 0,
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
      const alignmentToSave = alignment.filter((pos) => pos !== null);
      await saveTeamAlignment(gameId, teamId, alignmentToSave);
      navigate(`/games/${gameId}/${seasonId}/${serieId}`);
    } catch (err) {
      console.error("Error saving alignment:", err);
      setError("Failed to save alignment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold">Edit Team Alignment</h1>

      <div className="space-y-4">
        {positions.map((pos, index) => (
          <div key={pos} className="flex items-center space-x-4">
            <select
              value={alignment[index]?.player.id || ""}
              onChange={(e) =>
                handlePlayerChange(index, parseInt(e.target.value))
              }
              className="border rounded-lg px-4 py-2 w-64"
            >
              <option value="">Select Player</option>
              {teamPlayers
                .filter(
                  (player) =>
                    !selectedPlayers.has(player.id) ||
                    player.id === alignment[index]?.player.id
                )
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
            <span className="font-medium w-24">{pos}</span>
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
