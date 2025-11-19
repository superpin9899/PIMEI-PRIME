import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  requireAdmin?: boolean;
  redirectTo?: string;
};

const ProtectedRoute = ({ requireAdmin = false, redirectTo = '/' }: ProtectedRouteProps) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white text-gray-500">
        Validando sesión...
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

