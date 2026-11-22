import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Si no ha iniciado sesión, lo manda al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige roles específicos y el usuario no lo tiene, lo regresa al inventario
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/inventario" replace />;
  }

  return children;
}