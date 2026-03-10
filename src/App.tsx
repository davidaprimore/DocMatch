import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { SearchDoctorsPage } from '@/pages/SearchDoctorsPage';
import { PrescriptionPage } from '@/pages/PrescriptionPage';
import { ComparePricesPage } from '@/pages/ComparePricesPage';
import { PlansPage } from '@/pages/PlansPage';
import { Agendar } from '@/pages/Agendar';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buscar"
        element={
          <ProtectedRoute>
            <SearchDoctorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agendar"
        element={
          <ProtectedRoute>
            <Agendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receitas/:id"
        element={
          <ProtectedRoute>
            <PrescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comparar-precos"
        element={
          <ProtectedRoute>
            <ComparePricesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planos"
        element={
          <ProtectedRoute>
            <PlansPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#3B6B8C',
              color: 'white',
              border: 'none',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
