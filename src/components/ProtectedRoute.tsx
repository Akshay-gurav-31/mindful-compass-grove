
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'patient' | 'doctor' | 'both';
}

const ProtectedRoute = ({ children, requiredUserType = 'both' }: ProtectedRouteProps) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType !== 'both' && userType !== requiredUserType) {
    // Redirect doctor to doctor dashboard if trying to access patient pages
    if (userType === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    }
    
    // Redirect patient to patient dashboard if trying to access doctor pages
    if (userType === 'patient') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
