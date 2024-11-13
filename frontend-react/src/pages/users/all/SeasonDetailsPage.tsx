// src/pages/users/all/SeasonDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSeriesBySeason } from '../../../services/seasonService';
import { Series } from '../../../services/types';

const SeasonDetailPage: React.FC = () => {
    const { seasonId } = useParams<{ seasonId: string }>();
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div>
            <h2>Series for Season {seasonId}</h2>
            {error && <p>{error}</p>}
            <ul>
                {seriesList.map((series) => (
                    <li key={series.id}>{series.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SeasonDetailPage;