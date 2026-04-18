import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { StockPage } from '@/pages/StockPage';
import { PartsPage } from '@/pages/PartsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { Header } from '@/components/Header';
import './styles/index.css';
import './styles/header.css';
import './styles/stock.css';
import './styles/parts.css';
import './styles/login.css';
import './styles/home.css';
import './styles/reports.css';
import './styles/notifications.css';

function AppLayout() {
  // Header is rendered in ProtectedRoute, no need to render here
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}

export function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <AppLayout />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div style={{ paddingTop: '60px' }}>
                <HomePage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <div style={{ paddingTop: '60px' }}>
                <OrdersPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <div style={{ paddingTop: '60px' }}>
                <StockPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/parts"
          element={
            <ProtectedRoute>
              <div style={{ paddingTop: '60px' }}>
                <PartsPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <div style={{ paddingTop: '60px' }}>
                <ReportsPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
