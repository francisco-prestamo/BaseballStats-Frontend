import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchGameDetails,
    fetchTeamAlignments,
    fetchPlayerSubstitutions
} from '../../../services/gameService';
import { GiBaseballGlove, GiBaseballBat } from 'react-icons/gi';
import { PiBaseballCap } from 'react-icons/pi';
import { Game, PlayerInPosition, Change } from '../../../services/types';
import baseballFieldImg from '../../../images/baseball-field.png';
import {BiRightArrow} from "react-icons/bi";

type Position = 'Pitcher' | 'Catcher' | 'First-Base' | 'Second-Base' | 'Third-Base' |
    'Shortstop' | 'Left-Field' | 'Center-Field' | 'Right-Field';

const GameDetailsPage = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [team1Alignment, setTeam1Alignment] = useState<PlayerInPosition[]>([]);
    const [team2Alignment, setTeam2Alignment] = useState<PlayerInPosition[]>([]);
    const [team1Substitutions, setTeam1Substitutions] = useState<Change[]>([]);
    const [team2Substitutions, setTeam2Substitutions] = useState<Change[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showingTeam1, setShowingTeam1] = useState<boolean>(true);

    useEffect(() => {
        const getGameDetails = async () => {
            try {
                if (gameId) {
                    const gameData = await fetchGameDetails(gameId);
                    const alignments = await fetchTeamAlignments(gameId);
                    const substitutions = await fetchPlayerSubstitutions(gameId);

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

    const fieldAlignment = showingTeam1 ? team1Alignment : team2Alignment;
    const battingAlignment = showingTeam1 ? team2Alignment : team1Alignment;

    const getPlayerIcon = (position: Position) => {
        if (position === 'Pitcher') {
            return <PiBaseballCap className="text-xl text-primary dark:text-primary-lighter" />;
        }
        return <GiBaseballGlove className="text-xl text-primary dark:text-primary-lighter" />;
    };

    const getPlayerPosition = (position: Position) => {
        const baseStyles = "absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-bg-light dark:bg-primary-light backdrop-blur rounded-lg border-2 border-primary/30 dark:border-primary-lighter/30 text-sm font-medium transition-all duration-200 whitespace-nowrap z-10 hover:scale-105 hover:shadow-md hover:bg-secondary-lightest dark:hover:bg-primary hover:border-primary dark:hover:border-primary-lighter flex items-center gap-2";

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
        <div className="container mx-auto p-4 space-y-4">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold border-2 border-red-600">
                    <p>{error}</p>
                </div>
            )}

            {/* If error is present, skip rendering the rest */}
            {!error && (
                <>
                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg border border-primary-lighter/20">
                        <div className="flex justify-between items-center text-text-light">
                            <h1 className="text-4xl font-bold">Game Details</h1>
                            {game && (
                                <div className="text-right">
                                    <p className="text-2xl">{game.team1.name} vs {game.team2.name}</p>
                                    <p className="text-xl mt-2">Score: {game.team1Runs} - {game.team2Runs}</p>
                                    <p className="text-lg mt-1">Winner: {game.winTeam ? game.team1.name : game.team2.name}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Field and Batting Lineup */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Field Alignment Section */}
                        <div className="flex-1 min-w-[500px] bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/10 dark:border-primary-lighter/10">
                            <div className="text-center">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-text-dark dark:text-text-light">
                                        {showingTeam1 ? game?.team1.name : game?.team2.name} Field Positions
                                    </h2>
                                    <button
                                        className="px-4 py-2 bg-primary dark:bg-primary-light rounded-lg text-text-light font-medium hover:bg-primary-light dark:hover:bg-primary transition-colors border border-primary-lighter/20"
                                        onClick={() => setShowingTeam1(!showingTeam1)}
                                    >
                                        Switch Teams
                                    </button>
                                </div>
                                <div className="relative aspect-video w-full">
                                    <img
                                        src={baseballFieldImg}
                                        alt="Baseball Field"
                                        className="w-full h-full object-cover rounded-xl border border-primary/20 dark:border-primary-lighter/20"
                                    />
                                    {fieldAlignment.map((player) => (
                                        <div
                                            key={player.player.id}
                                            className={getPlayerPosition(player.position as Position)}
                                        >
                                            {getPlayerIcon(player.position as Position)}
                                            {player.player.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Batting Lineup Section */}
                        <div className="flex-2 min-w-[300px] bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/10 dark:border-primary-lighter/10">
                            <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b-2 border-primary-lighter/30">
                                {showingTeam1 ? game?.team2.name : game?.team1.name} Batting Lineup
                            </h3>
                            <div className="space-y-2">
                                {battingAlignment.map((player, index) => (
                                    <div
                                        key={player.player.id}
                                        className="flex items-center justify-between p-2 bg-secondary-lightest dark:bg-primary rounded-lg hover:bg-secondary-light dark:hover:bg-primary-light transition-colors border border-primary/10 dark:border-primary-lighter/10"
                                    >
                                        <span className="font-medium text-text-dark dark:text-text-light">{index + 1}.</span>
                                        <span className="text-text-dark dark:text-text-light">{player.player.name}</span>
                                        <GiBaseballBat className="text-xl text-primary dark:text-primary-lighter" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Substitutions Section */}
                    <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 border border-primary/10 dark:border-primary-lighter/10">
                        <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b-2 border-primary-lighter/30">
                            Substitutions
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: game?.team1.name, subs: team1Substitutions },
                                { name: game?.team2.name, subs: team2Substitutions }
                            ].map((team, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="font-medium text-text-dark dark:text-text-light">{team.name}</h4>
                                    <div className="overflow-y-auto max-h-32">
                                        {team.subs.map((sub, index) => (
                                            <div key={index}
                                                 className="flex items-center justify-between p-3 bg-secondary-lightest dark:bg-primary rounded-lg hover:bg-secondary-light dark:hover:bg-primary-light transition-all duration-200 group border border-primary/10 dark:border-primary-lighter/10">
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-semibold text-text-dark dark:text-text-light">In: {sub.playerIn.player.name}</p>
                                                    <p className="font-semibold text-text-dark dark:text-text-light"><BiRightArrow/></p>
                                                    <p className="font-semibold text-text-dark dark:text-text-light">Out: {sub.playerOut.player.name}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="px-3 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full border border-primary/20 dark:border-primary-lighter/20">
                                                        <p className="text-sm text-primary dark:text-primary-lighter">
                                                            {sub.time.toString()}
                                                        </p>
                                                    </div>
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