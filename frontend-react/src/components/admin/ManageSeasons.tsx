import React, { useState, useEffect, useMemo } from "react";
import { FaTimes, FaTrash, FaEdit, FaSearch, FaCalendar } from "react-icons/fa";
import adminSeasonService from "../../services/users/admin/adminSeasonService";
import { Season } from "../../models/Season.ts";

const ManageSeasons: React.FC = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [newSeasonId, setNewSeasonId] = useState<number | null>(null);
    const [editingSeason, setEditingSeason] = useState<Season | null>(null);
    const [editingSeasonNewId, setEditingSeasonNewId] = useState<number | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);

    // Filtering states
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSeasons = async () => {
        try {
            const response = await adminSeasonService.getSeasons();
            setSeasons(response);
        } catch (error) {
            console.error("Error fetching seasons:", error);
        }
    };

    // Memoized and filtered seasons
    const filteredSeasons = useMemo(() => {
        return seasons.filter(season =>
            season.id.toString().includes(searchTerm)
        );
    }, [seasons, searchTerm]);

    const handleCreateSeason = async () => {
        try {
            if (!newSeasonId) {
                alert("Please provide a season ID");
                return;
            }
            await adminSeasonService.createSeason({ id: newSeasonId });
            fetchSeasons();
            setNewSeasonId(null);
        } catch (error) {
            console.error("Error creating season:", error);
        }
    };

    const handleUpdateSeason = async () => {
        try {
            if (!editingSeason) return;
            await adminSeasonService.updateSeason(editingSeason.id,{id: editingSeasonNewId!});
            fetchSeasons();
            setEditingSeason(null);
        } catch (error) {
            console.error("Error updating season:", error);
        }
    };

    const handleDeleteSeason = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminSeasonService.deleteSeason(deleteConfirmation);
            fetchSeasons();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting season:", error);
        }
    };

    useEffect(() => {
        fetchSeasons();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Season Management</h1>
                        <div className="mt-2 text-lg md:text-xl opacity-90">
                            <p>Manage Seasons</p>
                            <p className="mt-1">Total Seasons: {seasons.length}</p>
                        </div>
                    </div>
                    <FaCalendar className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Season Creation Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Creation Form */}
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Create New Season
                    </h2>
                    <div className="space-y-4">
                        <input
                            type="number"
                            placeholder="Season ID"
                            value={newSeasonId || ''}
                            onChange={(e) => setNewSeasonId(Number(e.target.value))}
                            className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            onClick={handleCreateSeason}
                            className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                        >
                            Create Season
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                    <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                        Search Seasons
                    </h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by Season ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <FaSearch
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50 dark:text-text-light/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Seasons List Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Seasons List
                </h3>
                {filteredSeasons.length === 0 ? (
                    <p className="text-text-dark/70 dark:text-text-light/70">
                        No seasons found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSeasons.map((season) => (
                            <div
                                key={season.id}
                                className="group flex justify-between items-center p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:shadow-xl border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                            >
                                <p className="font-semibold text-text-dark dark:text-text-light">
                                    Season ID: {season.id}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {setEditingSeason(season); setEditingSeasonNewId(season.id)}}
                                        className="p-2 rounded-lg bg-primary/10 dark:bg-primary-lighter/10 hover:bg-primary/20 dark:hover:bg-primary-lighter/20 transition-all duration-300"
                                    >
                                        <FaEdit className="text-primary dark:text-primary-lighter" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(season.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                                    >
                                        <FaTrash className="text-red-500 dark:text-red-300" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Season Modal */}
            {editingSeason && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light">
                                Edit Season
                            </h2>
                            <button
                                onClick={() => setEditingSeason(null)}
                                className="p-2 rounded-lg hover:bg-secondary/30 dark:hover:bg-primary/30 transition-colors"
                            >
                                <FaTimes className="text-text-dark/70 dark:text-text-light/70" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="number"
                                placeholder="Season ID"
                                value={editingSeasonNewId!}
                                onChange={(e) => setEditingSeasonNewId(Number(e.target.value))}
                                className="w-full p-3 rounded-lg bg-white/50 dark:bg-primary/10 border border-secondary/30 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={handleUpdateSeason}
                                className="w-full p-3 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light transition-all duration-300"
                            >
                                Update Season
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md animate-pop-in">
                        <h2 className="text-2xl font-semibold mb-4 text-text-dark dark:text-text-light">
                            Confirm Deletion
                        </h2>
                        <p className="mb-6 text-text-dark/70 dark:text-text-light/70">
                            Are you sure you want to delete the season with ID {deleteConfirmation}?
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 dark:bg-primary/30 dark:hover:bg-primary/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSeason}
                                className="flex-grow p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
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

export default ManageSeasons;
