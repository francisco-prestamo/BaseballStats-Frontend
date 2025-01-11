import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit, FaUsers } from "react-icons/fa";
import adminPlayerService from "../../services/users/admin/adminPlayerService";
import { Player } from "../../models/crud/Player.ts";
import { Team } from "../../models/crud/Team.ts";

const ManagePlayers: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayer, setNewPlayer] = useState<Player>({
        id: 0,
        name: "",
        age: 0,
        experience: 0,
        battingAverage: 0,
        positions: [],
        teamId: 0,
    });

    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

    const [teamList, setTeamList] = useState<Team[]>([]);
    const [positionList] = useState<string[]>(["Pitcher", "Catcher", "First Baseman",
        "Second Baseman", "Shortstop", "Third Baseman", "Left Outfielder",
        "Center Outfielder", "Right Outfielder"]); // Lista de posiciones
    const [searchTerm, setSearchTerm] = useState("");
    // const [searchTeam, setSearchTeam] = useState("");

    const fetchPlayers = async () => {
        try {
            const response = await adminPlayerService.getPlayers();
            setPlayers(response);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    const fetchTeamList = async () => {
        try {
            const response = await adminPlayerService.getTeams();
            setTeamList(response);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const filteredPlayers = useMemo(() => {
        return players.filter((player) =>
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [players, searchTerm]);

    // const filteredTeams = useMemo(() => {
    //     return teamList.filter((team) =>
    //         team.name.toLowerCase().includes(searchTeam.toLowerCase())
    //     );
    // }, [teamList, searchTeam]);

    const handleCreatePlayer = async () => {
        try {
            if (
                !newPlayer.id ||
                !newPlayer.name ||
                newPlayer.age <= 0 ||
                newPlayer.experience <= 0 ||
                newPlayer.battingAverage <= 0 ||
                newPlayer.teamId <= 0 ||
                newPlayer.positions.length === 0
            ) {
                alert("All fields, including ID, are required to create a player.");
                return;
            }

            await adminPlayerService.createPlayer(newPlayer as Player);
            fetchPlayers();
            setNewPlayer({ name: "", age: 0, experience: 0, battingAverage: -1, positions: [], teamId: 0, id: 0 });
        } catch (error) {
            console.error("Error creating player:", error);
        }
    };


    const handleUpdatePlayer = async () => {
        try {
            if (!editingPlayer) return;
            await adminPlayerService.updatePlayer(editingPlayer);
            fetchPlayers();
            setEditingPlayer(null);
        } catch (error) {
            console.error("Error updating player:", error);
        }
    };

    const handleDeletePlayer = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminPlayerService.deletePlayer(deleteConfirmation);
            fetchPlayers();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting player:", error);
        }
    };

    useEffect(() => {
        fetchPlayers();
        fetchTeamList();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Player Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage Players</p>
                        <p className="mt-1">Total Players: {players.length}</p>
                    </div>
                    <FaUsers className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Player Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Player</h2>

                    <input
                        type="number"
                        placeholder="ID (Carné de Identidad)"
                        value={newPlayer.id === 0 ? "" : newPlayer.id}
                        onChange={(e) =>
                            setNewPlayer({ ...newPlayer, id: Number(e.target.value) || 0 })
                        }
                        className="w-full mb-3 p-3"
                    />


                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="Name"
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        className="w-full mb-3 p-3"
                    />

                    {/* Age Input */}
                    <input
                        type="number"
                        placeholder={newPlayer.age === 0 ? "Age" : ""}
                        value={newPlayer.age === 0 ? "" : newPlayer.age}
                        onChange={(e) => setNewPlayer({ ...newPlayer, age: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    {/* Experience Input */}
                    <input
                        type="number"
                        placeholder={newPlayer.experience === 0 ? "Experience (Years)" : ""}
                        value={newPlayer.experience === 0 ? "" : newPlayer.experience}
                        onChange={(e) => setNewPlayer({ ...newPlayer, experience: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    {/* Batting Average Input */}
                    <input
                        type="number"
                        step="0.01"
                        placeholder={newPlayer.battingAverage === -1 ? "Batting Average" : ""}
                        value={newPlayer.battingAverage === -1 ? "" : newPlayer.battingAverage}
                        onChange={(e) => setNewPlayer({ ...newPlayer, battingAverage: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    {/* // Positions Section - Multiple Selection using checkboxes */}
                    <div>
                        <label htmlFor="positions" className="block text-sm font-medium">Select Positions:</label>
                        <div className="space-y-2">
                            {positionList.map((position) => (
                                <div key={position} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={position}
                                        value={position}
                                        checked={newPlayer.positions.includes(position)}
                                        onChange={(e) => {
                                            const updatedPositions = e.target.checked
                                                ? [...newPlayer.positions, position]  // Add the position if checked
                                                : newPlayer.positions.filter(p => p !== position); // Remove if unchecked
                                            setNewPlayer({
                                                ...newPlayer,
                                                positions: updatedPositions
                                            });
                                        }}
                                        className="mr-2"
                                    />
                                    <label htmlFor={position} className="text-sm">{position}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Selection */}
                    <div>
                        <label htmlFor="team" className="block text-sm font-medium">Select Team:</label>
                        <select
                            id="team"
                            value={newPlayer.teamId}
                            onChange={(e) => setNewPlayer({ ...newPlayer, teamId: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        >
                            <option value={0}>Select Team</option>
                            {teamList.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleCreatePlayer} className="w-full p-3 bg-primary text-white">
                        Create Player
                    </button>
                </div>

                {/* Search Players Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Players</h3>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Players List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Players List</h3>
                {filteredPlayers.length === 0 ? (
                    <p>No players found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlayers.map((player) => (
                            <div key={player.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>{player.name}</p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingPlayer(player)}
                                        className="p-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(player.id)}
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

            {/* Edit Player Modal */}
            {editingPlayer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-text-dark">Edit Player</h2>
                            <button
                                onClick={() => setEditingPlayer(null)}
                                className="p-2 rounded-lg hover:bg-secondary/30"
                            >
                                <FaTimes className="text-text-dark/70" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* CI Input in Edit Modal */}
                            <input
                                type="number"
                                placeholder="Carné de Identidad (CI)"
                                value={editingPlayer?.id || 0}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, id: Number(e.target.value) })
                                }
                                className="w-full mb-3 p-3"
                            />

                            <input
                                type="text"
                                placeholder="Name"
                                value={editingPlayer.name}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, name: e.target.value })
                                }
                                className="w-full p-3"
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={editingPlayer.age}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, age: Number(e.target.value) })
                                }
                                className="w-full p-3"
                            />
                            <input
                                type="number"
                                placeholder="Experience"
                                value={editingPlayer.experience}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, experience: Number(e.target.value) })
                                }
                                className="w-full p-3"
                            />
                            <input
                                type="number"
                                placeholder="Batting Average"
                                value={editingPlayer.battingAverage}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, battingAverage: Number(e.target.value) })
                                }
                                className="w-full p-3"
                            />
                            {/* <select
                                value={editingPlayer.teamId}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, teamId: Number(e.target.value) })
                                }
                                className="w-full p-3"
                            >
                                <option value={0}>Select Team</option>
                                {filteredTeams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select> */}
                            <select
                                multiple
                                value={editingPlayer.positions}
                                onChange={(e) =>
                                    setEditingPlayer({ ...editingPlayer, positions: Array.from(e.target.selectedOptions, option => option.value) })
                                }
                                className="w-full p-3"
                            >
                                {positionList.map((position) => (
                                    <option key={position} value={position}>
                                        {position}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleUpdatePlayer} className="mt-6 p-3 w-full bg-primary text-white">
                            Update Player
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Player Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this player?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePlayer}
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

export default ManagePlayers;
