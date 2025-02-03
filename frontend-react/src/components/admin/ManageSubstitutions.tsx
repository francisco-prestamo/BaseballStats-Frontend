import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaTrash } from "react-icons/fa";
import adminSubstitutionService from "../../services/users/admin/adminSubstitutionService";
import { fetchAllSeries, fetchGamesInSeries } from "../../services/users/all/serieService";
import { fetchTeamPlayersInASerie } from "../../services/users/all/TeamService";
import { Serie } from "../../models/Serie";
import { Game } from "../../models/Game";
import { Player } from "../../models/Player";
import { Substitution } from "../../models/crud/Substitution";

const ManageSubstitutions: React.FC = () => {
    const [series, setSeries] = useState<Serie[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
    const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [newSubstitution, setNewSubstitution] = useState<Substitution>({
        id: 0,
        gameId: 0,
        teamId: 0,
        playerInId: 0,
        playerOutId: 0,
        date: "", // Date as a string
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState<Substitution | null>(null);

    useEffect(() => {
        const loadSeries = async () => {
            try {
                const seriesData = await fetchAllSeries();
                setSeries(seriesData);
            } catch (error) {
                console.error("Error loading series:", error);
            }
        };
        
        loadSeries();
    }, []);

    useEffect(() => {
        if (selectedSerie) {
            const loadGames = async () => {
                try {
                    const gamesData = await fetchGamesInSeries(
                        selectedSerie.idSeason.toString(), 
                        selectedSerie.id.toString()
                    );
                    setGames(gamesData);
                } catch (error) {
                    console.error("Error loading games:", error);
                }
            };
            loadGames();
        }
    }, [selectedSerie]);

    useEffect(() => {
        if (selectedSerie && selectedTeam) {
            const loadPlayers = async () => {
                try {
                    const playersData = await fetchTeamPlayersInASerie(
                        selectedSerie.idSeason.toString(),
                        selectedSerie.id.toString(),
                        selectedTeam.toString()
                    );
                    setPlayers(playersData);
                } catch (error) {
                    console.error("Error loading players:", error);
                }
            };
            loadPlayers();
        }
    }, [selectedSerie, selectedTeam]);

    useEffect(() => {
        const loadSubstitutions = async () => {
            try {
                const subsData = await adminSubstitutionService.getSubstitutions();
                setSubstitutions(subsData);
            } catch (error) {
                console.error("Error loading substitutions:", error);
            }
        };
        loadSubstitutions();
    }, []);

    const handleCreateSubstitution = async () => {
        try {
            const createdSub = await adminSubstitutionService.createSubstitution({
                ...newSubstitution,
                date: newSubstitution.date, // Send date as a string
            });
            setSubstitutions([...substitutions, createdSub]);
            setNewSubstitution({
                id: 0,
                gameId: 0,
                teamId: 0,
                playerInId: 0,
                playerOutId: 0,
                date: "", // Reset to empty string
            });
        } catch (error) {
            console.error("Error creating substitution:", error);
        }
    };

    const handleDeleteSubstitution = async (id: number) => {
        try {
            await adminSubstitutionService.deleteSubstitution(id);
            setSubstitutions(substitutions.filter((sub) => sub.id !== id));
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting substitution:", error);
        }
    };

    const handleTimeChange = (time: string) => {
        // Set the date string with time in HH:mm format
        setNewSubstitution({ ...newSubstitution, date: time });
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Substitutions Management</h1>
                        <div className="mt-2 text-lg md:text-xl opacity-90">
                            <p>Manage Player Substitutions</p>
                            <p className="mt-1">Total Substitutions: {substitutions.length}</p>
                        </div>
                    </div>
                    <FaExchangeAlt className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">
                    New Substitution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                        onChange={(e) => setSelectedSerie(series.find(s => s.id === Number(e.target.value)) || null)}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    >
                        <option value="">Select Series</option>
                        {series.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <select 
                        onChange={(e) => setSelectedGame(games.find(g => g.id === Number(e.target.value)) || null)}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    >
                        <option value="">Select Game</option>
                        {games.map((g) => (
                            <option key={g.id} value={g.id}>{`${g.team1.name} vs ${g.team2.name}`}</option>
                        ))}
                    </select>

                    <select 
                        onChange={(e) => setSelectedTeam(Number(e.target.value))}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    >
                        <option value="">Select Team</option>
                        {selectedGame && (
                            <>
                                <option value={selectedGame.team1.id}>{selectedGame.team1.name}</option>
                                <option value={selectedGame.team2.id}>{selectedGame.team2.name}</option>
                            </>
                        )}
                    </select>

                    <select 
                        value={newSubstitution.playerOutId}
                        onChange={(e) => setNewSubstitution({...newSubstitution, playerOutId: Number(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    >
                        <option value="">Player Out</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select 
                        value={newSubstitution.playerInId}
                        onChange={(e) => setNewSubstitution({...newSubstitution, playerInId: Number(e.target.value)})}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    >
                        <option value="">Player In</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <input 
                        type="time"
                        value={newSubstitution.date} // Use string format (HH:mm)
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30"
                    />

                    <button
                        onClick={handleCreateSubstitution}
                        className="w-full p-3 bg-primary text-text-light rounded-lg hover:bg-primary-light transition-all duration-300 md:col-span-2"
                    >
                        Create Substitution
                    </button>
                </div>
            </div>

            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">
                    Substitutions List
                </h2>
                <div className="space-y-4">
                    {substitutions.map((sub) => (
                        <div key={sub.id} 
                            className="flex justify-between items-center p-4 bg-white/50 dark:bg-primary/10 rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <FaExchangeAlt className="text-primary" />
                                <div>
                                    <p className="font-semibold">Game ID: {sub.gameId}</p>
                                    <p className="text-sm">
                                        Player Out {sub.playerOutId} ➔ PlayerIn {sub.playerInId}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setDeleteConfirmation(sub)}
                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all"
                                >
                                    <FaTrash className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this substitution?</p>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => handleDeleteSubstitution(deleteConfirmation.id)}
                                className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSubstitutions;
