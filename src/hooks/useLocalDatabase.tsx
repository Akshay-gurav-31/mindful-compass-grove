
import { useState, useEffect } from 'react';
import { 
  User,
  Appointment,
  PatientRequest,
  findUserByEmail, 
  authenticateUser, 
  createUser, 
  updateUserProfile,
  getUserById,
  getAllDoctors,
  getAllPatients,
  addAppointment,
  addPatientRequest
} from '@/database';

// Custom hook for using the local database
export const useLocalDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  
  useEffect(() => {
    // Simulate loading data from files
    const loadData = async () => {
      try {
        const patientsResult = getAllPatients();
        const doctorsResult = getAllDoctors();
        
        if (patientsResult.data) {
          setPatients(patientsResult.data.patients);
        }
        
        if (doctorsResult.data) {
          setDoctors(doctorsResult.data.doctors);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error in useLocalDatabase:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return {
    isLoading,
    patients,
    doctors,
    createUser,
    findUserByEmail,
    authenticateUser,
    updateUserProfile,
    getUserById,
    getAllDoctors,
    getAllPatients,
    addAppointment,
    addPatientRequest
  };
};
