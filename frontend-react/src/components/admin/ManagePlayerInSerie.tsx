import React, { useState, useEffect } from "react";
import adminPlayerInSeriesService from "../../services/users/admin/adminPlayerInSeriesService";
import adminSerieService from "../../services/users/admin/adminSerieService";
import adminTeamService from "../../services/users/admin/adminTeamService";
import adminPlayerService from "../../services/users/admin/adminPlayerService";
import { PlayerInSeries } from "../../models/crud/PlayerInSeries";
import { Serie } from "../../models/crud/Series";
import { Team } from "../../models/crud/Team";
import { Player } from "../../models/crud/Player";
import { FaHandshake } from "react-icons/fa";

const ManagePlayerInSeries: React.FC = () => {
    const [PlayerInSeries, setPlayerInSeries] = useState<PlayerInSeries[]>([]);
    const [series, setSeries] = useState<Serie[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerInSeries, setNewPlayerInSeries] = useState<PlayerInSeries>({
        teamId: 0,
        playerId: 0,
        serieId: 0,
        seasonId: 0,
    });
    const [editPlayerInSeries, setEditPlayerInSeries] = useState<PlayerInSeries | null>(null);
    const [searchPlayerName, setSearchPlayerName] = useState("");
    const [deletePlayerInSeries, setDeletePlayerInSeries] = useState<PlayerInSeries | null>(null);

    const fetchPlayerInSeries = async () => {
        try {
            const response = await adminPlayerInSeriesService.getPlayerInSeries();
            setPlayerInSeries(response);
        } catch (error) {
            console.error("Error fetching PlayerInSeries:", error);
        }
    };

    const fetchSeries = async () => {
        try {
            const response = await adminSerieService.getSeries();
            setSeries(response);
        } catch (error) {
            console.error("Error fetching series:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await adminTeamService.getTeams();
            setTeams(response);
        } catch (error) {
            console.error("Error fetching teams:", error);
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

    const handleCreatePlayerInSeries = async () => {
        try {
            const { teamId, playerId, serieId } = newPlayerInSeries;
            if (!teamId || !playerId || !serieId) {
                alert("All fields are required.");
                return;
            }
            newPlayerInSeries.seasonId = series.find(s => s.id === serieId)!.idSeason;
            await adminPlayerInSeriesService.createPlayerInSeries(newPlayerInSeries);
            fetchPlayerInSeries();
            setNewPlayerInSeries({ teamId: 0, playerId: 0, serieId: 0, seasonId: 0 });
        } catch (error) {
            console.error("Error creating PlayerInSeries:", error);
        }
    };

    const handleDeletePlayerInSeries = async () => {
        if (deletePlayerInSeries) {
            try {
                await adminPlayerInSeriesService.deletePlayerInSeries(
                    deletePlayerInSeries.playerId, 
                    deletePlayerInSeries.seasonId, 
                    deletePlayerInSeries.serieId
                );
                fetchPlayerInSeries();
                setDeletePlayerInSeries(null); // Close modal after deletion
            } catch (error) {
                console.error("Error deleting PlayerInSeries:", error);
            }
        }
    };

    const handleEditPlayerInSeries = (playerInSeries: PlayerInSeries) => {
        setEditPlayerInSeries(playerInSeries);
    };

    const handleUpdatePlayerInSeries = async () => {
        try {
            if (editPlayerInSeries) {
                await adminPlayerInSeriesService.updatePlayerInSeries(editPlayerInSeries);
                fetchPlayerInSeries();
                setEditPlayerInSeries(null);
            }
        } catch (error) {
            console.error("Error updating PlayerInSeries:", error);
        }
    };

    useEffect(() => {
        fetchPlayerInSeries();
        fetchSeries();
        fetchTeams();
        fetchPlayers();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">PlayerInSeries Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage PlayerInSeries</p>
                        <p className="mt-1">Total PlayerInSeries: {PlayerInSeries.length}</p>
                    </div>
                    <FaHandshake className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Create New PlayerInSeries and Search by Player Name */}
            <div className="flex space-x-6">
                {/* Create New PlayerInSeries */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Player In Series</h2>
                    <select
                        value={newPlayerInSeries.teamId || ""}
                        onChange={(e) =>
                            setNewPlayerInSeries({ ...newPlayerInSeries, teamId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={newPlayerInSeries.playerId || ""}
                        onChange={(e) =>
                            setNewPlayerInSeries({ ...newPlayerInSeries, playerId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value="">Select Player</option>
                        {players.sort((x1, x2) => x1.name < x2.name ? -1 : 1).map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={newPlayerInSeries.serieId || ""}
                        onChange={(e) =>
                            setNewPlayerInSeries({ ...newPlayerInSeries, serieId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value="">Select Serie</option>
                        {series.map((serie) => (
                            <option key={serie.id} value={serie.id}>
                                {serie.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCreatePlayerInSeries}
                        className="w-full p-3 bg-primary text-white rounded-lg"
                    >
                        Create PlayerInSeries
                    </button>
                </div>

                {/* Search by Player Name */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Search by Player Name</h2>
                    <input
                        type="text"
                        value={searchPlayerName}
                        onChange={(e) => setSearchPlayerName(e.target.value)}
                        placeholder="Search by player name"
                        className="w-full mb-4 p-3 border rounded-lg"
                    />
                    <ul className="space-y-3">
                        {PlayerInSeries.filter((playerInSeries) =>
                            players.find((player) =>
                                player.id === playerInSeries.playerId &&
                                player.name.toLowerCase().includes(searchPlayerName.toLowerCase())
                            )
                        ).map((playerInSeries, index) => (
                            <li key={index} className="border rounded-lg p-3 flex justify-between items-center">
                                <span>
                                    Team: {teams.find(team => team.id === playerInSeries.teamId)?.name}, 
                                    Player: {players.find(player => player.id === playerInSeries.playerId)?.name}, 
                                    Serie: {series.find(serie => serie.id === playerInSeries.serieId)?.name}
                                </span>
                                <button
                                    onClick={() => handleEditPlayerInSeries(playerInSeries)}
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeletePlayerInSeries(playerInSeries)}
                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal for Editing */}
            {editPlayerInSeries && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-semibold mb-4">Edit PlayerInSeries</h2>
                        {/* Only Edit Team */}
                        <select
                            value={editPlayerInSeries.teamId}
                            onChange={(e) =>
                                setEditPlayerInSeries({ ...editPlayerInSeries, teamId: Number(e.target.value) })
                            }
                            className="w-full mb-3 p-3"
                        >
                            <option value="">Select Team</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleUpdatePlayerInSeries}
                            className="w-full p-3 bg-primary text-white rounded-lg"
                        >
                            Update PlayerInSeries
                        </button>
                        <button
                            onClick={() => setEditPlayerInSeries(null)}
                            className="w-full mt-3 p-3 bg-gray-500 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Deleting */}
            {deletePlayerInSeries && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this PlayerInSeries?</p>
                        <p>Player: {players.find(p => p.id === deletePlayerInSeries.playerId)?.name}</p>
                        <p>Team: {teams.find(t => t.id === deletePlayerInSeries.teamId)?.name}</p>
                        <p>Serie: {series.find(s => s.id === deletePlayerInSeries.serieId)?.name}</p>

                        <button
                            onClick={handleDeletePlayerInSeries}
                            className="w-full p-3 bg-red-500 text-white rounded-lg mt-3"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setDeletePlayerInSeries(null)}
                            className="w-full mt-3 p-3 bg-gray-500 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlayerInSeries;