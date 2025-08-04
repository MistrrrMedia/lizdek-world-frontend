import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <nav>
                <Link to="/admin/create">Create New Release</Link>
                <Link to="/releases">View All Releases</Link>
                <Link to="/shows">Manage Shows</Link>
            </nav>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard; 