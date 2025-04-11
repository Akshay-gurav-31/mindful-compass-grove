
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  AuthContextType,
  Appointment,
  DoctorData,
  PatientData
} from './AuthTypes';
import { loadDoctorData, loadPatientData, DOCTOR_DATA_KEY, PATIENT_DATA_KEY } from './AuthDataUtils';
import { 
  authenticateUser, 
  createUser, 
  updateUserProfile as updateUserDb
} from '@/database';

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
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
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('elysiumAIUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setUserType(parsedUser.type);
        
        // Load additional data based on user type
        if (parsedUser.type === 'doctor') {
          loadDoctorData(parsedUser.id).then(setDoctorData);
        } else if (parsedUser.type === 'patient') {
          loadPatientData(parsedUser.id).then(setPatientData);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const signup = async (userData: any, password: string) => {
    try {
      console.log("Signing up with:", userData.email, userData.type);
      
      // Format the user data
      const formattedUserData = {
        email: userData.email,
        password: password,
        name: `${userData.firstName} ${userData.lastName}`,
        type: userData.type || 'patient',
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber
      };
      
      // Create the user using the database function
      const result = createUser(formattedUserData);
      
      if (result.error) {
        console.error("Signup error:", result.error);
      } else {
        console.log("Signup successful:", result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Logging in with:", email);
      
      // Authenticate user using database function
      const result = authenticateUser(email, password);
      
      if (result.error) {
        console.error("Login error:", result.error);
        return { data: null, error: result.error };
      }
      
      if (result.data?.user) {
        // Set authentication state
        setUser(result.data.user);
        setIsAuthenticated(true);
        setUserType(result.data.user.type);
        
        // Store user in localStorage
        localStorage.setItem('elysiumAIUser', JSON.stringify(result.data.user));
        
        // Load additional data based on user type
        if (result.data.user.type === 'doctor') {
          const doctorData = await loadDoctorData(result.data.user.id);
          setDoctorData(doctorData);
        } else if (result.data.user.type === 'patient') {
          const patientData = await loadPatientData(result.data.user.id);
          setPatientData(patientData);
        }
        
        console.log("Login successful:", result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      setUser(null);
      setIsAuthenticated(false);
      setUserType(null);
      setDoctorData(null);
      setPatientData(null);
      localStorage.removeItem('elysiumAIUser');
      localStorage.removeItem(DOCTOR_DATA_KEY);
      localStorage.removeItem(PATIENT_DATA_KEY);
      console.log("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (user) {
      try {
        // Update the local user state
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        
        // Update in database
        const result = updateUserDb(user.id, data);
        
        if (result.error) {
          console.error('Error updating profile:', result.error);
          throw result.error;
        }
        
        // Update in localStorage
        localStorage.setItem('elysiumAIUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error in updateUserProfile:', error);
        throw error;
      }
    }
  };

  const addAppointment = (appointment: Appointment) => {
    if (userType === 'doctor' && doctorData) {
      const updatedAppointments = [...doctorData.appointments, appointment];
      const updatedDoctorData = {
        ...doctorData,
        appointments: updatedAppointments
      };
      setDoctorData(updatedDoctorData);
      localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(updatedDoctorData));
    } else if (userType === 'patient' && patientData) {
      const updatedAppointments = [...patientData.appointments, appointment];
      const updatedPatientData = {
        ...patientData,
        appointments: updatedAppointments
      };
      setPatientData(updatedPatientData);
      localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(updatedPatientData));
    }
  };

  const cancelAppointment = (appointmentId: string) => {
    if (userType === 'doctor' && doctorData) {
      const updatedAppointments = doctorData.appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      );
      const updatedDoctorData = {
        ...doctorData,
        appointments: updatedAppointments
      };
      setDoctorData(updatedDoctorData);
      localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(updatedDoctorData));
    } else if (userType === 'patient' && patientData) {
      const updatedAppointments = patientData.appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      );
      const updatedPatientData = {
        ...patientData,
        appointments: updatedAppointments
      };
      setPatientData(updatedPatientData);
      localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(updatedPatientData));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      userType, 
      doctorData,
      patientData,
      login, 
      signup,
      logout,
      updateUserProfile,
      addAppointment,
      cancelAppointment
    }}>
      {children}
    </AuthContext.Provider>
  );
};
