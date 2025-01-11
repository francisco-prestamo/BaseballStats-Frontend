import React, { useState } from "react";
import Sidebar from "../../../components/admin/Sidebar.tsx";
import ManageUsers from "../../../components/admin/ManageUsers.tsx";
import ManageSeasons from "../../../components/admin/ManageSeasons.tsx";
import ManageTeams from "../../../components/admin/ManageTeams.tsx";
import ManagePlayers from "../../../components/admin/ManagePlayer.tsx"; // Importar ManagePlayers

const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState(1);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content */}
            <main className="flex-1 p-4 mx-auto">
                {activeSection === 1 && <h1 className="text-2xl font-bold">Info Section</h1>}
                {activeSection === 2 && <ManageUsers />}
                {activeSection === 3 && <ManageSeasons />}
                {activeSection === 4 && <ManageTeams />}
                {activeSection === 5 && <ManagePlayers />} {/* Añadir ManagePlayers */}
            </main>
        </div>
    );
};

export default AdminPage;
