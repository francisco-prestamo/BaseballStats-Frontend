import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSeasons } from '../../../services/users/all/seasonService';
import { BiCalendar, BiRightArrow } from 'react-icons/bi';
import { GiBaseballBat } from 'react-icons/gi';
import {Season} from "../../../models/Season";

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
        <div className="container mx-auto p-6 space-y-10">
            {/* Error Display */}
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold animate-fade-in">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center animate-fade-in">
                    <div>
                        <h1 className="text-5xl font-bold">Baseball Seasons</h1>
                        <p className="text-lg md:text-xl mt-2 opacity-90">Select a season to view details</p>
                    </div>
                    <BiCalendar className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Seasons Section */}
            <div className="bg-bg-light dark:bg-primary-light rounded-2xl shadow-lg p-6 animate-slide-up">
                <h3 className="text-2xl font-semibold text-text-dark dark:text-text-light mb-4 pb-2 border-b border-primary-lighter">
                    Available Seasons
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {seasons.map((season) => (
                        <div
                            key={season.id}
                            onClick={() => handleSeasonClick(season.id)}
                            className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary-lighter/10 flex items-center justify-center border border-primary/20 dark:border-primary-lighter/20 animate-pop-in">
                                        <GiBaseballBat className="text-3xl text-primary dark:text-primary-lighter" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
                                            Season {season.id}
                                        </h3>
                                    </div>
                                </div>
                                <BiRightArrow className="text-primary dark:text-primary-lighter opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeasonsPage;