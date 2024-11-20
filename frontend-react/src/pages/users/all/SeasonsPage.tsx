import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSeasons } from '../../../services/seasonService';
import { Season } from '../../../services/types';
import { BiCalendar, BiRightArrow } from 'react-icons/bi';
import { Card, CardContent } from '../../../components/common/Card';

const SeasonsPage: React.FC = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSeasons = async () => {
            try {
                const data = await fetchSeasons();
                setSeasons(data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch seasons. Please try again later.');
            }
        };
        loadSeasons();
    }, []);

    const handleSeasonClick = (seasonId: string) => {
        navigate(`/seasons/${seasonId}`);
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
                        <h1 className="text-4xl font-bold">Baseball Seasons</h1>
                        <p className="text-xl mt-2 opacity-90">Select a season to view details</p>
                    </div>
                    <BiCalendar className="text-5xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Seasons Grid */}
            <div className="flex items-center justify-center">
                <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {seasons.map((season) => (
                            <Card
                                key={season.id}
                                className="bg-secondary-lightest dark:bg-primary hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                onClick={() => handleSeasonClick(season.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center">
                                                <span className="text-xl font-bold text-primary dark:text-primary-lighter">
                                                    {season.id}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
                                                    Season {season.id}
                                                </h3>
                                            </div>
                                        </div>
                                        <BiRightArrow className="text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="mt-3 text-sm text-text-dark/70 dark:text-text-light/70 border-t border-primary-lighter/20 pt-3">
                                        Total Series:
                                    </p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="px-3 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full">
                                            <span className="text-sm text-primary dark:text-primary-lighter">
                                                0 Series
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeasonsPage;