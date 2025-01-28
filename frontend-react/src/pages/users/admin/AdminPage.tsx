import React, { useState } from "react";
import Sidebar from "../../../components/admin/Sidebar.tsx";
import ManageUsers from "../../../components/admin/ManageUsers.tsx";
import ManageSeasons from "../../../components/admin/ManageSeasons.tsx";
import ManageTeams from "../../../components/admin/ManageTeams.tsx";
import ManagePlayers from "../../../components/admin/ManagePlayer.tsx"; // Importar ManagePlayers
import ManageSeries from "../../../components/admin/ManageSeries.tsx";
import ManageGames from "../../../components/admin/ManageGames.tsx";
import ManagePlayerInSerie from "../../../components/admin/ManagePlayerInSerie.tsx";
import ManagePlayerInPosition from "../../../components/admin/ManagePlayerInPosition.tsx";
import ManageDirectionMembers from "../../../components/admin/ManageDirectionMember.tsx";
import ManageDirects from "../../../components/admin/ManageTeamDirectionMember.tsx";
import ManagePitchers from "../../../components/admin/ManagePitchers.tsx";

const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState(1);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content */}
            <main className="flex-1 p-4 mx-auto ml-16">
                {activeSection === 1 && <h1 className="text-2xl font-bold">Info Section</h1>}
                {activeSection === 2 && <ManageUsers />}
                {activeSection === 3 && <ManageSeasons />}
                {activeSection === 4 && <ManageTeams />}
                {activeSection === 5 && <ManagePlayers />}
                {activeSection === 6 && <ManageSeries />}
                {activeSection === 7 && <ManagePlayerInSerie />}
                {activeSection === 8 && <ManageGames />}
                {activeSection === 9 && <ManagePlayerInPosition />}
                {activeSection === 10 && <ManageDirectionMembers />}
                {activeSection === 11 && <ManageDirects />}
                {activeSection === 12 && <ManagePitchers />}

            </main>
        </div>
    );
};

export default AdminPage;
