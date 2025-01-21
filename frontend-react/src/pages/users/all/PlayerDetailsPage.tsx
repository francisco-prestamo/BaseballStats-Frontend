import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchPlayerDetailsForSeasonAndSeries,
    fetchPlayerPositionsForSeasonAndSeries,
} from '../../../services/users/all/playerService';
import {IsPitcher} from "../../../models/IsPitcher.ts";
import {PlayerInPosition} from "../../../models/PlayerInPosition.ts";


const PlayerDetailsPage: React.FC = () => {
    const { playerId, seasonId, serieId } = useParams<{
        playerId: string;
        seasonId: string;
        serieId: string;
    }>();
    const [playerData, setPlayerData] = useState<IsPitcher | null>(null);
    const [positions, setPositions] = useState<PlayerInPosition[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPlayerDetails = async () => {
            try {
                if (playerId && seasonId && serieId) {
                    const data = await fetchPlayerDetailsForSeasonAndSeries(playerId);
                    setPlayerData(data);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch player details. Please try again later.');
            }
        };

        const getPlayerPositions = async () => {
            try {
                if (playerId && seasonId && serieId) {
                    const positionsData = await fetchPlayerPositionsForSeasonAndSeries(playerId, seasonId, serieId);
                    setPositions(positionsData);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch player positions. Please try again later.');
            }
        };

        getPlayerDetails();
        getPlayerPositions();
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

    if (!playerData || (!playerData.player && !playerData.pitcher)) {
        return (
            <div className="container mx-auto p-6">
                <p>Loading player details...</p>
            </div>
        );
    }

    const { player, pitcher } = playerData;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Player Basic Details */}
            <div className="bg-primary text-text-light p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">{player ? player.name : pitcher?.name}</h1>
                <p className="mt-2 text-lg">Player ID: {player ? player.id : pitcher?.id}</p>
                {player && <p className="mt-2 text-lg">Age: {player.age}</p>}
            </div>

            {/* Player or Pitcher Specific Stats */}
            <div className="bg-bg-light dark:bg-primary-light p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">Player Stats for Season {seasonId} - Series {serieId}</h2>
                <ul className="mt-4 space-y-2">
                    {player && (
                        <>
                            <li>Years of Experience: {player.yearsOfExperience}</li>
                            <li>Batting Average: {player.battingAverage ?? 'N/A'}</li>
                        </>
                    )}
                    {pitcher && (
                        <>
                            <li>Years of Experience: {pitcher.yearsOfExperience}</li>
                            <li>Batting Average: {pitcher.battingAverage ?? 'N/A'}</li>
                            <li>Games Won: {pitcher.gamesWonNumber}</li>
                            <li>Games Lost: {pitcher.gamesLostNumber}</li>
                            <li>Allowed Runs Average: {pitcher.allowedRunsAvg}</li>
                            <li>Handedness: {pitcher.rightHanded ? 'Right-Handed' : 'Left-Handed'}</li>
                        </>
                    )}
                </ul>
            </div>

            {/* Player Positions */}
            {positions && positions.length > 0 && (
                <div className="bg-secondary-light dark:bg-secondary-dark p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold">Positions Played</h2>
                    <ul className="mt-4 space-y-2">
                        {positions.map((position, index) => (
                            <li key={index} className="flex justify-between items-center border-b border-primary-light pb-2">
                                <span>Position: {position.position}</span>
                                <span>Efectividad: {position.efectividad.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlayerDetailsPage;
