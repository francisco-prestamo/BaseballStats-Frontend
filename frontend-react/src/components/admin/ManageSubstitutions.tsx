import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
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
    const [deleteConfirmation, setDeleteConfirmation] = useState<Substitution | null>(null);

    const [newSubstitution, setNewSubstitution] = useState<Substitution>({
        id: 0,
        gameId: 0,
        teamId: 0,
        playerInId: 0,
        playerOutId: 0,
        date: "", // Ensure date as string in HH:mm:ss format
    });

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
        if (!selectedGame || !selectedTeam || newSubstitution.playerInId === 0 || newSubstitution.playerOutId === 0) {
            console.error("Missing required fields");
            return;
        }

        try {
            const formattedTime = `${newSubstitution.date}:00`; // Ensure HH:mm:ss format

            const createdSub = await adminSubstitutionService.createSubstitution({
                ...newSubstitution,
                gameId: selectedGame.id,
                teamId: selectedTeam,
                date: formattedTime,
            });

            setSubstitutions([...substitutions, createdSub]);
            setNewSubstitution({
                id: 0,
                gameId: 0,
                teamId: 0,
                playerInId: 0,
                playerOutId: 0,
                date: "",
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

    return (
        <div className="container mx-auto p-6 space-y-10">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <h1 className="text-5xl font-bold">Substitutions Management</h1>
            </div>

            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold">New Substitution</h2>

                <select onChange={(e) => setSelectedSerie(series.find(s => s.id === Number(e.target.value)) || null)}>
                    <option value="">Select Series</option>
                    {series.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <select onChange={(e) => {
                    const game = games.find(g => g.id === Number(e.target.value)) || null;
                    setSelectedGame(game);
                    setNewSubstitution(prev => ({ ...prev, gameId: game ? game.id : 0 }));
                }}>
                    <option value="">Select Game</option>
                    {games.map((g) => (
                        <option key={g.id} value={g.id}>{`${g.team1.name} vs ${g.team2.name}`}</option>
                    ))}
                </select>

                <select onChange={(e) => {
                    setSelectedTeam(Number(e.target.value));
                    setNewSubstitution(prev => ({ ...prev, teamId: Number(e.target.value) }));
                }}>
                    <option value="">Select Team</option>
                    {selectedGame && (
                        <>
                            <option value={selectedGame.team1.id}>{selectedGame.team1.name}</option>
                            <option value={selectedGame.team2.id}>{selectedGame.team2.name}</option>
                        </>
                    )}
                </select>

                {/* Player Selection & Time Input Grouped Together */}
                <div className="flex gap-4 mt-4">
                    <select 
                        value={newSubstitution.playerOutId}
                        onChange={(e) => setNewSubstitution({...newSubstitution, playerOutId: Number(e.target.value)})}
                    >
                        <option value="">Player Out</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <select 
                        value={newSubstitution.playerInId}
                        onChange={(e) => setNewSubstitution({...newSubstitution, playerInId: Number(e.target.value)})}
                    >
                        <option value="">Player In</option>
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <input 
                        type="time"
                        value={newSubstitution.date.replace(":00", "")}
                        onChange={(e) => setNewSubstitution({ ...newSubstitution, date: `${e.target.value}:00` })}
                    />
                </div>

                <button onClick={handleCreateSubstitution}>
                    Create Substitution
                </button>
            </div>
            
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold">Substitutions List</h2>
                {substitutions.map((sub) => (
                    <div key={sub.id}>
                        <p>Game ID: {sub.gameId}, Player Out {sub.playerOutId} ➔ Player In {sub.playerInId}</p>
                        <button onClick={() => setDeleteConfirmation(sub)}>
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this substitution?</p>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => handleDeleteSubstitution(deleteConfirmation.id)}
                                className="p-3 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
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
