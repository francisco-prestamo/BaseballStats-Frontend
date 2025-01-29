import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import adminPitcherService from "../../services/users/admin/adminPitcherService";
import { Pitcher } from "../../models/crud/Pitcher";

const ManagePitchers: React.FC = () => {
    const [pitchers, setPitchers] = useState<Pitcher[]>([]);
    const [newPitcher, setNewPitcher] = useState<Pitcher>({
        playerId: 0,
        gamesWonNumber: 0,
        gamesLostNumber: 0,
        rightHanded: true,
        allowedRunsAvg: 0,
        effectiveness: 0,
    });

    const [editingPitcher, setEditingPitcher] = useState<Pitcher | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPitchers = async () => {
        try {
            const response = await adminPitcherService.getPitchers();
            setPitchers(response);
        } catch (error) {
            console.error("Error fetching pitchers:", error);
        }
    };

    const filteredPitchers = useMemo(() => {
        return pitchers.filter((pitcher) =>
            pitcher.playerId.toString().includes(searchTerm)
        );
    }, [pitchers, searchTerm]);

    const handleCreatePitcher = async () => {
        try {
            if (!newPitcher.playerId || newPitcher.gamesWonNumber < 0 || newPitcher.gamesLostNumber < 0) {
                alert("All fields are required to create a pitcher.");
                return;
            }

            await adminPitcherService.createPitcher(newPitcher);
            fetchPitchers();
            setNewPitcher({
                playerId: 0,
                gamesWonNumber: 0,
                gamesLostNumber: 0,
                rightHanded: true,
                allowedRunsAvg: 0,
                effectiveness: 0,
            });
        } catch (error) {
            console.error("Error creating pitcher:", error);
        }
    };

    const handleUpdatePitcher = async () => {
        try {
            if (!editingPitcher) return;
            await adminPitcherService.updatePitcher(editingPitcher);
            fetchPitchers();
            setEditingPitcher(null);
        } catch (error) {
            console.error("Error updating pitcher:", error);
        }
    };

    const handleDeletePitcher = async () => {
        try {
            if (!deleteConfirmation) return;
            await adminPitcherService.deletePitcher(deleteConfirmation);
            fetchPitchers();
            setDeleteConfirmation(null);
        } catch (error) {
            console.error("Error deleting pitcher:", error);
        }
    };

    useEffect(() => {
        fetchPitchers();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Pitcher Management</h1>
                        <p className="mt-2 text-lg opacity-90">Manage Pitchers</p>
                        <p className="mt-1">Total Pitchers: {pitchers.length}</p>
                    </div>
                    <FaUsers className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Pitcher Creation and Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Create New Pitcher</h2>

                    <input
                        type="number"
                        placeholder="Player ID"
                        value={newPitcher.playerId === 0 ? "" : newPitcher.playerId}
                        onChange={(e) => setNewPitcher({ ...newPitcher, playerId: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="number"
                        placeholder="Games Won"
                        value={newPitcher.gamesWonNumber}
                        onChange={(e) => setNewPitcher({ ...newPitcher, gamesWonNumber: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="number"
                        placeholder="Games Lost"
                        value={newPitcher.gamesLostNumber}
                        onChange={(e) => setNewPitcher({ ...newPitcher, gamesLostNumber: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    <label className="block mb-3">
                        Right-Handed:
                        <input
                            type="checkbox"
                            checked={newPitcher.rightHanded}
                            onChange={(e) => setNewPitcher({ ...newPitcher, rightHanded: e.target.checked })}
                            className="ml-2"
                        />
                    </label>

                    <input
                        type="number"
                        placeholder="Allowed Runs Average"
                        step="0.01"
                        value={newPitcher.allowedRunsAvg}
                        onChange={(e) => setNewPitcher({ ...newPitcher, allowedRunsAvg: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    <input
                        type="number"
                        placeholder="Effectiveness"
                        step="0.01"
                        value={newPitcher.effectiveness}
                        onChange={(e) => setNewPitcher({ ...newPitcher, effectiveness: Number(e.target.value) })}
                        className="w-full mb-3 p-3"
                    />

                    <button onClick={handleCreatePitcher} className="w-full p-3 bg-primary text-white rounded-lg">
                        Create Pitcher
                    </button>
                </div>

                <div className="flex-1 bg-bg-light rounded-2xl shadow-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Search Pitchers</h3>
                    <input
                        type="text"
                        placeholder="Search by Player ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 rounded-lg"
                    />
                </div>
            </div>

            {/* Pitchers List */}
            <div className="bg-bg-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Pitchers List</h3>
                {filteredPitchers.length === 0 ? (
                    <p>No pitchers found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPitchers.map((pitcher) => (
                            <div key={pitcher.playerId} className="flex flex-col p-4 bg-white rounded-lg shadow-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">Player ID: {pitcher.playerId}</h4>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setEditingPitcher(pitcher)}
                                            className="p-2 bg-blue-500 text-white rounded-lg"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmation(pitcher.playerId)}
                                            className="p-2 bg-red-500 text-white rounded-lg"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <p>Games Won: {pitcher.gamesWonNumber}</p>
                                <p>Games Lost: {pitcher.gamesLostNumber}</p>
                                <p>Right-Handed: {pitcher.rightHanded ? "Yes" : "No"}</p>
                                <p>Allowed Runs Avg: {pitcher.allowedRunsAvg}</p>
                                <p>Effectiveness: {pitcher.effectiveness}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Pitcher Modal */}
            {editingPitcher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Update Pitcher</h2>
                        <input
                            type="number"
                            value={editingPitcher.playerId}
                            readOnly
                            className="w-full mb-3 p-3 bg-gray-100"
                        />
                        <input
                            type="number"
                            value={editingPitcher.gamesWonNumber}
                            onChange={(e) => setEditingPitcher({ ...editingPitcher, gamesWonNumber: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        />
                        <input
                            type="number"
                            value={editingPitcher.gamesLostNumber}
                            onChange={(e) => setEditingPitcher({ ...editingPitcher, gamesLostNumber: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        />
                        <label className="block mb-3">
                            Right-Handed:
                            <input
                                type="checkbox"
                                checked={editingPitcher.rightHanded}
                                onChange={(e) => setEditingPitcher({ ...editingPitcher, rightHanded: e.target.checked })}
                                className="ml-2"
                            />
                        </label>
                        <input
                            type="number"
                            value={editingPitcher.allowedRunsAvg}
                            step="0.01"
                            onChange={(e) => setEditingPitcher({ ...editingPitcher, allowedRunsAvg: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        />
                        <input
                            type="number"
                            value={editingPitcher.effectiveness}
                            step="0.01"
                            onChange={(e) => setEditingPitcher({ ...editingPitcher, effectiveness: Number(e.target.value) })}
                            className="w-full mb-3 p-3"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleUpdatePitcher}
                                className="p-3 bg-primary text-white rounded-lg"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditingPitcher(null)}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold">Are you sure you want to delete this pitcher?</h2>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={handleDeletePitcher}
                                className="p-3 bg-red-500 text-white rounded-lg"
                            >
                                Yes, Delete
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

export default ManagePitchers;
