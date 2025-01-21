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
            await adminPlayerInSeriesService.createPlayerInSeries(newPlayerInSeries);
            fetchPlayerInSeries();
            setNewPlayerInSeries({ teamId: 0, playerId: 0, serieId: 0, seasonId: 0 });
        } catch (error) {
            console.error("Error creating PlayerInSeries:", error);
        }
    };

    const handleDeletePlayerInSeries = async (playerId: number, serieId: number, seasonId: number) => {
        try {
            await adminPlayerInSeriesService.deletePlayerInSeries(playerId, serieId, seasonId);
            fetchPlayerInSeries(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting PlayerInSeries:", error);
        }
    };

    const handleEditPlayerInSeries = (playerInSeries: PlayerInSeries) => {
        setEditPlayerInSeries(playerInSeries);
    };

    const handleUpdatePlayerInSeries = async () => {
        try {
            if (editPlayerInSeries) {
                await adminPlayerInSeriesService.updatePlayerInSeries(editPlayerInSeries);
                fetchPlayerInSeries(); // Refresh the list after update
                setEditPlayerInSeries(null); // Close the modal
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

                    {/* Select Team */}
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

                    {/* Select Player */}
                    <select
                        value={newPlayerInSeries.playerId || ""}
                        onChange={(e) =>
                            setNewPlayerInSeries({ ...newPlayerInSeries, playerId: Number(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    >
                        <option value="">Select Player</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>

                    {/* Select Serie */}
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
                                    Team: {playerInSeries.teamId}, Player: {playerInSeries.playerId}, Serie: {playerInSeries.serieId}, Season: {playerInSeries.seasonId}
                                </span>
                                <button
                                    onClick={() => handleEditPlayerInSeries(playerInSeries)}
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeletePlayerInSeries(playerInSeries.playerId, playerInSeries.serieId, playerInSeries.seasonId)}
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
                        {/* Select Team */}
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

                        {/* Select Player */}
                        <select
                            value={editPlayerInSeries.playerId}
                            onChange={(e) =>
                                setEditPlayerInSeries({ ...editPlayerInSeries, playerId: Number(e.target.value) })
                            }
                            className="w-full mb-3 p-3"
                        >
                            <option value="">Select Player</option>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>

                        {/* Select Serie */}
                        <select
                            value={editPlayerInSeries.serieId}
                            onChange={(e) =>
                                setEditPlayerInSeries({ ...editPlayerInSeries, serieId: Number(e.target.value) })
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

            {/* Flexbox de jugadores en series */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6 mt-10">
                <h2 className="text-2xl font-semibold mb-4">Player In Series List</h2>
                <div className="grid grid-cols-3 gap-6">
                    {PlayerInSeries.slice(0, 12).map((playerInSeries, index) => {
                        // Aquí se pueden agregar las tarjetas con la información del jugador
                        const player = players.find(p => p.id === playerInSeries.playerId); // Busca al jugador
                        if (!player) return null;

                        return (
                            <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
                                <img
                                    src="/path/to/player-image.jpg" // Agregar imagen del jugador si es necesario
                                    alt={player.name}
                                    className="w-20 h-20 rounded-full mb-3"
                                />
                                <h3 className="text-lg font-semibold">{player.name}</h3>
                                <p>Team: {teams.find(t => t.id === playerInSeries.teamId)?.name}</p>
                                <p>Serie: {series.find(s => s.id === playerInSeries.serieId)?.name}</p>
                                <p>Season: {playerInSeries.seasonId}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default ManagePlayerInSeries;
