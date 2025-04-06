
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  type: 'patient' | 'doctor';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: 'patient' | 'doctor' | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);

  useEffect(() => {
    // Check for user in localStorage on component mount
    const storedUser = localStorage.getItem('mindfulGroveUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserType(parsedUser.type);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setUserType(userData.type);
    localStorage.setItem('mindfulGroveUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('mindfulGroveUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
