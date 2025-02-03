import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchGameDetails,
    fetchTeamAlignments,
    fetchPlayerSubstitutions
} from '../../../services/users/all/gameService.ts';
import { GiBaseballGlove, GiBaseballBat } from 'react-icons/gi';
import { PiBaseballCap } from 'react-icons/pi';
import { BiRightArrow } from 'react-icons/bi';
import { Game } from "../../../models/Game";
import { PlayerInPosition } from "../../../models/PlayerInPosition";
import { Change } from "../../../models/Change";
import baseballFieldImg from '../../../images/baseball-field.png';
import { useAuth } from '../../../authContext';

type Position = 'Pitcher' | 'Catcher' | 'First-Base' | 'Second-Base' | 'Third-Base' |
    'Shortstop' | 'Left-Field' | 'Center-Field' | 'Right-Field';

const GameDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId, seasonId, serieId } = useParams<{
        gameId: string,
        seasonId: string,
        serieId: string
    }>();
    const [game, setGame] = useState<Game | null>(null);
    const [team1Alignment, setTeam1Alignment] = useState<PlayerInPosition[]>([]);
    const [team2Alignment, setTeam2Alignment] = useState<PlayerInPosition[]>([]);
    const [team1Substitutions, setTeam1Substitutions] = useState<Change[]>([]);
    const [team2Substitutions, setTeam2Substitutions] = useState<Change[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showingTeam1, setShowingTeam1] = useState<boolean>(true);
    const { userType } = useAuth();

    useEffect(() => {
        const getGameDetails = async () => {
            try {
                if (gameId) {
                    const gameData = await fetchGameDetails(gameId);
                    const alignments = await fetchTeamAlignments(gameId);
                    const substitutions = await fetchPlayerSubstitutions(gameId);
                    console.log(alignments.team1Alignment);
                    setGame(gameData);
                    setTeam1Alignment(alignments.team1Alignment);
                    setTeam2Alignment(alignments.team2Alignment);
                    setTeam1Substitutions(substitutions.team1Substitutions);
                    setTeam2Substitutions(substitutions.team2Substitutions);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch game details. Please try again later.');
            }
        };
        getGameDetails();
    }, [gameId]);

    // Navigation to Player Details
    const navigateToPlayerDetails = (playerId: number) => {
        navigate(`/players/${playerId}/${seasonId}/${serieId}`);
    };

    const fieldAlignment = showingTeam1 ? team1Alignment : team2Alignment;
    const battingAlignment = showingTeam1 ? team2Alignment : team1Alignment;

    const getPlayerIcon = (position: Position) => {
        if (position === 'Pitcher') {
            return <PiBaseballCap className="text-2xl text-primary dark:text-primary-lighter"/>;
        }
        return <GiBaseballGlove className="text-2xl text-primary dark:text-primary-lighter"/>;
    };

    const getPlayerPosition = (position: Position) => {
        const baseStyles = "absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-bg-light dark:bg-primary-light backdrop-blur rounded-lg border border-primary/20 dark:border-primary-lighter/20 text-sm font-medium transition-all duration-300 whitespace-nowrap z-10 hover:scale-105 hover:shadow-xl group-hover:border-primary/40 dark:group-hover:border-primary-lighter/40 flex items-center gap-2 cursor-pointer";

        const positions: Record<Position, string> = {
            'Pitcher': 'top-[60%] left-[50%]',
            'Catcher': 'top-[90%] left-[50%]',
            'First-Base': 'top-[55%] left-[75%]',
            'Second-Base': 'top-[40%] left-[62%]',
            'Third-Base': 'top-[55%] left-[25%]',
            'Shortstop': 'top-[40%] left-[38%]',
            'Left-Field': 'top-[20%] left-[20%]',
            'Center-Field': 'top-[15%] left-[50%]',
            'Right-Field': 'top-[20%] left-[80%]'
        };

        return `${baseStyles} ${positions[position]}`;
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
            <div
                className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Game Details</h1>
                    </div>
                    <div className="flex space-x-4">
                        {/* Navigate to Edit Alignment */}
                        {(userType === "dt" || userType === "admin")  && (
                            <button
                                className="px-4 py-2 bg-primary dark:bg-primary-light rounded-lg text-text-light font-medium hover:bg-primary-light dark:hover:bg-primary transition-all duration-300 border border-primary-lighter/20 hover:scale-105"
                                onClick={() => {
                                    if (game) {
                                        const teamId = showingTeam1 ? game.team1.id : game.team2.id;
                                        navigate(`/editalignments/${gameId}/${teamId}/${seasonId}/${serieId}`);
                                    } else {
                                        console.error('Game is null');
                                    }
                                }}
                            >
                                Edit Alignments
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {!error && game && (
                <>
                    {/* Field and Batting Lineup */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Field Alignment Section */}
                        <div
                            className="flex-2 w-full lg:min-w-[500px] bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                            <div className="text-center">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-text-dark dark:text-text-light mb-2 sm:mb-0">
                                        {showingTeam1 ? game.team1.name : game.team2.name} Field Positions
                                    </h2>
                                    <button
                                        className="px-4 py-2 bg-primary dark:bg-primary-light rounded-lg text-text-light font-medium hover:bg-primary-light dark:hover:bg-primary transition-all duration-300 border border-primary-lighter/20 hover:scale-105"
                                        onClick={() => setShowingTeam1(!showingTeam1)}
                                    >
                                        Switch Teams
                                    </button>
                                </div>
                                <div className="relative aspect-video w-full group">
                                    <img
                                        src={baseballFieldImg}
                                        alt="Baseball Field"
                                        className="w-full h-full object-cover rounded-xl border border-primary/20 dark:border-primary-lighter/20 transition-all duration-300 group-hover:border-primary/40 dark:group-hover:border-primary-lighter/40"
                                    />
                                    {fieldAlignment.map((player) => (
                                        <div
                                            key={player.player.id}
                                            className={getPlayerPosition(player.position as Position)}
                                            onClick={() => navigateToPlayerDetails(player.player.id)}
                                        >
                                            {getPlayerIcon(player.position as Position)}
                                            <span className="hidden sm:inline">{player.player.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-4 mb-4 text-left">
                                    <div className="bg-secondary-lightest dark:bg-primary-light p-3 rounded-lg">
                                        <p className="text-sm font-medium text-text-dark dark:text-text-light opacity-70">Name</p>
                                        <p className="font-semibold text-primary dark:text-primary-lighter">
                                            {showingTeam1 ? game.team1.name : game.team2.name}
                                        </p>
                                    </div>
                                    <div className="bg-secondary-lightest dark:bg-primary-light p-3 rounded-lg">
                                        <p className="text-sm font-medium text-text-dark dark:text-text-light opacity-70">Color</p>
                                        <p className="font-semibold text-primary dark:text-primary-lighter">
                                            {showingTeam1 ? game.team1.color : game.team2.color}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Batting Lineup Section */}
                        <div
                            className="flex-1 w-full lg:min-w-[300px] bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                            <h3 className="text-xl sm:text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                                {showingTeam1 ? game.team2.name : game.team1.name} Batting Lineup
                            </h3>
                            <div className="space-y-3">
                                {battingAlignment.map((player, index) => (
                                    <div
                                        key={player.player.id}
                                        className="group flex items-center justify-between p-3 sm:p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40 cursor-pointer"
                                        onClick={() => navigateToPlayerDetails(player.player.id)}
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                            <div
                                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                            <span className="font-medium text-primary dark:text-primary-lighter text-xs sm:text-base">{index + 1}</span>
                                            </div>
                                            <span className="text-sm sm:text-base text-text-dark dark:text-text-light">{player.player.name}</span>
                                        </div>
                                        <GiBaseballBat className="text-xl sm:text-2xl text-primary dark:text-primary-lighter"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Substitutions Section */}
                    <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up border border-primary/20 dark:border-primary-lighter/20">
                        <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                            Substitutions
                        </h3>
                        <div className="space-y-6">
                            {[
                                {name: game.team1.name, subs: team1Substitutions},
                                {name: game.team2.name, subs: team2Substitutions}
                            ].map((team, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h4 className="text-lg font-semibold text-text-dark dark:text-text-light">{team.name}</h4>
                                    <div className="overflow-y-auto max-h-32 space-y-3">
                                        {team.subs.map((sub, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-center justify-between p-4 bg-secondary-lightest dark:bg-primary rounded-lg hover:shadow-xl border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <p
                                                        className="font-semibold text-text-dark dark:text-text-light cursor-pointer hover:text-primary"
                                                        onClick={() => navigateToPlayerDetails(sub.playerIn.player.id)}
                                                    >
                                                        {sub.playerIn.player.name}
                                                    </p>
                                                    <BiRightArrow className="text-primary dark:text-primary-lighter"/>
                                                    <p
                                                        className="font-semibold text-text-dark dark:text-text-light cursor-pointer hover:text-primary"
                                                        onClick={() => navigateToPlayerDetails(sub.playerOut.player.id)}
                                                    >
                                                        {sub.playerOut.player.name}
                                                    </p>
                                                </div>
                                                <div className="px-4 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full border border-primary/20 dark:border-primary-lighter/20">
                                                    <p className="text-sm text-primary dark:text-primary-lighter">
                                                        {sub.time.toString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GameDetailsPage;
