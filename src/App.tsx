import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Shows from './pages/Shows';
import Releases from './pages/Releases';
import ReleaseDetail from './pages/ReleaseDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import CreateRelease from './pages/admin/CreateRelease';
import EditRelease from './pages/admin/EditRelease';
import ProtectedRoute from './components/admin/ProtectedRoute';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/shows" element={<Shows />} />
                        <Route path="/releases" element={<Releases />} />
                        <Route path="/release/:urlTitle" element={<ReleaseDetail />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/create" 
                            element={
                                <ProtectedRoute>
                                    <CreateRelease />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/release/:id/edit" 
                            element={
                                <ProtectedRoute>
                                    <EditRelease />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;