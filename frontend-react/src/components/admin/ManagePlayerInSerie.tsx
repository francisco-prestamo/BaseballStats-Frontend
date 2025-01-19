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
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Create New PlayerInSeries</h2>

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

            {/* PlayerInSeries List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">PlayerInSeries List</h2>
                <ul className="space-y-3">
                    {PlayerInSeries.map((PlayerInSeries, index) => (
                        <li
                            key={index}
                            className="border rounded-lg p-3 flex justify-between items-center"
                        >
                            <span>
                                Team: {PlayerInSeries.teamId}, Player: {PlayerInSeries.playerId}, Serie: {PlayerInSeries.serieId}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManagePlayerInSeries;
