
// Types for authentication context and related data
export interface User {
  id: string;
  email: string;
  name: string;
  type: 'patient' | 'doctor';
  profileImage?: string;
  phone?: string;
  age?: string;
  address?: string;
  bio?: string;
  specialization?: string;
  medicalHistory?: string;
  password: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  patientName: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PatientRequest {
  id: string;
  patientName: string;
  patientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface MedicalRecord {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text';
  uploadDate: Date;
  url: string;
}

export interface DoctorData {
  specialization: string;
  patients: string[]; // IDs of patients
  appointments: Appointment[];
  patientRequests: PatientRequest[];
}

export interface PatientData {
  medicalHistory?: string;
  appointments: Appointment[];
  doctor?: string; // ID of assigned doctor
  medicalRecords?: MedicalRecord[];
}

export interface AuthContextType {
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
