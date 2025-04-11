
import { DoctorData, PatientData } from './AuthTypes';

// Constants for localStorage keys
export const DOCTOR_DATA_KEY = 'elysiumAIDoctor';
export const PATIENT_DATA_KEY = 'elysiumAIPatient';

/**
 * Loads doctor data from localStorage
 */
export const loadDoctorData = async (userId: string): Promise<DoctorData> => {
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
      return parsedDoctorData;
    } else {
      // Initialize doctor data
      const initialDoctorData: DoctorData = {
        specialization: '',
        patients: [],
        appointments: [],
        patientRequests: []
      };
      
      localStorage.setItem(DOCTOR_DATA_KEY, JSON.stringify(initialDoctorData));
      return initialDoctorData;
    }
  } catch (error) {
    console.error("Error loading doctor data:", error);
    // Return default data on error
    return {
      specialization: '',
      patients: [],
      appointments: [],
      patientRequests: []
    };
  }
};

/**
 * Loads patient data from localStorage
 */
export const loadPatientData = async (userId: string): Promise<PatientData> => {
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
      return parsedPatientData;
    } else {
      // Initialize patient data
      const initialPatientData: PatientData = {
        medicalHistory: '',
        appointments: [],
        medicalRecords: []
      };
      
      localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(initialPatientData));
      return initialPatientData;
    }
  } catch (error) {
    console.error("Error loading patient data:", error);
    // Return default data on error
    return {
      medicalHistory: '',
      appointments: [],
      medicalRecords: []
    };
  }
};
