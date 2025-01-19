// TeamDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamInfo, fetchTeamGamesInThisSeries, fetchTeamStarPlayers, fetchTeamPlayersInASerie } from '../../../services/users/all/TeamService'; // Asegúrate de importar las funciones
import { Game } from "../../../models/Game";
import { Player } from "../../../models/Player";
import { Team } from "../../../models/Team";
import { FaStar } from 'react-icons/fa';
import { PlayerInPosition } from '../../../models/PlayerInPosition';

const TeamDetails = () => {
  const { teamId, seriesId, seasonId } = useParams<{ teamId: string; seriesId: string, seasonId: string }>();

  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [starPlayers, setStarPlayers] = useState<PlayerInPosition[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // const arrayStarPlayers = [];

  useEffect(() => {
    if (!teamId || !seriesId || !seasonId) return;

    const fetchData = async () => {
      try {

        // Llamar a las API para obtener los datos
        const teamData = await fetchTeamInfo(seasonId, seriesId, teamId);
        const gamesData = await fetchTeamGamesInThisSeries(seasonId, seriesId, teamId);
        const starPlayersData = await fetchTeamStarPlayers(seasonId, seriesId, teamId);
        const teamsPlayersInASeasonData = await fetchTeamPlayersInASerie(seasonId, seriesId, teamId);

        // Actualizar el estado con los datos obtenidos
        setTeam(teamData);
        setGames(gamesData);
        setStarPlayers(starPlayersData);
        setPlayers(teamsPlayersInASeasonData);

      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seasonId, seriesId, teamId]);

  const handleGameClick = (gameId: number) => {
    navigate(`/games/${gameId}/${seasonId}/${seriesId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!team) {
    return <p>No team data available.</p>;
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
        <h1 className="text-5xl font-bold">{team.name}</h1>
        <p className="text-lg md:text-xl mt-2 opacity-90">Series Info</p>
      </div>

      {/* Players Section */}
      <div className="bg-secondary-lightest dark:bg-primary rounded-xl p-6 shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4 text-dark dark:text-text-light">Team Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players && players.length > 0 ? (
            players.map((player) => (
              <div
                key={player.id}
                className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center border border-blue-500 animate-pop-in">
                    <span className="text-lg font-bold text-white">
                      {player.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-text-light">
                      {player.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-dark dark:text-text-light">No players available.</p>
          )}
        </div>
      </div>

      {/* Star Players Section */}
      <div className="bg-secondary-lightest dark:bg-primary rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-dark dark:text-text-light">Star Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {starPlayers ?
            starPlayers.map(({ player, position }) => (
              <div
                key={player.id}
                className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
              >
                <div className="flex items-center space-x-4">
                  <FaStar className="inline-block text-yellow-500 ml-2" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-text-light">
                      {player.name}
                    </h3>
                    <h6 className="text-lg font-semibold text-dark dark:text-text-light">
                      {position}
                    </h6>
                  </div>
                </div>
              </div>
            )
            ) : (<p className="text-dark dark:text-text-light">No players available.</p>)
          }
        </div>
      </div>

      {/* Games Section */}
      <div className="bg-secondary-lightest dark:bg-primary rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-dark dark:text-text-light">Games in Series</h2>
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className="flex justify-between items-center bg-secondary-lightest dark:bg-primary-light rounded-lg p-4 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20"
            >
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-text-light">
                  { }
                </h3>
                <p className="text-sm text-dark/70 dark:text-text-light/70">
                  Date: {new Date(game.date).toISOString().split('T')[0]}
                </p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${game.team1.name === team.name && game.winTeam
                  ? "bg-green-500 text-white"
                  : game.team2.name === team.name && !game.winTeam
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  }`}
              >
                {game.team1Runs} {"-"} {game.team2Runs}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>);
};

export default TeamDetails;
