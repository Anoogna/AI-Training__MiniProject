import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
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

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    const fallback = user.role === 'driver'
      ? '/driver'
      : user.role === 'warehouse'
        ? '/warehouse'
        : user.role === 'gate'
          ? '/gate'
          : '/';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

function getRoleHome(role) {
  if (role === 'driver') return '/driver';
  if (role === 'warehouse') return '/warehouse';
  if (role === 'gate') return '/gate';
  return '/dashboard';
}

function LandingGate() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (user) return <Navigate to={getRoleHome(user.role)} replace />;

  return <LandingPage />;
}

function AuthGate({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (user) return <Navigate to={getRoleHome(user.role)} replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingGate />} />
      <Route path="/login" element={<AuthGate><Login /></AuthGate>} />
      <Route path="/signup" element={<AuthGate><Signup /></AuthGate>} />
      <Route path="/track/:trackingId" element={<TrackShipment />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/fleet"
                  element={
                    <RoleRoute allowedRoles={['admin', 'dispatcher', 'driver']}>
                      <Fleet />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/shipments"
                  element={
                    <RoleRoute allowedRoles={['admin', 'dispatcher']}>
                      <Shipments />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/delivery"
                  element={
                    <RoleRoute allowedRoles={['admin', 'dispatcher']}>
                      <Delivery />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <RoleRoute allowedRoles={['admin', 'dispatcher', 'driver']}>
                      <Messages />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/warehouse"
                  element={
                    <RoleRoute allowedRoles={['admin', 'warehouse', 'dispatcher']}>
                      <Warehouse />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/gate"
                  element={
                    <RoleRoute allowedRoles={['admin', 'gate', 'dispatcher']}>
                      <Gate />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/driver"
                  element={
                    <RoleRoute allowedRoles={['driver']}>
                      <DriverView />
                    </RoleRoute>
                  }
                />
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
