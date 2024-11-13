import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, fetchTeamAlignments, fetchPlayerSubstitutions } from '../../../services/gameService';
import { Game, PlayerInPosition } from '../../../services/types';

const GameDetailsPage: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<Game | null>(null);
    const [team1Alignment, setTeam1Alignment] = useState<PlayerInPosition[]>([]);
    const [team2Alignment, setTeam2Alignment] = useState<PlayerInPosition[]>([]);
    const [team1Substitutions, setTeam1Substitutions] = useState<PlayerInPosition[]>([]);
    const [team2Substitutions, setTeam2Substitutions] = useState<PlayerInPosition[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                setError('Failed to fetch game details');
            }
        };
        getGameDetails();
    }, [gameId]);

    return (
        <div>
            <h2>Game Details</h2>
            {error && <p>{error}</p>}
            {game && (
                <>
                    <h3>Teams</h3>
                    <p>
                        <strong>{game.team1.name}</strong> vs <strong>{game.team2.name}</strong>
                    </p>
                    <p>
                        Winner: {game.winTeam ? game.team1.name : game.team2.name}
                    </p>
                    <p>
                        Score: {game.team1Runs} - {game.team2Runs}
                    </p>

                    <h3>Team Alignments</h3>
                    <p><strong>{game.team1.name} Alignment:</strong></p>
                    <ul>
                        {team1Alignment.map((player) => (
                            <li key={player.idPlayer}>{player.name} - {player.position}</li>
                        ))}
                    </ul>
                    <p><strong>{game.team2.name} Alignment:</strong></p>
                    <ul>
                        {team2Alignment.map((player) => (
                            <li key={player.idPlayer}>{player.name} - {player.position}</li>
                        ))}
                    </ul>

                    <h3>Player Substitutions</h3>
                    <p><strong>{game.team1.name} Substitutions:</strong></p>
                    <ul>
                        {team1Substitutions.map((sub, index) => (
                            <li key={index}>{sub.name} - {sub.position}</li>
                        ))}
                    </ul>
                    <p><strong>{game.team2.name} Substitutions:</strong></p>
                    <ul>
                        {team2Substitutions.map((sub, index) => (
                            <li key={index}>{sub.name} - {sub.position}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default GameDetailsPage;