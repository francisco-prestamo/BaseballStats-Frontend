import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSeriesBySeason } from '../../../services/seasonService';
import { Series } from '../../../services/types';

const SeasonDetailPage: React.FC = () => {
    const { seasonId } = useParams<{ seasonId: string }>();
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getSeries = async () => {
            try {
                if (seasonId) {
                    const seriesData = await fetchSeriesBySeason(seasonId);
                    setSeriesList(seriesData);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch series for this season.');
            }
        };
        getSeries();
    }, [seasonId]);

    const handleSerieClick = (serieId: string) => {
        if (seasonId) {
            navigate(`/series/${seasonId}/${serieId}`);
        }
    };

    return (
        <div>
            <h2>Series for Season {seasonId}</h2>
            {error && <p>{error}</p>}
            <ul>
                {seriesList.map((series) => (
                    <li key={series.id} onClick={() => handleSerieClick(series.id)}>
                        {series.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeasonDetailPage;