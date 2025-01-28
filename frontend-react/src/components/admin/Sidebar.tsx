import React from "react";
import { FaInfoCircle, FaUsers, FaBaseballBall, FaUserAlt, FaListAlt, FaHandshake, FaArrowRight, FaUserTie } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { BiCalendar } from "react-icons/bi";
import { MdEdit } from "react-icons/md"; // More fitting icons

interface SidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    const icons = [
        FaInfoCircle,       // Info Section
        FaUsers,            // Manage Users
        BiCalendar,         // Manage Seasons
        FaBaseballBall,     // Manage Teams
        FaUserAlt,          // Manage Players
        FaListAlt,          // Manage Series
        FaHandshake,        // Manage Player in Serie
        MdEdit,             // Manage Games
        GiPositionMarker,   // Manage Player in Position
        FaArrowRight,       // Manage Direction Members
        FaUserTie,          // Manage Directs
        FaBaseballBall      // Manage Pitchers
    ];

    const sectionNames = [
        "",
        "Usr",
        "Ssn",
        "Team",
        " Plr",
        " Srs",
        " PiS",
        "Gms",
        "PiP",
        "DM",
        "DMiT",
        "Ptch"
    ];

    return (
        <aside
            className="fixed bottom-0 left-0 w-full md:top-1/2 md:left-5 md:w-auto md:transform md:-translate-y-1/2 z-50"
        >
            <div
                className="max-h-[80vh] md:max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/50
                           scrollbar-track-secondary/20 dark:scrollbar-thumb-primary/50 dark:scrollbar-track-primary/20"
            >
                <nav
                    className="flex md:flex-col justify-around md:justify-start bg-bg-light/70 dark:bg-bg-dark/70
                               backdrop-blur-md rounded-t-xl md:rounded-xl border border-secondary/30
                               dark:border-primary/30 shadow-lg p-2 md:p-4"
                >
                    {icons.map((Icon, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSection(index + 1)}
                            className={`flex my-2 items-center justify-center p-3 rounded-lg transition-all duration-300
                                ${activeSection === index + 1
                                ? "bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light shadow-md scale-110"
                                : "bg-secondary/30 dark:bg-primary/30 hover:bg-secondary/50 dark:hover:bg-primary/50"}
                            `}
                            aria-label={sectionNames[index]}
                        >
                            <Icon
                                className={`text-xl 
                                    ${activeSection === index + 1
                                    ? "text-primary dark:text-text-light"
                                    : "text-text-dark/70 dark:text-text-light/70"}
                                `}
                            />
                            <span className="ml-3 text-lg font-medium text-text-dark dark:text-text-light">
                                {sectionNames[index]}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;