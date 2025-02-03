import { useState } from "react";

const reports = [
    { id: 1, label: "Win Team by Series", url: (params: string[] = []) => `/reports/win-teams-by-series/${params[0] || "default"}`, placeholders: ["Enter Season ID"] },
    { id: 2, label: "Series with Most and Least Games", url: () => "/reports/series/with-most-and-least-games", placeholders: [] },
    { id: 3, label: "Winning and Losing Teams by Series", url: () => "/reports/winning-and-losing-teams-by-series", placeholders: [] },
    { id: 4, label: "Player Stats", url: (params: string[] = []) => `/reports/player-stats/${params[0] || "default"}`, placeholders: ["Enter Player ID"] },
    { id: 5, label: "Pitchers Stats", url: () => "/reports/pitchers-stats", placeholders: [] },
    { id: 6, label: "Star Players by Team and Series", url: (params: string[] = []) => `/reports/teams/${params[0] || "default"}/serie/${params[1] || "default"}/${params[2] || "default"}/star-players`, placeholders: ["Enter Team ID", "Enter Season ID", "Enter Serie ID"] }
];

const ReportsPage = () => {
    const [inputs, setInputs] = useState<{ [key: number]: string[] }>({});

    const handleChange = (id: number, index: number, value: string) => {
        setInputs(prev => ({
            ...prev,
            [id]: { ...prev[id], [index]: value }
        }));
    };

    const handleDownload = async (id: number, urlFunction: (params?: string[]) => string) => {
        const params = inputs[id] || [];
        const fullUrl = urlFunction(params);

        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(fullUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
                    "Authorization": token ? `${token}` : ""

                },
            });

            if (!response.ok) {
                throw new Error("Failed to download document");
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = `${id}-report.pdf`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error("An unknown error occurred while downloading the PDF.");
            alert("An unknown error occurred while downloading the PDF.")

        }
    };

    return (
        <div className="container mx-auto p-6 space-y-10">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
                        Baseball Reports
                    </h1>
                    <p className="text-lg md:text-xl animate-slide-up">Download detailed baseball reports below.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
                {reports.map((report) => (
                    <div key={report.id} className="space-y-2">
                        {report.placeholders.map((placeholder, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={placeholder}
                                value={inputs[report.id]?.[index] || ""}
                                onChange={(e) => handleChange(report.id, index, e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        ))}

                        <button
                            onClick={() => handleDownload(report.id, report.url)}
                            className="bg-primary text-white py-2 px-4 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300 w-full"
                        >
                            {report.label}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;
