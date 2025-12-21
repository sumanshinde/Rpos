import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children, activeView, onViewChange }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar activeView={activeView} onViewChange={onViewChange} />
            <main className="flex-1 ml-20">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
