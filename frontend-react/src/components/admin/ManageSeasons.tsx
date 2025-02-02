import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaSearch, FaCalendar } from "react-icons/fa";
import adminSeasonService from "../../services/users/admin/adminSeasonService";
import { Season } from "../../models/Season.ts";

const ManageSeasons: React.FC = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [newSeasonId, setNewSeasonId] = useState<number | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSeasons = async () => {
        try {
            const response = await adminSeasonService.getSeasons();
            setSeasons(response);
        } catch (error) {
            console.error("Error fetching seasons:", error);
        }
    };

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
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Season Management</h1>
                        <p className="mt-2 text-lg md:text-xl opacity-90">Total Seasons: {seasons.length}</p>
                    </div>
                    <FaCalendar className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                    <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Create New Season</h2>
                    <input
                        type="number"
                        placeholder="Season ID"
                        value={newSeasonId || ''}
                        onChange={(e) => setNewSeasonId(Number(e.target.value))}
                        className="w-full p-3 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleCreateSeason} className="w-full p-3 mt-4 rounded-lg bg-primary text-text-light font-medium hover:bg-primary-light">Create Season</button>
                </div>
                <div className="flex-1 bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                    <h3 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Search Seasons</h3>
                    <input
                        type="text"
                        placeholder="Search by Season ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/50" />
                </div>
            </div>

            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/20">
                <h3 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary-lighter">Seasons List</h3>
                {filteredSeasons.length === 0 ? (
                    <p className="text-text-dark/70">No seasons found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSeasons.map((season) => (
                            <div key={season.id} className="flex justify-between items-center p-4 bg-secondary-lightest rounded-lg border border-primary/20">
                                <p className="font-semibold">Season ID: {season.id}</p>
                                <button onClick={() => setDeleteConfirmation(season.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20">
                                    <FaTrash className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-light dark:bg-bg-dark rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete the season with ID {deleteConfirmation}?</p>
                        <div className="flex space-x-4">
                            <button onClick={() => setDeleteConfirmation(null)} className="flex-grow p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50">Cancel</button>
                            <button onClick={handleDeleteSeason} className="flex-grow p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSeasons;
