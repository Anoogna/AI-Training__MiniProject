import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Fleet from './pages/Fleet';
import Shipments from './pages/Shipments';
import Delivery from './pages/Delivery';
import Messages from './pages/Messages';
import Warehouse from './pages/Warehouse';
import Gate from './pages/Gate';
import DriverView from './pages/DriverView';
import TrackShipment from './pages/TrackShipment';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/track/:trackingId" element={<TrackShipment />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/shipments" element={<Shipments />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/gate" element={<Gate />} />
                <Route path="/driver" element={<DriverView />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
