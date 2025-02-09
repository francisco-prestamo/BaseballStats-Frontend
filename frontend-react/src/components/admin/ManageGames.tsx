import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaEdit, FaSearch, FaGamepad } from "react-icons/fa";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [newGame, setNewGame] = useState<Game>({
        id: 0,
        team1Id: 0,
        team2Id: 0,
        seasonId: 0,
        seriesId: 0,
        date: "",
        winTeam: false,
        team1Runs: 0,
        team2Runs: 0,
    });
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

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

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const team1Name = teams.find(t => t.id === game.team1Id)?.name || '';
            const team2Name = teams.find(t => t.id === game.team2Id)?.name || '';
            const searchString = `${team1Name} ${team2Name}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
    }, [games, teams, searchTerm]);

    useEffect(() => {
        fetchGames();
        fetchTeams();
        fetchSeries();
    }, []);

    const handleCreateGame = async () => {
        try {
            if (newGame.team1Id <= 0 || newGame.team2Id <= 0 || newGame.seriesId <= 0) {
                alert("All fields must be selected to create a game");
                return;
            }
            await adminGameService.createGame(newGame);
            fetchGames();
            setNewGame({
                id: 0,
                team1Id: 0,
                team2Id: 0,
                seasonId: 0,
                seriesId: 0,
                date: "",
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
            
            // Calculate winTeam based on runs
            const updatedGame = {
                ...editingGame,
                winTeam: editingGame.team1Runs > editingGame.team2Runs
            };
            
            await adminGameService.updateGame(updatedGame);
            fetchGames();
            setEditingGame(null);
        } catch (error) {
            console.error("Error updating game:", error);
        }
    };

    const handleDeleteGame = async () => {
        try {
            if (deleteConfirmation === null) return;
            await adminGameService.deleteGame(deleteConfirmation);
            fetchGames();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting game:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Game Management</h1>
                        <p className="mt-2 text-lg md:text-xl opacity-90">Total Games: {games.length}</p>
                    </div>
                    <FaGamepad className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                    <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Create New Game</h2>
                    <div className="space-y-4">
                        <select 
                            value={newGame.team1Id} 
                            onChange={(e) => setNewGame({ ...newGame, team1Id: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Team 1</option>
                            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                        </select>

                        <select 
                            value={newGame.team2Id} 
                            onChange={(e) => setNewGame({ ...newGame, team2Id: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Team 2</option>
                            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                        </select>

                        <select 
                            value={newGame.seriesId} 
                            onChange={(e) => setNewGame({ ...newGame, seriesId: Number(e.target.value) })}
                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                        >
                            <option value={0}>Select Series</option>
                            {series.map((serie) => <option key={serie.id} value={serie.id}>{serie.name}</option>)}
                        </select>

                        <input 
                            type="date" 
                            value={newGame.date} 
                            onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                        />

                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                value={newGame.team1Runs} 
                                onChange={(e) => setNewGame({ ...newGame, team1Runs: Number(e.target.value) })} 
                                placeholder="Team 1 Runs"
                                className="flex-1 p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                            />
                            <input 
                                type="number" 
                                value={newGame.team2Runs} 
                                onChange={(e) => setNewGame({ ...newGame, team2Runs: Number(e.target.value) })} 
                                placeholder="Team 2 Runs"
                                className="flex-1 p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <button 
                            onClick={handleCreateGame} 
                            className="w-full p-3 mt-4 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light"
                        >
                            Create Game
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                    <h3 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Search Games</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by team names..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50" />
                    </div>
                </div>
            </div>

            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                <h3 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Games List</h3>
                {filteredGames.length === 0 ? (
                    <p className="text-text-dark/70">No games found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGames.map((game) => (
                            <div key={game.id} className="flex justify-between items-center p-4 bg-secondary-lightest rounded-lg border border-primary/20">
                                <div>
                                    <p className="font-semibold">
                                        {teams.find(t => t.id === game.team1Id)?.name} vs {teams.find(t => t.id === game.team2Id)?.name}
                                    </p>
                                    <p className="text-sm text-text-dark/70">
                                        {new Date(game.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                        Score: {game.team1Runs} - {game.team2Runs}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        Winner: {game.winTeam ? 
                                            teams.find(t => t.id === game.team1Id)?.name : 
                                            teams.find(t => t.id === game.team2Id)?.name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setEditingGame(game)} 
                                        className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20"
                                    >
                                        <FaEdit className="text-yellow-500" />
                                    </button>
                                    <button 
                                        onClick={() => setDeleteConfirmation(game.id)} 
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                                    >
                                        <FaTrash className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editingGame && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Edit Game Score</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="mb-2 font-medium">
                                    {teams.find(t => t.id === editingGame.team1Id)?.name} vs {teams.find(t => t.id === editingGame.team2Id)?.name}
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1">Team 1 Runs</label>
                                        <input 
                                            type="number"
                                            value={editingGame.team1Runs}
                                            onChange={(e) => setEditingGame({ 
                                                ...editingGame, 
                                                team1Runs: Number(e.target.value)
                                            })}
                                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm mb-1">Team 2 Runs</label>
                                        <input 
                                            type="number"
                                            value={editingGame.team2Runs}
                                            onChange={(e) => setEditingGame({ 
                                                ...editingGame, 
                                                team2Runs: Number(e.target.value)
                                            })}
                                            className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={handleUpdateGame} 
                                    className="flex-grow p-3 rounded-lg bg-primary hover:bg-primary-light text-white"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    onClick={() => setEditingGame(null)} 
                                    className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this game?</p>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setDeleteConfirmation(null)} 
                                className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteGame} 
                                className="flex-grow p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white"
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