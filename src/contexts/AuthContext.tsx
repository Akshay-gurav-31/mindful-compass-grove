
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define types for database tables
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type DoctorDataRow = Database['public']['Tables']['doctor_data']['Row'];
type PatientDataRow = Database['public']['Tables']['patient_data']['Row'];
type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
type PatientRequestRow = Database['public']['Tables']['patient_requests']['Row'];
type MedicalRecordRow = Database['public']['Tables']['medical_records']['Row'];

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

const DOCTOR_DATA_KEY = 'mindfulGroveDoctor';
const PATIENT_DATA_KEY = 'mindfulGrovePatient';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        
        if (newSession) {
          setIsAuthenticated(true);
          
          // Fetch user profile data
          setTimeout(async () => {
            if (newSession.user?.id) {
              try {
                const { data: profileData, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', newSession.user.id)
                  .single();
                
                if (error) {
                  console.error('Error fetching profile:', error);
                  return;
                }
                
                if (profileData) {
                  const userData: User = {
                    id: profileData.id,
                    email: profileData.email,
                    name: profileData.name || '',
                    type: profileData.type as 'patient' | 'doctor',
                    profileImage: profileData.profile_image,
                    phone: profileData.phone,
                    age: profileData.age,
                    address: profileData.address,
                    bio: profileData.bio,
                    specialization: profileData.specialization,
                    medicalHistory: profileData.medical_history
                  };
                  
                  setUser(userData);
                  setUserType(profileData.type as 'patient' | 'doctor');
                  
                  // Load additional data based on user type
                  if (profileData.type === 'doctor') {
                    loadDoctorData(userData.id);
                  } else if (profileData.type === 'patient') {
                    loadPatientData(userData.id);
                  }
                }
              } catch (error) {
                console.error('Error in auth state change:', error);
              }
            }
          }, 0);
        } else {
          // Clear auth state if session is null
          setUser(null);
          setIsAuthenticated(false);
          setUserType(null);
          setDoctorData(null);
          setPatientData(null);
        }
      }
    );

    // Then get current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        setIsAuthenticated(true);
        
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching profile on init:', error);
              return;
            }
            
            if (profileData) {
              const userData: User = {
                id: profileData.id,
                email: profileData.email,
                name: profileData.name || '',
                type: profileData.type as 'patient' | 'doctor',
                profileImage: profileData.profile_image,
                phone: profileData.phone,
                age: profileData.age,
                address: profileData.address,
                bio: profileData.bio,
                specialization: profileData.specialization,
                medicalHistory: profileData.medical_history
              };
              
              setUser(userData);
              setUserType(profileData.type as 'patient' | 'doctor');
              
              // Load additional data based on user type
              if (profileData.type === 'doctor') {
                loadDoctorData(userData.id);
              } else if (profileData.type === 'patient') {
                loadPatientData(userData.id);
              }
            }
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadDoctorData = async (userId: string) => {
    try {
      // For now, we'll use local storage for doctor data until we implement it fully in the database
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
        const { data: doctorData, error } = await supabase
          .from('doctor_data')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching doctor data:', error);
          return;
        }
        
        // Fetch appointments for the doctor
        const { data: appointments, error: appError } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', userId);
          
        if (appError) {
          console.error('Error fetching appointments:', appError);
        }
        
        // Fetch patient requests for the doctor
        const { data: requests, error: reqError } = await supabase
          .from('patient_requests')
          .select('*')
          .eq('doctor_id', userId);
          
        if (reqError) {
          console.error('Error fetching patient requests:', reqError);
        }
        
        const initialDoctorData: DoctorData = {
          specialization: doctorData?.specialization || '',
          patients: doctorData?.patients || [],
          appointments: appointments ? appointments.map((apt) => ({
            id: apt.id,
            doctorId: apt.doctor_id,
            patientId: apt.patient_id,
            doctorName: apt.doctor_name,
            patientName: apt.patient_name,
            date: new Date(apt.date),
            status: apt.status as 'scheduled' | 'completed' | 'cancelled',
            notes: apt.notes
          })) : [],
          patientRequests: requests ? requests.map((req) => ({
            id: req.id,
            patientId: req.patient_id,
            patientName: req.patient_name,
            message: req.message,
            status: req.status as 'pending' | 'accepted' | 'rejected',
            date: new Date(req.date),
            severity: req.severity as 'low' | 'medium' | 'high'
          })) : []
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
      // For now, we'll use local storage for patient data until we implement it fully in the database
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
        // Initialize patient data from database
        const { data: patientData, error } = await supabase
          .from('patient_data')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching patient data:', error);
          return;
        }
        
        // Fetch appointments for the patient
        const { data: appointments, error: appError } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', userId);
          
        if (appError) {
          console.error('Error fetching appointments:', appError);
        }
        
        // Fetch medical records for the patient
        const { data: records, error: recError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patient_id', userId);
          
        if (recError) {
          console.error('Error fetching medical records:', recError);
        }
        
        const initialPatientData: PatientData = {
          medicalHistory: patientData?.medical_history || '',
          appointments: appointments ? appointments.map((apt) => ({
            id: apt.id,
            doctorId: apt.doctor_id,
            patientId: apt.patient_id,
            doctorName: apt.doctor_name,
            patientName: apt.patient_name,
            date: new Date(apt.date),
            status: apt.status as 'scheduled' | 'completed' | 'cancelled',
            notes: apt.notes
          })) : [],
          doctor: patientData?.doctor_id,
          medicalRecords: records ? records.map((rec) => ({
            id: rec.id,
            name: rec.name,
            type: rec.type as 'pdf' | 'image' | 'text',
            uploadDate: new Date(rec.upload_date),
            url: rec.url
          })) : []
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
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
        options: {
          data: {
            name: `${userData.firstName} ${userData.lastName}`,
            type: userData.type || 'patient',
            specialization: userData.specialization,
            licenseNumber: userData.licenseNumber
          }
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { data, error };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setUserType(null);
      setDoctorData(null);
      setPatientData(null);
      localStorage.removeItem(DOCTOR_DATA_KEY);
      localStorage.removeItem(PATIENT_DATA_KEY);
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
        
        // Convert to database format (snake_case)
        const dbData: any = {};
        if (data.name !== undefined) dbData.name = data.name;
        if (data.profileImage !== undefined) dbData.profile_image = data.profileImage;
        if (data.phone !== undefined) dbData.phone = data.phone;
        if (data.age !== undefined) dbData.age = data.age;
        if (data.address !== undefined) dbData.address = data.address;
        if (data.bio !== undefined) dbData.bio = data.bio;
        if (data.specialization !== undefined) dbData.specialization = data.specialization;
        if (data.medicalHistory !== undefined) dbData.medical_history = data.medicalHistory;
        
        // Update in database
        const { error } = await supabase
          .from('profiles')
          .update(dbData)
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating profile:', error);
          throw error;
        }
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
