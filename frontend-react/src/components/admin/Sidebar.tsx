import React from "react";
import { FaInfoCircle, FaUsers } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";

interface SidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    const icons = [FaInfoCircle, FaUsers, BiCalendar];

    return (
        <aside
            className="fixed bottom-0 left-0 w-full md:top-1/2 md:left-5 md:w-auto md:transform md:-translate-y-1/3 z-50"
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
                        className={`
                            flex  my-2 items-center justify-center p-3 rounded-lg transition-all duration-300
                            ${activeSection === index + 1
                            ? "bg-secondary/80 hover:bg-secondary-light dark:bg-primary/80 dark:hover:bg-primary-light shadow-md scale-110"
                            : "bg-secondary/30 dark:bg-primary/30 hover:bg-secondary/50 dark:hover:bg-primary/50"}
                        `}
                        aria-label={`Section ${index + 1}`}
                    >
                        <Icon
                            className={`
                                text-xl 
                                ${activeSection === index + 1
                                ? "text-primary dark:text-text-light"
                                : "text-text-dark/70 dark:text-text-light/70"}
                            `}
                        />
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;