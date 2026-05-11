import React, { useState } from 'react';
import AdminGate from '../components/AdminGate';
import DirectorDashboard from '../components/DirectorDashboard';

const Admin = () => {
    const [unlocked, setUnlocked] = useState(false);

    if (!unlocked) {
        return <AdminGate onUnlock={() => setUnlocked(true)} />;
    }

    return <DirectorDashboard />;
};

export default Admin;
