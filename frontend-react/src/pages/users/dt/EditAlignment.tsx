import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchTeamAlignment,
    saveTeamAlignment,
} from '../../../services/users/dt/alignmentService';
import { PlayerInPosition } from '../../../models/PlayerInPosition';
import { Player } from '../../../models/Player';
import { GiBaseballGlove } from 'react-icons/gi';
import { fetchTeamPlayersInASeason } from "../../../services/users/all/TeamService";

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
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadAlignmentAndPlayers = async () => {
            if (!gameId || !teamId || !seasonId || !serieId) {
                setError('Missing required parameters');
                return;
            }

            try {
                const [alignmentData, players] = await Promise.all([
                    fetchTeamAlignment(gameId, teamId, seasonId, serieId),
                    fetchTeamPlayersInASeason(seasonId, serieId, teamId),
                ]);

                if (alignmentData) {
                    setAlignment(alignmentData);
                } else {
                    setError("No alignment data available.");
                }

                if (players) {
                    setTeamPlayers(players);
                } else {
                    setError("No players data available.");
                }
            } catch (error) {
                console.error("Error fetching alignment or players data:", error);
                setError('Failed to load data. Please try again.');
            }
        };
        loadAlignmentAndPlayers();
    }, [gameId, teamId, seasonId, serieId]);

    const handlePlayerChange = (index: number, newPlayerId: number) => {
        setAlignment(prevAlignment => {
            const updatedAlignment = [...prevAlignment];
            const selectedPlayer = teamPlayers.find((player) => player.id === newPlayerId);
            if (selectedPlayer) {
                updatedAlignment[index] = {
                    ...updatedAlignment[index],
                    player: selectedPlayer
                };
            }
            return updatedAlignment;
        });
    };

    const handleSaveAlignment = async () => {
        if (!gameId || !teamId || !seasonId || !serieId) {
            setError('Missing required parameters');
            return;
        }

        try {
            setIsSaving(true);
            await saveTeamAlignment(gameId, teamId, seasonId, serieId, alignment);
            navigate(`/games/${gameId}/${seasonId}/${serieId}`);
        } catch (err) {
            console.error(err);
            setError('Failed to save alignment. Please try again.');
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
                            {teamPlayers.map((player) => (
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
                {isSaving ? 'Saving...' : 'Save Alignment'}
            </button>
        </div>
    );
};

export default EditAlignment;