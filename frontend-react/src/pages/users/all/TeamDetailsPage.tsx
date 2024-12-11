// TeamDetails.tsx
import React, { useEffect, useState } from 'react';
import { fetchTeamInfo, fetchTeamGamesInThisSeries, fetchTeamStarPlayers } from '../../../services/users/all/TeamService'; // Asegúrate de importar las funciones
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";


interface TeamDetailsProps {
  teamId?: string;
  serieId?: string;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ teamId, serieId }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [starPlayers, setStarPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!teamId || !serieId) return;
    
    const fetchData = async () => {
      try {

        // Llamar a las API para obtener los datos
        const teamData = await fetchTeamInfo(teamId, serieId);
        const gamesData = await fetchTeamGamesInThisSeries(teamId, serieId);
        const starPlayersData = await fetchTeamStarPlayers(teamId, serieId);

        // Actualizar el estado con los datos obtenidos
        setTeam(teamData);
        setGames(gamesData);
        setStarPlayers(starPlayersData);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, serieId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!team) {
    return <p>No team data available.</p>;
  }

  return (
    <div className="team-details-container">
      <h1 className="team-name">{team.name}</h1>

      <section className="team-info">
        <h2>Team Information</h2>
        <p><strong>Team Name:</strong> {team.name}</p>
        <h3>Players:</h3>

        {/* Cuando se puedan leer jugadores */}
        {/* <ul>
          {team.players.map((player) => (
            <li key={player.id}>
              {player.name} - {player.role}
            </li>
          ))}
        </ul> */}
      </section>

      <section className="games">
        <h2>Games in Series</h2>
        {games.length > 0 ? (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                Game {game.id} - {game.team1.id} vs {game.team2.id}
                <br />
                Score: {game.team1Runs} - {game.team2Runs}
              </li>
            ))}
          </ul>
        ) : (
          <p>No games found for this series.</p>
        )}
      </section>

      <section className="star-players">
        <h2>Star Players</h2>

        {/* Cuando hayan jugadores con los roles */}
        <ul>
          {starPlayers.length > 0 ? (
            starPlayers.map((player) => (
              <li key={player.id}>
                {player.name} 
                {/* - {player.role} */}
              </li>
            ))
          ) : (
            <p>No star players in this series.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default TeamDetails;
