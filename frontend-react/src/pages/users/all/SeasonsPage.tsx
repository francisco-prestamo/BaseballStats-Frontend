import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSeasons } from '../../../services/seasonService';
import { Season } from '../../../services/types';

const SeasonsPage: React.FC = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSeasons = async () => {
            try {
                const data = await fetchSeasons();
                setSeasons(data);
            } catch (error) {
                console.error(error);
            }
        };
        loadSeasons();
    }, []);

    const handleSeasonClick = (seasonId: string) => {
        navigate(`/seasons/${seasonId}`);
    };

    return (
        <div>
            <h1>Seasons</h1>
            <ul>
                {seasons.map((season) => (
                    <li key={season.id} onClick={() => handleSeasonClick(season.id)}>
                        {season.id}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeasonsPage;