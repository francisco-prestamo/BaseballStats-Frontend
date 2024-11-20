import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesInSeries, fetchTeamsInSeries } from '../../../services/serieService';
import { Game, Team } from '../../../services/types';
import { BiTrophy, BiRightArrow, BiCalendar } from 'react-icons/bi';
import { GiBaseballBat } from 'react-icons/gi';
import { Card, CardContent } from '../../../components/common/Card';

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
        <div className="container mx-auto p-4 space-y-4">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center text-text-light">
                    <div>
                        <h1 className="text-4xl font-bold">Series Details</h1>
                        <p className="text-xl mt-2 opacity-90">Season {seasonId} - Series {serieId}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <BiTrophy className="text-5xl text-text-light opacity-80" />
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Participating Teams
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map((team) => (
                        <Card key={team.id} className="bg-secondary-lightest dark:bg-primary hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center space-x-3">
                                        <GiBaseballBat className="text-2xl text-primary dark:text-primary-lighter" />
                                        <span className="text-lg font-semibold text-text-dark dark:text-text-light">
                                            {team.name}
                                        </span>
                                    </div>
                                    <div className="px-3 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full">
                                        <span className="text-sm text-primary dark:text-primary-lighter">
                                            Team #{team.id}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Games Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Games
                </h3>
                <div className="space-y-3">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => handleGameClick(game.id)}
                            className="bg-secondary-lightest dark:bg-primary rounded-lg p-4 hover:shadow-md cursor-pointer transition-all duration-200 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                                <div className="flex items-center space-x-3">
                                    <BiCalendar className="text-xl text-primary dark:text-primary-lighter" />
                                    <span className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        {game.date.toString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-semibold text-text-dark dark:text-text-light">
                                        {game.team1.name}
                                    </span>
                                    <div className="px-4 py-2 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg">
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SerieDetailPage;