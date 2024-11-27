import React, { useState } from "react";
import Sidebar from "../../../components/common/Sidebar.tsx";
import ManageUsers from "../../../components/admin/ManageUsers.tsx";


const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState(1);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            {/* Main Content */}
            <main className="flex-1 p-4 ml-16">
                {activeSection === 1 && <h1 className="text-2xl font-bold">Home Section</h1>}
                {activeSection === 2 && <h1 className="text-2xl font-bold">Info Section</h1>}
                {activeSection === 3 && <ManageUsers />}
                {activeSection === 4 && <h1 className="text-2xl font-bold">Settings Section</h1>}
            </main>
        </div>
    );
};

export default AdminPage;