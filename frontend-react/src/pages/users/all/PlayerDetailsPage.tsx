import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPlayerDetailsForSeasonAndSeries } from '../../../services/users/all/playerService';
import { Player } from '../../../models/Player';

const PlayerDetailsPage: React.FC = () => {
    const { playerId, seasonId, serieId } = useParams<{
        playerId: string;
        seasonId: string;
        serieId: string;
    }>();
    const [player, setPlayer] = useState<Player | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPlayerDetails = async () => {
            try {
                if (playerId && seasonId && serieId) {
                    const playerData = await fetchPlayerDetailsForSeasonAndSeries(playerId, seasonId, serieId);
                    setPlayer(playerData);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch player details. Please try again later.');
            }
        };

        getPlayerDetails();
    }, [playerId, seasonId, serieId]);

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-500 text-text-light p-4 rounded-lg text-center font-semibold animate-fade-in">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="container mx-auto p-6">
                <p>Loading player details...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="bg-primary text-text-light p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">{player.name}</h1>
                <p className="mt-2 text-lg">Player ID: {player.id}</p>
            </div>
            <div className="bg-bg-light dark:bg-primary-light p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">Player Stats for Season {seasonId} - Series {serieId}</h2>
                <ul className="mt-4 space-y-2">
                    {/* Add other stats as necessary */}
                </ul>
            </div>
        </div>
    );
};

export default PlayerDetailsPage;