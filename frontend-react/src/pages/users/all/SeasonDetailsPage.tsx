import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSeriesBySeason } from '../../../services/seasonService';
import { Series } from '../../../services/types';
import { BiTrophy, BiRightArrow } from 'react-icons/bi';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/common/Card';

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
        <div className="container mx-auto p-4 space-y-4">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center text-text-light">
                    <div>
                        <h1 className="text-4xl font-bold">Season Details</h1>
                        <p className="text-xl mt-2 opacity-90">Season {seasonId}</p>
                    </div>
                    <BiTrophy className="text-5xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Series Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seriesList.map((series) => (
                    <Card
                        key={series.id}
                        className="bg-bg-light dark:bg-primary-light hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => handleSerieClick(series.id)}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-xl font-semibold text-text-dark dark:text-text-light">
                                    {series.name}
                                </span>
                                <BiRightArrow className="text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        {series.startDate.toString()} - {series.endDate.toString()}
                                    </span>

                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-primary-lighter/20">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-text-dark dark:text-text-light">
                                            {series.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SeasonDetailPage;