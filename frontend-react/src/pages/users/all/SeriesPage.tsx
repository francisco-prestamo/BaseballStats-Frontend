import{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiFilterAlt, BiRightArrow, BiSortAlt2 } from 'react-icons/bi';
import { GiBaseballBat } from 'react-icons/gi';
import { fetchAllSeries } from '../../../services/users/all/serieService';
import {Serie} from "../../../models/Serie";

const SeriesPage = () => {
    const [series, setSeries] = useState<Serie[]>([]);
    const [filteredSeries, setFilteredSeries] = useState<Serie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'name' | 'startDate'>('startDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const data = await fetchAllSeries();
                setSeries(data);
                setFilteredSeries(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch series. Please try again later.');
            }
        };
        fetchSeries();
    }, []);

    useEffect(() => {
        let result = [...series];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortField === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return sortOrder === 'asc'
                    ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            }
        });

        setFilteredSeries(result);
    }, [series, searchTerm, sortField, sortOrder]);

    const handleSeriesClick = (seasonId: string, seriesId: string) => {
        navigate(`/series/${seasonId}/${seriesId}`);
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            {error && (
                <div className="bg-red-500 text-text-light p-4 rounded-lg mb-6 text-center font-semibold animate-fade-in">
                    <p>{error}</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="flex justify-between items-center animate-fade-in">
                    <div>
                        <h1 className="text-5xl font-bold">All Series</h1>
                        <p className="text-lg md:text-xl mt-2 opacity-90">Browse all baseball series</p>
                    </div>
                    <GiBaseballBat className="text-6xl text-text-light opacity-80" />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-bg-light dark:bg-primary-light rounded-xl p-4 shadow-md animate-slide-up">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <BiFilterAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search series..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-primary/20 dark:border-primary-lighter/20 bg-white dark:bg-primary focus:ring-2 focus:ring-primary-light focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as 'name' | 'startDate')}
                            className="px-4 py-2 rounded-lg border border-primary/20 dark:border-primary-lighter/20 bg-white dark:bg-primary"
                        >
                            <option value="startDate">Date</option>
                            <option value="name">Name</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="p-2 rounded-lg border border-primary/20 dark:border-primary-lighter/20 bg-white dark:bg-primary hover:bg-primary/10"
                        >
                            <BiSortAlt2 className={`text-xl transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Series Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map((series) => (
                    <div
                        key={series.id}
                        onClick={() => handleSeriesClick(series.idSeason, series.id)}
                        className="group bg-secondary-lightest dark:bg-primary rounded-lg p-5 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40 cursor-pointer"
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
                                        Season {series.idSeason}
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
                    {new Date(series.startDate).toLocaleDateString()} - {new Date(series.endDate).toLocaleDateString()}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeriesPage;