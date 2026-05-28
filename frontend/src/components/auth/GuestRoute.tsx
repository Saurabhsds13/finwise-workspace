import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface GuestRouteProps {
  children: React.ReactNode;
}

function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;
