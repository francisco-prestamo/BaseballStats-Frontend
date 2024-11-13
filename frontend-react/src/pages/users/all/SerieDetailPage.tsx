import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGamesInSeries, fetchTeamsInSeries } from '../../../services/serieService';
import { Game, Team } from '../../../services/types';

const SerieDetailPage: React.FC = () => {
    const { seasonId, serieId } = useParams<{ seasonId: string; serieId: string }>();
    const [games, setGames] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSeriesDetails = async () => {
            console.log(seasonId,serieId)
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

    return (
        <div>
            <h2>Details for Series {serieId} in Season {seasonId}</h2>
            {error && <p>{error}</p>}
            <h3>Teams</h3>
            <ul>
                {teams.map((team) => (
                    <li key={team.id}>{team.name}</li>
                ))}
            </ul>
            <h3>Games</h3>
            <ul>
                {games.map((game) => (
                    <li key={`${game.id}`}>{game.team1.name}-{game.team2.name}-{game.date.toString()}-{game.team1Runs}-{game.team2Runs}</li>
                ))}
            </ul>
        </div>
    );
};

export default SerieDetailPage;