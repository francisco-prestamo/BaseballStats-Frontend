import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaStar } from "react-icons/fa";
import starPlayerService from "../../services/users/admin/adminStarPlayerInPosition";
import { StarPlayerInPosition } from "../../models/crud/StarPlayerInPosition";

const ManageStarPlayers: React.FC = () => {
    const [starPlayers, setStarPlayers] = useState<StarPlayerInPosition[]>([]);
    const [newStarPlayer, setNewStarPlayer] = useState<StarPlayerInPosition>({
        idSerie: 0,
        idSeason: 0,
        idPlayer: 0,
        position: "",
    });

    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStarPlayers = async () => {
        try {
            const response = await starPlayerService.getStarPlayers();
            setStarPlayers(response);
        } catch (error) {
            console.error("Error fetching star players:", error);
        }
    };

    const filteredStarPlayers = useMemo(() => {
        return starPlayers.filter((starPlayer) =>
            starPlayer.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [starPlayers, searchTerm]);

    const handleCreateStarPlayer = async () => {
        try {
            if (!newStarPlayer.idSerie || !newStarPlayer.idSeason || !newStarPlayer.idPlayer || !newStarPlayer.position) {
                alert("All fields are required to create a star player.");
                return;
            }

            await starPlayerService.createStarPlayer(newStarPlayer as StarPlayerInPosition);
            fetchStarPlayers();
            setNewStarPlayer({ idSerie: 0, idSeason: 0, idPlayer: 0, position: "" });
        } catch (error) {
            console.error("Error creating star player:", error);
        }
    };

    const handleDeleteStarPlayer = async () => {
        try {
            if (!deleteConfirmation) return;
            await starPlayerService.deleteStarPlayer(deleteConfirmation);
            fetchStarPlayers();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting star player:", error);
        }
    };

    useEffect(() => {
        fetchStarPlayers();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Star Player Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage Star Players in Positions</p>
                        <p className="mt-1">Total Star Players: {starPlayers.length}</p>
                    </div>
                    <FaStar className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Star Player Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Star Player</h2>

                    <input
                        type="number"
                        placeholder="Serie ID"
                        value={newStarPlayer.idSerie === 0 ? "" : newStarPlayer.idSerie}
                        onChange={(e) =>
                            setNewStarPlayer({ ...newStarPlayer, idSerie: Number(e.target.value) || 0 })
                        }
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="number"
                        placeholder="Season ID"
                        value={newStarPlayer.idSeason === 0 ? "" : newStarPlayer.idSeason}
                        onChange={(e) =>
                            setNewStarPlayer({ ...newStarPlayer, idSeason: Number(e.target.value) || 0 })
                        }
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="number"
                        placeholder="Player ID"
                        value={newStarPlayer.idPlayer === 0 ? "" : newStarPlayer.idPlayer}
                        onChange={(e) =>
                            setNewStarPlayer({ ...newStarPlayer, idPlayer: Number(e.target.value) || 0 })
                        }
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="text"
                        placeholder="Position"
                        value={newStarPlayer.position}
                        onChange={(e) => setNewStarPlayer({ ...newStarPlayer, position: e.target.value })}
                        className="w-full mb-3 p-3"
                    />

                    <button onClick={handleCreateStarPlayer} className="w-full p-3 bg-primary text-white">
                        Create Star Player
                    </button>
                </div>

                {/* Search Star Players Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Star Players</h3>
                    <input
                        type="text"
                        placeholder="Search by position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Star Players List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Star Players List</h3>
                {filteredStarPlayers.length === 0 ? (
                    <p>No star players found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStarPlayers.map((starPlayer) => (
                            <div key={starPlayer.idPlayer} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>{starPlayer.position}</p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setDeleteConfirmation(starPlayer.idPlayer)}
                                        className="p-2 bg-red-500 text-white rounded-lg"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Star Player Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this star player?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteStarPlayer}
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

export default ManageStarPlayers;