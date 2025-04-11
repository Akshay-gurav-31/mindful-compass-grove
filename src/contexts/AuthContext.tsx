import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  authenticateUser, 
  createUser, 
  updateUserProfile as updateUserDb
} from '@/database';

// Types
interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface PatientRequest {
  id: string;
  patientName: string;
  patientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
  severity: 'low' | 'medium' | 'high';
}

interface MedicalRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  uploadDate: Date;
  url: string;
}

interface DoctorData {
  specialization: string;
  patients: string[]; // IDs of patients
  appointments: Appointment[];
  patientRequests: PatientRequest[];
}

interface PatientData {
  medicalHistory?: string;
  appointments: Appointment[];
  doctor?: string; // ID of assigned doctor
  medicalRecords?: MedicalRecord[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: 'patient' | 'doctor' | null;
  doctorData: DoctorData | null;
  patientData: PatientData | null;
  login: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signup: (userData: any, password: string) => Promise<{ error: any | null; data: any | null }>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  cancelAppointment: (appointmentId: string) => void;
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

const DOCTOR_DATA_KEY = 'elysiumAIDoctor';
const PATIENT_DATA_KEY = 'elysiumAIPatient';

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
          loadDoctorData(parsedUser.id);
        } else if (parsedUser.type === 'patient') {
          loadPatientData(parsedUser.id);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const loadDoctorData = async (userId: string) => {
    try {
      // Get doctor data from localStorage
      const storedDoctorData = localStorage.getItem(DOCTOR_DATA_KEY);
      if (storedDoctorData) {
        const parsedDoctorData = JSON.parse(storedDoctorData);
        // Convert date strings back to Date objects in appointments
        if (parsedDoctorData.appointments) {
          parsedDoctorData.appointments = parsedDoctorData.appointments.map((apt: any) => ({
            ...apt,
            date: new Date(apt.date)
          }));
        }
        // Convert date strings in patient requests
        if (parsedDoctorData.patientRequests) {
          parsedDoctorData.patientRequests = parsedDoctorData.patientRequests.map((req: any) => ({
            ...req,
            date: new Date(req.date)
          }));
        }
        setDoctorData(parsedDoctorData);
      } else {
        // Initialize doctor data
        const initialDoctorData: DoctorData = {
          specialization: user?.specialization || '',
          patients: [],
          appointments: [],
          patientRequests: []
        };
        
        setDoctorData(initialDoctorData);
        localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(initialDoctorData));
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
    }
  };

  const loadPatientData = async (userId: string) => {
    try {
      // Get patient data from localStorage
      const storedPatientData = localStorage.getItem(PATIENT_DATA_KEY);
      if (storedPatientData) {
        const parsedPatientData = JSON.parse(storedPatientData);
        // Convert date strings back to Date objects in appointments
        if (parsedPatientData.appointments) {
          parsedPatientData.appointments = parsedPatientData.appointments.map((apt: any) => ({
            ...apt,
            date: new Date(apt.date)
          }));
        }
        // Convert date strings in medical records if any
        if (parsedPatientData.medicalRecords) {
          parsedPatientData.medicalRecords = parsedPatientData.medicalRecords.map((rec: any) => ({
            ...rec,
            uploadDate: new Date(rec.uploadDate)
          }));
        }
        setPatientData(parsedPatientData);
      } else {
        // Initialize patient data
        const initialPatientData: PatientData = {
          medicalHistory: user?.medicalHistory || '',
          appointments: [],
          medicalRecords: []
        };
        
        setPatientData(initialPatientData);
        localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(initialPatientData));
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    }
  };

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
          loadDoctorData(result.data.user.id);
        } else if (result.data.user.type === 'patient') {
          loadPatientData(result.data.user.id);
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
