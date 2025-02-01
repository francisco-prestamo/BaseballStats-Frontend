import { useState } from "react";
import { GiBaseballBat, GiBaseballGlove } from "react-icons/gi";

const reports = [
    { id: 1, label: "Game Stats", url: (param: string) => `/reports/win-teams-by-series/${param}`, placeholder: "Enter Season ID" },
    { id: 2, label: "Player Performance", url: (param: string) => `/reports/player-performance/${param}`, placeholder: "Enter Player ID" },
    { id: 3, label: "Team Rankings", url: (param: string) => `/reports/team-rankings/${param}`, placeholder: "Enter League ID" },
    { id: 4, label: "Season Highlights", url: (param: string) => `/reports/season-highlights/${param}`, placeholder: "Enter Season Year" },
    { id: 5, label: "Injury Reports", url: (param: string) => `/reports/injury-reports/${param}`, placeholder: "Enter Team ID" },
    { id: 6, label: "Training Schedules", url: (param: string) => `/reports/training-schedules/${param}`, placeholder: "Enter Coach ID" },
    { id: 7, label: "Financial Overview", url: (param: string) => `/reports/financial-overview/${param}`, placeholder: "Enter Fiscal Year" },
];

const ReportsPage = () => {
    const [inputs, setInputs] = useState<{ [key: number]: string }>({});

    const handleChange = (id: number, value: string) => {
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleDownload = async (id: number, urlFunction: (param: string) => string) => {
        const param = inputs[id] || "default";
        const fullUrl = urlFunction(param);

        try {
            const response = await fetch(fullUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/pdf",
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
            console.error("Error downloading the PDF:", error);
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
                        <input
                            type="text"
                            placeholder={report.placeholder}
                            value={inputs[report.id] || ""}
                            onChange={(e) => handleChange(report.id, e.target.value)}
                            className="border p-2 rounded w-full"
                        />
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
