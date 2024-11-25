import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesInSeries, fetchTeamsInSeries } from '../../../services/serieService';
import { Game, Team } from '../../../services/types';
import {BiTrophy, BiRightArrow, BiCalendar, BiMedal, BiSad, BiChevronDown, BiChevronUp, BiFilter} from 'react-icons/bi';
import { GiBaseballBat, GiPodiumWinner, GiPodiumSecond, GiPodiumThird } from 'react-icons/gi';

interface TeamStanding extends Team {
    winningPercentage: number;
}

const SerieDetailPage: React.FC = () => {
    const { seasonId, serieId } = useParams<{ seasonId: string; serieId: string }>();
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [teamStandings, setTeamStandings] = useState<TeamStanding[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showAllTeams, setShowAllTeams] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<string>('all');
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);

    useEffect(() => {
        const getSeriesDetails = async () => {
            try {
                if (seasonId && serieId) {
                    const gamesData = await fetchGamesInSeries(seasonId, serieId);
                    const teamsData = await fetchTeamsInSeries(seasonId, serieId);

                    const standings = teamsData.map(team => {
                        const totalGames = team.winGames + team.loseGames;
                        const winningPercentage = totalGames > 0 ? team.winGames / totalGames : 0;

                        return {
                            ...team,
                            winningPercentage
                        };
                    });

                    const sortedStandings = standings.sort((a, b) =>
                        b.winningPercentage - a.winningPercentage
                    );

                    setGames(gamesData);
                    setFilteredGames(gamesData);
                    setTeamStandings(sortedStandings);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch details for this series.');
            }
        };
        getSeriesDetails();
    }, [seasonId, serieId]);

    useEffect(() => {
        if (selectedTeam === 'all') {
            setFilteredGames(games);
        } else {
            const filtered = games.filter(game =>
                game.team1.id === selectedTeam || game.team2.id === selectedTeam
            );
            setFilteredGames(filtered);
        }
    }, [selectedTeam, games]);

    const handleGameClick = (gameId: string) => {
        navigate(`/games/${gameId}`);
    };

    const getRankIcon = (index: number) => {
        switch(index) {
            case 0: return <GiPodiumWinner className="text-4xl text-yellow-400" />;
            case 1: return <GiPodiumSecond className="text-4xl text-gray-400" />;
            case 2: return <GiPodiumThird className="text-4xl text-amber-700" />;
            default: return null;
        }
    };

    const displayedTeams = showAllTeams ? teamStandings : teamStandings.slice(0, 3);

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

            {/* Win Team Section */}
            {teamStandings.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-800 to-primary rounded-2xl p-6 shadow-lg animate-slide-up">
                    <div className="flex items-center justify-between text-text-light">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Series Winner</h2>
                            <p className="text-2xl font-semibold">{teamStandings[0].name}</p>
                            <p className="text-xl">
                                Record: {teamStandings[0].winGames}-{teamStandings[0].loseGames}
                                ({(teamStandings[0].winningPercentage * 100).toFixed(1)}%)
                            </p>
                        </div>
                        <BiMedal className="text-8xl text-text-light opacity-90" />
                    </div>
                </div>
            )}

            {/* Last Place Section*/}
            {teamStandings.length > 1 && (
                <div className="bg-gradient-to-br from-red-800 to-primary rounded-2xl p-6 shadow-lg animate-slide-up">
                    <div className="flex items-center justify-between text-text-light">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Series Last Place</h2>
                            <p className="text-2xl font-semibold">{teamStandings[teamStandings.length - 1].name}</p>
                            <p className="text-xl">
                                Record: {teamStandings[teamStandings.length - 1].winGames}-{teamStandings[teamStandings.length - 1].loseGames}
                                ({(teamStandings[teamStandings.length - 1].winningPercentage * 100).toFixed(1)}%)
                            </p>
                        </div>
                        <BiSad className="text-8xl text-text-light opacity-50" />
                    </div>
                </div>
            )}

            {/* Team Standings Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Team Standings
                </h3>
                <div className="space-y-4">
                    {displayedTeams.map((team, index) => (
                        <div
                            key={team.id}
                            className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                        {getRankIcon(index) || <GiBaseballBat className="text-3xl text-primary dark:text-primary-lighter" />}
                                    </div>
                                    <div>
                                        <span className="text-lg font-semibold text-text-dark dark:text-text-light block">
                                            {team.name}
                                        </span>
                                        <span className="text-sm text-primary dark:text-primary-lighter">
                                            Rank #{index + 1}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="px-4 py-2 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg border border-primary/20 dark:border-primary-lighter/20">
                                        <span className="font-bold text-primary dark:text-primary-lighter">
                                            {team.winGames}-{team.loseGames}
                                        </span>
                                    </div>
                                    <div
                                        className="px-4 py-2 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg border border-primary/20 dark:border-primary-lighter/20">
                                        <span className="text-sm text-primary dark:text-primary-lighter">
                                            {(team.winningPercentage * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div
                                        className="px-4 py-2 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg border border-primary/20 dark:border-primary-lighter/20">
                                        <span className="font-bold text-primary dark:text-primary-lighter">
                                            Runs: {team.totalRuns}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {teamStandings.length > 3 && (
                        <button
                            onClick={() => setShowAllTeams(!showAllTeams)}
                            className="w-full mt-4 py-2 px-4 bg-primary/10 dark:bg-primary-lighter/10 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/20 dark:hover:bg-primary-lighter/20 transition-colors"
                        >
                            <span className="text-primary dark:text-primary-lighter">
                                {showAllTeams ? 'Show Less' : 'Show All Teams'}
                            </span>
                            {showAllTeams ?
                                <BiChevronUp className="text-xl text-primary dark:text-primary-lighter" /> :
                                <BiChevronDown className="text-xl text-primary dark:text-primary-lighter" />
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* Games Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-primary-lighter">
                    <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light">
                        Games
                    </h3>
                    <div className="flex items-center space-x-2">
                        <BiFilter className="text-xl text-primary dark:text-primary-lighter" />
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="bg-secondary-lightest dark:bg-primary rounded-lg px-3 py-1 border border-primary/20 dark:border-primary-lighter/20"
                        >
                            <option value="all">All Teams</option>
                            {teamStandings.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-4">
                    {filteredGames.map((game) => (
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