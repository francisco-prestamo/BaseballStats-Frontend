import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchTeamAlignment,
    saveTeamAlignment,
} from '../../../services/users/dt/alignmentService';
import { PlayerInPosition } from '../../../models/PlayerInPosition';
import { Player } from '../../../models/Player';
import { GiBaseballGlove } from 'react-icons/gi';
import {fetchPlayerTeamForSeasonAndSeries} from "../../../services/users/all/playerService.ts";

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
            try {
                const [alignmentData, players] = await Promise.all([
                    fetchTeamAlignment(gameId, teamId, seasonId, serieId),
                    fetchPlayerTeamForSeasonAndSeries(teamId, seasonId, serieId),
                ]);

                if (alignmentData) {
                    setAlignment(alignmentData);
                } else {
                    console.warn("Alignment data is empty or undefined.");
                }

                if (players) {
                    setTeamPlayers(players);
                } else {
                    console.warn("Players data is empty or undefined.");
                }
            } catch (error) {
                console.error("Error fetching alignment or players data:", error);
            }
        };
        loadAlignmentAndPlayers();
    }, [gameId, teamId, seasonId, serieId]);

    const handlePlayerChange = (index: number, newPlayerId: number) => {
        const updatedAlignment = [...alignment];
        const selectedPlayer = teamPlayers.find((player) => player.id === newPlayerId);
        if (selectedPlayer) {
            updatedAlignment[index].player = selectedPlayer;
        }
        setAlignment(updatedAlignment);
    };

    const saveAlignment = async () => {
        try {
            setIsSaving(true);
            if (gameId && teamId) {
                await saveTeamAlignment(gameId, teamId, seasonId, serieId, alignment);
                navigate(`/games/${gameId}/${seasonId}/${serieId}`);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save alignment. Please try again.');
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
                {alignment.map((playerInPosition, index) => (
                    <div key={playerInPosition.player.id} className="flex items-center space-x-4">
                        <select
                            value={playerInPosition.player.id}
                            onChange={(e) => handlePlayerChange(index, parseInt(e.target.value))}
                            className="border rounded-lg px-4 py-2"
                        >
                            {teamPlayers.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>
                        <span className="font-medium">{playerInPosition.position}</span>
                        <GiBaseballGlove className="text-2xl" />
                    </div>
                ))}
            </div>

            <button
                onClick={saveAlignment}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                {isSaving ? 'Saving...' : 'Save Alignment'}
            </button>
        </div>
    );
};

export default EditAlignment;