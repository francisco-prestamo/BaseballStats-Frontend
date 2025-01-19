import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaEdit, FaCalendarAlt } from "react-icons/fa";
import adminSerieService from "../../services/users/admin/adminSerieService";
import { Serie } from "../../models/crud/Series";

const ManageSeries: React.FC = () => {
    const [series, setSeries] = useState<Serie[]>([]);
    const [newSerie, setNewSerie] = useState<Serie>({
        id: 0,
        idSeason: 0,
        name: "",
        type: "",
        startDate: new Date(),
        endDate: new Date(),
    });

    const [editingSerie, setEditingSerie] = useState<Serie | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSeries = async () => {
        try {
            const response = await adminSerieService.getSeries();
            setSeries(response);
        } catch (error) {
            console.error("Error fetching series:", error);
        }
    };

    const filteredSeries = useMemo(() => {
        return series.filter((serie) =>
            serie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [series, searchTerm]);

    const handleCreateSerie = async () => {
        try {
            if (!newSerie.id || !newSerie.idSeason || !newSerie.name || !newSerie.type) {
                alert("All fields are required to create a series.");
                return;
            }

            await adminSerieService.createSerie(newSerie as Serie);
            fetchSeries();
            setNewSerie({
                id: 0,
                idSeason: 0,
                name: "",
                type: "",
                startDate: new Date(),
                endDate: new Date(),
            });
        } catch (error) {
            console.error("Error creating series:", error);
        }
    };

    const handleUpdateSerie = async () => {
        try {
            if (!editingSerie) return;
            await adminSerieService.updateSerie(editingSerie);
            fetchSeries();
            setEditingSerie(null);
        } catch (error) {
            console.error("Error updating series:", error);
        }
    };

    const handleDeleteSerie = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminSerieService.deleteSerie(deleteConfirmation);
            fetchSeries();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting series:", error);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Series Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage Series</p>
                        <p className="mt-1">Total Series: {series.length}</p>
                    </div>
                    <FaCalendarAlt className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Series Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Series</h2>

                    {/* Inputs */}
                    <input
                        type="number"
                        placeholder="ID"
                        value={newSerie.id === 0 ? "" : newSerie.id}
                        onChange={(e) => setNewSerie({ ...newSerie, id: Number(e.target.value) || 0 })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="number"
                        placeholder="Season ID"
                        value={newSerie.idSeason === 0 ? "" : newSerie.idSeason}
                        onChange={(e) =>
                            setNewSerie({ ...newSerie, idSeason: Number(e.target.value) || 0 })
                        }
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={newSerie.name}
                        onChange={(e) => setNewSerie({ ...newSerie, name: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="text"
                        placeholder="Type"
                        value={newSerie.type}
                        onChange={(e) => setNewSerie({ ...newSerie, type: e.target.value })}
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={newSerie.startDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                            setNewSerie({ ...newSerie, startDate: new Date(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={newSerie.endDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                            setNewSerie({ ...newSerie, endDate: new Date(e.target.value) })
                        }
                        className="w-full mb-3 p-3"
                    />

                    <button onClick={handleCreateSerie} className="w-full p-3 bg-primary text-white">
                        Create Series
                    </button>
                </div>

                {/* Search Section */}
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Series</h3>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3"
                    />
                </div>
            </div>

            {/* Series List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Series List</h3>

                {filteredSeries.length === 0 ? (
                    <p>No series found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSeries.map((serie) => (
                            <div key={serie.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg">
                                <p>{serie.name}</p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setEditingSerie(serie)}
                                        className="p-2 bg-blue-500 text-white rounded-lg"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(serie.id)}
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

            {/* Modal for Editing */}
            {editingSerie && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Edit Series</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editingSerie.name}
                            onChange={(e) =>
                                setEditingSerie({ ...editingSerie, name: e.target.value })
                            }
                            className="w-full mb-3 p-3"
                        />
                        <input
                            type="text"
                            placeholder="Type"
                            value={editingSerie.type}
                            onChange={(e) =>
                                setEditingSerie({ ...editingSerie, type: e.target.value })
                            }
                            className="w-full mb-3 p-3"
                        />
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={editingSerie.startDate.toISOString().split("T")[0]}
                            onChange={(e) =>
                                setEditingSerie({
                                    ...editingSerie,
                                    startDate: new Date(e.target.value),
                                })
                            }
                            className="w-full mb-3 p-3"
                        />
                        <input
                            type="date"
                            placeholder="End Date"
                            value={editingSerie.endDate.toISOString().split("T")[0]}
                            onChange={(e) =>
                                setEditingSerie({
                                    ...editingSerie,
                                    endDate: new Date(e.target.value),
                                })
                            }
                            className="w-full mb-3 p-3"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingSerie(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateSerie}
                                className="p-3 bg-blue-500 text-white rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Delete Confirmation */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this series?</p>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSerie}
                                className="p-3 bg-red-500 text-white rounded-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSeries;
