import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="admin-dashboard">
            <h1>DASHBOARD</h1>
            <nav>
                <Link to="/admin/create">CREATE RELEASE</Link>
                <Link to="/releases">VIEW RELEASES</Link>
                <Link to="/shows">MANAGE SHOWS</Link>
            </nav>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard; 