import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit, FaSearch, FaGamepad } from "react-icons/fa";
import adminGameService from "../../services/users/admin/adminGameService";
import adminTeamService from "../../services/users/admin/adminTeamService";
import adminSerieService from "../../services/users/admin/adminSerieService";
import { Game } from "../../models/crud/Game";
import { Team } from "../../models/crud/Team";
import { Serie } from "../../models/crud/Series";

const ManageGames: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [series, setSeries] = useState<Serie[]>([]);
    const [newGame, setNewGame] = useState<Game>({
        id: 0,
        idTeam1: 0,
        idTeam2: 0,
        idSeason: 0,
        idSerie: 0,
        date: new Date(),
        winTeam: false,
        team1Runs: 0,
        team2Runs: 0,
    });
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchGames = async () => {
        try {
            const data = await adminGameService.getGames();
            setGames(data);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await adminTeamService.getTeams();
            setTeams(data);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchSeries = async () => {
        try {
            const data = await adminSerieService.getSeries();
            setSeries(data);
        } catch (error) {
            console.error("Error fetching series:", error);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchTeams();
        fetchSeries();
    }, []);

    const filteredGames = useMemo(() => {
        return games.filter((game) =>
            searchTerm
                ? teams.some(
                    (team) =>
                        (team.id === game.idTeam1 || team.id === game.idTeam2) &&
                        team.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : true
        );
    }, [games, teams, searchTerm]);

    const handleCreateGame = async () => {
        try {
            if (newGame.idTeam1 <= 0 || newGame.idTeam2 <= 0 || newGame.idSerie <= 0) {
                alert("All fields must be selected to create a game");
                return;
            }
            await adminGameService.createGame(newGame);
            fetchGames();
            setNewGame({
                id: 0,
                idTeam1: 0,
                idTeam2: 0,
                idSeason: 0,
                idSerie: 0,
                date: new Date(),
                winTeam: false,
                team1Runs: 0,
                team2Runs: 0,
            });
        } catch (error) {
            console.error("Error creating game:", error);
        }
    };

    const handleUpdateGame = async () => {
        try {
            if (!editingGame) return;
            await adminGameService.updateGame(editingGame);
            fetchGames();
            setEditingGame(null);
        } catch (error) {
            console.error("Error updating game:", error);
        }
    };

    const handleDeleteGame = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminGameService.deleteGame(deleteConfirmation);
            fetchGames();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting game:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Game Management</h1>
                        <div className="mt-2 text-lg md:text-xl opacity-90">
                            <p>Manage Games and Matchups</p>
                            <p className="mt-1">Total Games: {games.length}</p>
                        </div>
                    </div>
                    <FaGamepad className="text-6xl text-text-light opacity-80"/>
                </div>
            </div>

            {/* Game Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Create Game Form */}
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Create New Game
                    </h2>
                    <div className="space-y-4">
                        <select
                            value={newGame.idTeam1}
                            onChange={(e) => setNewGame({ ...newGame, idTeam1: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Team 1</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newGame.idTeam2}
                            onChange={(e) => setNewGame({ ...newGame, idTeam2: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Team 2</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newGame.idSerie}
                            onChange={(e) => setNewGame({ ...newGame, idSerie: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Series</option>
                            {series.map((serie) => (
                                <option key={serie.id} value={serie.id}>
                                    {serie.name} (Season {serie.idSeason})
                                </option>
                            ))}
                        </select>
                        <input
                            type="datetime-local"
                            value={newGame.date.toISOString().substring(0, 16)}
                            onChange={(e) => setNewGame({ ...newGame, date: new Date(e.target.value) })}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleCreateGame}
                            className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                        >
                            Create Game
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Search Games
                    </h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by team name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50"/>
                    </div>
                </div>
            </div>

            {/* Games List */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Games List
                </h3>
                {filteredGames.length === 0 ? (
                    <p className="text-text-dark/70 dark:text-text-light/70">No games found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGames.map((game) => (
                            <div
                                key={game.id}
                                className="group flex items-center justify-between p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:shadow-xl border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                            >
                                <div>
                                    <p className="font-semibold text-text-dark dark:text-text-light">
                                        {teams.find((t) => t.id === game.idTeam1)?.name} vs {teams.find((t) => t.id === game.idTeam2)?.name}
                                    </p>
                                    <p className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        {new Date(game.date).toLocaleString()} (Series: {series.find((s) => s.id === game.idSerie)?.name})
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingGame(game)}
                                        className="p-2 rounded-lg bg-primary/10 dark:bg-primary-lighter/10 hover:bg-primary/20 dark:hover:bg-primary-lighter/20 transition-all duration-300"
                                    >
                                        <FaEdit className="text-primary dark:text-primary-lighter"/>
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(game.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                                    >
                                        <FaTrash className="text-red-500 dark:text-red-300"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Game Modal */}
            {editingGame && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light">
                                Edit Game
                            </h2>
                            <FaTimes
                                className="text-xl text-text-dark dark:text-text-light cursor-pointer"
                                onClick={() => setEditingGame(null)}
                            />
                        </div>
                        <div className="space-y-4">
                            <select
                                value={editingGame.idTeam1}
                                onChange={(e) =>
                                setEditingGame({ ...editingGame, idTeam1: Number(e.target.value) })
                            }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={0}>Select Team 1</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={editingGame.idTeam2}
                                onChange={(e) =>
                                    setEditingGame({ ...editingGame, idTeam2: Number(e.target.value) })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={0}>Select Team 2</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={editingGame.idSerie}
                                onChange={(e) =>
                                    setEditingGame({ ...editingGame, idSerie: Number(e.target.value) })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value={0}>Select Series</option>
                                {series.map((serie) => (
                                    <option key={serie.id} value={serie.id}>
                                        {serie.name} (Season {serie.idSeason})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="datetime-local"
                                value={new Date(editingGame.date).toISOString().substring(0, 16)}
                                onChange={(e) =>
                                    setEditingGame({ ...editingGame, date: new Date(e.target.value) })
                                }
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={handleUpdateGame}
                                className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-text-dark/70 dark:text-text-light/70 mb-6">
                            Are you sure you want to delete this game? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 rounded-lg bg-secondary text-text-dark dark:text-text-light hover:bg-secondary-dark transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGame}
                                className="p-3 rounded-lg bg-red-500 text-text-light hover:bg-red-600 transition-all duration-300"
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

export default ManageGames;

