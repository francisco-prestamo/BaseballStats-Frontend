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
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [newPlayerInPosition, setNewPlayerInPosition] = useState<PlayerInPosition>({
        playerId: 0,
        position: "",
        efectividad: 0,
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);

    // Fetch player-in-position data
    const fetchPlayerInPosition = async () => {
        try {
            const response = await adminPlayerInPositionService.getPlayerInPositions();
            setPlayerInPosition(response);
        } catch (error) {
            console.error("Error fetching playerInPosition:", error);
        }
    };

    // Fetch players data
    const fetchPlayers = async () => {
        try {
            const response = await adminPlayerService.getPlayers();
            setPlayers(response);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    // Create a new player-in-position entry
    const handleCreatePlayerInPosition = async () => {
        const { playerId, position, efectividad } = newPlayerInPosition;
        if (!playerId || !position) {
            alert("Player and position fields are required.");
            return;
        }
        try {
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

    // Delete player-in-position entry
    const handleConfirmDeletePlayerInPosition = async () => {
        if (deleteConfirmation) {
            try {
                await adminPlayerInPositionService.deletePlayerInPosition(
                    deleteConfirmation.playerId,
                    deleteConfirmation.position
                );
                fetchPlayerInPosition();
                setDeleteConfirmation(null);
            } catch (error) {
                console.error("Error deleting playerInPosition:", error);
            }
        }
    };

    useEffect(() => {
        fetchPlayerInPosition();
        fetchPlayers();
    }, []);

    const filteredPlayerInPosition = playerInPosition.filter((item) =>
        players.find((player) => player.id === item.playerId)?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

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

            {/* Create PlayerInPosition & Search */}
            <div className="flex space-x-6">
                {/* Create Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Player in Position</h2>
                    <select
                        value={newPlayerInPosition.playerId || ""}
                        onChange={(e) =>
                            setNewPlayerInPosition({
                                ...newPlayerInPosition,
                                playerId: Number(e.target.value),
                            })
                        }
                        className="w-full mb-3 p-3"
                        aria-label="Select Player"
                    >
                        <option value="">Select Player</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name} (CI: {player.id})
                            </option>
                        ))}
                    </select>
                    <select
                        value={newPlayerInPosition.position || ""}
                        onChange={(e) =>
                            setNewPlayerInPosition({ ...newPlayerInPosition, position: e.target.value })
                        }
                        className="w-full mb-3 p-3"
                        aria-label="Select Position"
                    >
                        <option value="">Select Position</option>
                        {positions.map((position, index) => (
                            <option key={index} value={position}>
                                {position}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={newPlayerInPosition.efectividad || ""}
                        onChange={(e) =>
                            setNewPlayerInPosition({ ...newPlayerInPosition, efectividad: Number(e.target.value) })
                        }
                        placeholder="Efectividad (Optional)"
                        className="w-full mb-3 p-3"
                        aria-label="Set Efectividad"
                    />
                    <button
                        onClick={handleCreatePlayerInPosition}
                        className="w-full p-3 bg-primary text-white rounded-lg"
                    >
                        Create Player in Position
                    </button>
                </div>

                {/* Search Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Search Player in Position</h2>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Player Name"
                        className="p-3 w-full"
                        aria-label="Search Player Name"
                    />
                </div>
            </div>

            {/* List Section */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-semibold mb-4">Player in Position List</h2>
                {filteredPlayerInPosition.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredPlayerInPosition.map((item, index) => (
                            <li key={index} className="border rounded-lg p-3 flex justify-between items-center">
                                <span>
                                    Player: {players.find((p) => p.id === item.playerId)?.name} (CI: {item.playerId}),
                                    Position: {item.position}
                                    {item.efectividad ? `, Efectividad: ${item.efectividad}` : ""}
                                </span>
                                <button
                                    onClick={() => setDeleteConfirmation({ playerId: item.playerId, position: item.position })}
                                    className="bg-red-500 text-white p-2 rounded-lg"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text">No player in position found.</p>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this player in position?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
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
        </div>
    );
};

export default ManagePlayerInPosition;
