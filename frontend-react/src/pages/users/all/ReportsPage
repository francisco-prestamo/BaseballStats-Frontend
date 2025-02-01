import React, { useState } from "react";
import { GiBaseballBat, GiBaseballGlove } from "react-icons/gi";
import { PiBaseballCap } from "react-icons/pi";

const reports = [
    { id: 1, label: "Game Stats", url: (param) => `/reports/win-teams-by-series/${param}`, placeholder: "Enter Season ID" },
    { id: 2, label: "Player Performance", url: (param) => `/reports/a/${param}`, placeholder: "a" },
    { id: 3, label: "Team Rankings", url: (param) => `/reports/b/${param}`, placeholder: "a" },
    { id: 4, label: "Season Highlights", url: (param) => `/reports/c/${param}`, placeholder: "a" },
    { id: 5, label: "Injury Reports", url: (param) => `/reports/d/${param}`, placeholder: "a" },
    { id: 6, label: "Training Schedules", url: (param) => `/reports/e/${param}`, placeholder: "a" },
    { id: 7, label: "Financial Overview", url: (param) => `/reports/f/${param}`, placeholder: "a" },
];

const ReportsPage = () => {
    const [inputs, setInputs] = useState({});

    const handleChange = (id, value) => {
        setInputs({ ...inputs, [id]: value });
    };

    const handleDownload = async (id, urlFunction) => {
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
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
                        Baseball Reports
                    </h1>
                    <p className="text-lg md:text-xl animate-slide-up">Download detailed baseball reports below.</p>
                </div>
            </div>

            {/* Buttons & Input Section */}
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
