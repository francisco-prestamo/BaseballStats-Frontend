import React, { useState } from "react";
import Sidebar from "../../../components/admin/Sidebar.tsx";
import ManageUsers from "../../../components/admin/ManageUsers.tsx";


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
            </main>
        </div>
    );
};

export default AdminPage;