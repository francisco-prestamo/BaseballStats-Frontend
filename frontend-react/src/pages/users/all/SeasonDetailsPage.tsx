import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSeriesBySeason } from '../../../services/users/all/seasonService';
import { BiTrophy, BiRightArrow } from 'react-icons/bi';
import { GiBaseballBat } from 'react-icons/gi';
import {Serie} from "../../../models/Serie";

const SeasonDetailPage: React.FC = () => {
    const { seasonId } = useParams<{ seasonId: string }>();
    const [seriesList, setSeriesList] = useState<Serie[]>([]);
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

    const handleSerieClick = (serieId: number) => {
        if (seasonId) {
            navigate(`/series/${seasonId}/${serieId}`);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold animate-fade-in">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-5xl font-bold">Season Details</h1>
                        <p className="text-lg md:text-xl mt-2 opacity-90">Season {seasonId}</p>
                    </div>
                    <BiTrophy className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Series Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Available Series
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seriesList.map((series) => (
                        <div
                            key={series.id}
                            onClick={() => handleSerieClick(series.id)}
                            className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                        <GiBaseballBat className="text-3xl text-primary dark:text-primary-lighter" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
                                            {series.name}
                                        </h3>
                                        <p className="text-sm text-text-dark/70 dark:text-text-light/70">
                                            Series #{series.id}
                                        </p>
                                    </div>
                                </div>
                                <BiRightArrow className="text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                            <div className="mt-4 pt-3 border-t border-primary-lighter/20 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-dark/70 dark:text-text-light/70">
                                        Duration
                                    </span>
                                    <div className="px-3 py-1 bg-primary/10 dark:bg-primary-lighter/10 rounded-full border border-primary/20 dark:border-primary-lighter/20">
                                        <span className="text-sm text-primary dark:text-primary-lighter">
                                            {series.startDate.toString()} - {series.endDate.toString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeasonDetailPage;