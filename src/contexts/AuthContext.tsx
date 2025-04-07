
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'patient' | 'doctor';
  profileImage?: string;
  phone?: string;
  age?: string;
  address?: string;
  bio?: string;
  specialization?: string; // For doctors
  medicalHistory?: string; // For patients
}

// Doctor specific interface
interface DoctorData {
  specialization: string;
  patients: string[]; // IDs of patients
  appointments: Appointment[];
  patientRequests: PatientRequest[];
}

// Patient specific interface
interface PatientData {
  medicalHistory?: string;
  appointments: Appointment[];
  doctor?: string; // ID of assigned doctor
  medicalRecords?: MedicalRecord[];
}

// Appointment interface
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

// Patient request interface
interface PatientRequest {
  id: string;
  patientName: string;
  patientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
  severity: 'low' | 'medium' | 'high';
}

// Medical record interface
interface MedicalRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  uploadDate: Date;
  url: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: 'patient' | 'doctor' | null;
  doctorData: DoctorData | null;
  patientData: PatientData | null;
  login: (user: User, additionalData?: any) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
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

const AUTH_STORAGE_KEY = 'mindfulGroveUser';
const DOCTOR_DATA_KEY = 'mindfulGroveDoctor';
const PATIENT_DATA_KEY = 'mindfulGrovePatient';

// Sample doctors data for demonstration
const sampleDoctors = [
  {
    id: "dr-smith",
    name: "Dr. Smith",
    email: "dr.smith@example.com",
    specialization: "Psychiatrist",
    profileImage: "",
    type: "doctor" as const
  },
  {
    id: "dr-jones",
    name: "Dr. Jones",
    email: "dr.jones@example.com",
    specialization: "Psychologist",
    profileImage: "",
    type: "doctor" as const
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Check for user in localStorage on component mount
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setUserType(parsedUser.type);
        
        // Load additional data based on user type
        if (parsedUser.type === 'doctor') {
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
              specialization: parsedUser.specialization || '',
              patients: [],
              appointments: [],
              patientRequests: []
            };
            setDoctorData(initialDoctorData);
            localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(initialDoctorData));
          }
        } else if (parsedUser.type === 'patient') {
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
              medicalHistory: '',
              appointments: [],
              medicalRecords: []
            };
            setPatientData(initialPatientData);
            localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(initialPatientData));
          }
        }
      } catch (error) {
        // If there's an error parsing the stored user data, clear it
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (userData: User, additionalData?: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setUserType(userData.type);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    
    if (userData.type === 'doctor') {
      const doctorDataToStore: DoctorData = additionalData || {
        specialization: userData.specialization || '',
        patients: [],
        appointments: [],
        patientRequests: []
      };
      setDoctorData(doctorDataToStore);
      localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(doctorDataToStore));
    } else if (userData.type === 'patient') {
      const patientDataToStore: PatientData = additionalData || {
        medicalHistory: '',
        appointments: [],
        medicalRecords: []
      };
      setPatientData(patientDataToStore);
      localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(patientDataToStore));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    setDoctorData(null);
    setPatientData(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(DOCTOR_DATA_KEY);
    localStorage.removeItem(PATIENT_DATA_KEY);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
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
      logout,
      updateUserProfile,
      addAppointment,
      cancelAppointment
    }}>
      {children}
    </AuthContext.Provider>
  );
};
