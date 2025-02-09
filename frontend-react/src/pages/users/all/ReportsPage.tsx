import React, { useState, useEffect } from "react";
import { API_URL } from "../../../services/config/config";
import adminSeasonService from  "../../../services/users/admin/adminSeasonService";
import adminSerieService from "../../../services/users/admin/adminSerieService";
import adminPlayerService from "../../../services/users/admin/adminPlayerService";
import adminTeamService from "../../../services/users/admin/adminTeamService";
import { Season } from "../../../models/Season";
import { Serie } from "../../../models/crud/Series";
import { Player } from "../../../models/crud/Player";
import { Team } from "../../../models/crud/Team";

const reports = [
    { 
        id: 1, 
        label: "Win Team by Series", 
        url: (params: string[] = []) => `/reports/win-teams-by-series/${params[0] || "default"}`,
        requiredSelects: ["season"]
    },
    { 
        id: 2, 
        label: "Series with Most and Least Games", 
        url: () => "/reports/series/with-most-and-least-games",
        requiredSelects: []
    },
    { 
        id: 3, 
        label: "Winning and Losing Teams by Series", 
        url: () => "/reports/winning-and-losing-teams-by-series",
        requiredSelects: []
    },
    { 
        id: 4, 
        label: "Player Stats", 
        url: (params: string[] = []) => `/reports/player-stats/${params[0] || "default"}`,
        requiredSelects: ["player"]
    },
    { 
        id: 5, 
        label: "Pitchers Stats", 
        url: () => "/reports/pitchers-stats",
        requiredSelects: []
    },
    { 
        id: 6, 
        label: "Star Players by Team and Series", 
        url: (params: string[] = []) => `/reports/teams/${params[0] || "default"}/serie/${params[1] || "default"}/${params[2] || "default"}/star-players`,
        requiredSelects: ["team", "season", "serie"]
    }
];

const ReportsPage = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [series, setSeries] = useState<Serie[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [currentReport, setCurrentReport] = useState<typeof reports[0] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [seasonsData, seriesData, playersData, teamsData] = await Promise.all([
                    adminSeasonService.getSeasons(),
                    adminSerieService.getSeries(),
                    adminPlayerService.getPlayers(),
                    adminTeamService.getTeams()
                ]);
                
                setSeasons(seasonsData);
                setSeries(seriesData);
                setPlayers(playersData);
                setTeams(teamsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleSelectChange = (type: string, value: string) => {
        setSelectedValues(prev => ({
            ...prev,
            [type]: value
        }));

        if (type === "season") {
            const filteredSeries = series.filter(serie => serie.idSeason === parseInt(value));
            setSeries(filteredSeries);
        }
    };

    const getSelectComponent = (type: string) => {
        let options: { value: string, label: string }[] = [];
        
        switch (type) {
            case "season":
                options = seasons.map(season => ({
                    value: season.id.toString(),
                    label: `Season ${season.id}`
                }));
                break;
            case "serie":
                options = series.map(serie => ({
                    value: serie.id.toString(),
                    label: `Serie ${serie.id}`
                }));
                break;
            case "player":
                options = players.map(player => ({
                    value: player.id.toString(),
                    label: player.name
                }));
                break;
            case "team":
                options = teams.map(team => ({
                    value: team.id.toString(),
                    label: team.name
                }));
                break;
        }

        return (
            <select
                value={selectedValues[type] || ""}
                onChange={(e) => handleSelectChange(type, e.target.value)}
                className="border p-2 rounded w-full mb-2"
            >
                <option value="">Select {type}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    };

    const handlePreview = async (report: typeof reports[0]) => {
        setLoading(true);
        setCurrentReport(report);
        
        try {
            const params = report.requiredSelects.map(type => selectedValues[type] || "default");
            const fullUrl = API_URL + report.url(params);
            const token = localStorage.getItem("authToken");
            
            const response = await fetch(fullUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
                    "Authorization": token ? `${token}` : ""
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch document");
            }

            const blob = await response.blob();
            const fileUrl = URL.createObjectURL(blob);
            setPdfUrl(fileUrl);
            setModalOpen(true);
        } catch (error) {
            console.error("Error fetching PDF:", error);
            alert("An error occurred while fetching the PDF.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (pdfUrl && currentReport) {
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = `${currentReport.id}-report.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setModalOpen(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
                        Baseball Reports
                    </h1>
                    <p className="text-lg md:text-xl animate-slide-up">
                        Download detailed baseball reports below.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h3 className="text-xl font-semibold mb-4">{report.label}</h3>
                        
                        {report.requiredSelects.map((type) => (
                            <div key={type}>
                                {getSelectComponent(type)}
                            </div>
                        ))}

                        <button
                            onClick={() => handlePreview(report)}
                            disabled={report.requiredSelects.some(type => !selectedValues[type]) || loading}
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                'Preview Report'
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{currentReport?.label} Preview</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 min-h-0 mb-4">
                            {pdfUrl && (
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full rounded-md border"
                                    title="PDF Preview"
                                />
                            )}
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;