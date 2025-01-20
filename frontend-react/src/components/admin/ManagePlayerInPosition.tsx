import React, { useState, useEffect } from "react";
import adminPlayerService from "../../services/users/admin/adminPlayerService";
import { PlayerInPosition } from "../../models/crud/PlayerInPosition";
import { Player } from "../../models/crud/Player";
import { positions } from "../../models/crud/positions";
import adminPlayerInPositionService from "../../services/users/admin/adminPlayerInPositionService";
import { FaHandshake } from "react-icons/fa";

const ManagePlayerInPosition: React.FC = () => {
    interface DeleteConfirmation {
        playerId: number;
        position: string;
    }

    const [playerInPosition, setPlayerInPosition] = useState<PlayerInPosition[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    const [newPlayerInPosition, setNewPlayerInPosition] = useState<PlayerInPosition>({
        playerId: 0,
        position: "",
        efectividad: 0,
    });

    const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
    const handleDeletePlayerInPosition = (playerId: number, position: string) => {
        // Set the player and position to be deleted
        setDeleteConfirmation({ playerId, position });
    };


    const fetchPlayerInPosition = async () => {
        try {
            const response = await adminPlayerInPositionService.getPlayerInPositions();
            setPlayerInPosition(response);
        } catch (error) {
            console.error("Error fetching playerInPosition:", error);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await adminPlayerService.getPlayers();
            setPlayers(response);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    const handleCreatePlayerInPosition = async () => {
        try {
            const { playerId, position, efectividad } = newPlayerInPosition;
            if (!playerId || !position) {
                alert("Player and position fields are required.");
                return;
            }
            await adminPlayerInPositionService.createPlayerInPosition({
                playerId,
                position,
                efectividad,
            });
            fetchPlayerInPosition();
            setNewPlayerInPosition({
                playerId: 0,
                position: "",
                efectividad: 0,
            });
        } catch (error) {
            console.error("Error creating playerInPosition:", error);
        }
    };

    // Handle confirming the delete action for a specific position
    const handleConfirmDeletePlayerInPosition = () => {
        if (deleteConfirmation) {
            // Reset the delete confirmation state
            setDeleteConfirmation(null);
        }
    };

    useEffect(() => {
        fetchPlayerInPosition();
        fetchPlayers();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Player in Position Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage Player Assignments</p>
                        <p className="mt-1">Total Player Assignments: {playerInPosition.length}</p>
                    </div>
                    <FaHandshake className="text-6xl text-text-light opacity-80" />
                </div>
            </div>
            {/* Create PlayerInPosition */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Create New Player in Position</h2>

                {/* Select PlayerId */}
                <select
                    value={newPlayerInPosition.playerId || ""}
                    onChange={(e) => {
                        const selectedPlayerId = players.find((p) => p.id === Number(e.target.value))?.id;
                        setNewPlayerInPosition({
                            ...newPlayerInPosition,
                            playerId: selectedPlayerId || newPlayerInPosition.playerId,
                        });
                    }}
                    className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select Player
                    </option>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name} (CI: {player.id})
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            No players available
                        </option>
                    )}
                </select>


                {/* Select Position */}
                <select
                    value={newPlayerInPosition.position || ""}
                    onChange={(e) =>
                        setNewPlayerInPosition({ ...newPlayerInPosition, position: e.target.value })
                    }
                    className="w-full mb-3 p-3"
                >
                    <option value="">Select Position</option>
                    {positions.map((position, index) => (
                        <option key={index} value={position}>
                            {position}
                        </option>
                    ))}
                </select>

                {/* Set Efectividad */}
                <input
                    type="number"
                    value={newPlayerInPosition.efectividad || ""}
                    onChange={(e) =>
                        setNewPlayerInPosition({ ...newPlayerInPosition, efectividad: Number(e.target.value) })
                    }
                    placeholder="Efectividad (Optional)"
                    className="w-full mb-3 p-3"
                />

                <button
                    onClick={handleCreatePlayerInPosition}
                    className="w-full p-3 bg-primary text-white rounded-lg"
                >
                    Create Player in Position
                </button>
            </div>

            {/* PlayerInPosition List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Player in Position List</h2>
                <ul className="space-y-3">
                    {playerInPosition.map((item, index) => {
                        const player = players.find((p) => p.id === item.playerId);
                        return (
                            <li key={index} className="border rounded-lg p-3 flex justify-between items-center">
                                <span>
                                    Player: {player ? `${player.name} (CI: ${player.id})` : "Unknown Player"}, Position: {item.position}
                                    {item.efectividad ? `, Efectividad: ${item.efectividad}` : ""}
                                </span>
                            </li>
                        )
                    }
                    )
                    }
                </ul>
            </div>

            {/* Delete PlayerInPosition Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this player in position?</h2>
                        <div className="flex justify-between">
                            {/* Cancel Delete */}
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            {/* Confirm Delete */}
                            <button
                                onClick={handleConfirmDeletePlayerInPosition}
                                className="p-3 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Button */}
            {playerInPosition.map((player) => {
                const matchedPlayer = players.find((p) => p.id === player.playerId);

                return (
                    <div key={player.playerId} className="flex items-center justify-between p-4 border-b">
                        <span>
                            {matchedPlayer ? `${matchedPlayer.name} (CI: ${matchedPlayer.id})` : "Unknown Player"} - {player.position}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleDeletePlayerInPosition(player.playerId, player.position)}
                                className="p-2 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ManagePlayerInPosition;
