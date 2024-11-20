import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesInSeries, fetchTeamsInSeries } from '../../../services/serieService';
import { Game, Team } from '../../../services/types';
import { BiTrophy, BiRightArrow, BiCalendar } from 'react-icons/bi';
import { GiBaseballBat } from 'react-icons/gi';

const SerieDetailPage: React.FC = () => {
    const { seasonId, serieId } = useParams<{ seasonId: string; serieId: string }>();
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSeriesDetails = async () => {
            try {
                if (seasonId && serieId) {
                    const gamesData = await fetchGamesInSeries(seasonId, serieId);
                    const teamsData = await fetchTeamsInSeries(seasonId, serieId);
                    setGames(gamesData);
                    setTeams(teamsData);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch details for this series.');
            }
        };
        getSeriesDetails();
    }, [seasonId, serieId]);

    const handleGameClick = (gameId: string) => {
        navigate(`/games/${gameId}`);
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold animate-fade-in">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Series Details</h1>
                        <p className="text-lg md:text-xl mt-2 opacity-90">
                            Season {seasonId} - Series {serieId}
                        </p>
                    </div>
                    <BiTrophy className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Teams Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Participating Teams
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                        <GiBaseballBat className="text-3xl text-primary dark:text-primary-lighter" />
                                    </div>
                                    <span className="text-lg font-semibold text-text-dark dark:text-text-light">
                                        {team.name}
                                    </span>
                                </div>
                                <div className="px-4 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full border border-primary/20 dark:border-primary-lighter/20">
                                    <span className="text-sm text-primary dark:text-primary-lighter">
                                        Team #{team.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Games Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Games
                </h3>
                <div className="space-y-4">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => handleGameClick(game.id)}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-secondary-lightest dark:bg-primary rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-pointer border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                    <BiCalendar className="text-2xl text-primary dark:text-primary-lighter" />
                                </div>
                                <span className="text-md text-text-dark dark:text-text-light">
                                    {game.date.toString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="font-semibold text-text-dark dark:text-text-light">
                                    {game.team1.name}
                                </span>
                                <div className="px-4 py-2 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg border border-primary/20 dark:border-primary-lighter/20">
                                    <span className="font-bold text-primary dark:text-primary-lighter">
                                        {game.team1Runs} - {game.team2Runs}
                                    </span>
                                </div>
                                <span className="font-semibold text-text-dark dark:text-text-light">
                                    {game.team2.name}
                                </span>
                            </div>
                            <BiRightArrow className="hidden md:block text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SerieDetailPage;