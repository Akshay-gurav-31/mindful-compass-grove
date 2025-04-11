
// Permanent file-based database system
import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

// Types
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
  password: string; // We store the password in plaintext for simplicity (not secure for production)
}

// File paths
const PATIENTS_DB_PATH = 'src/database/patients.json';
const DOCTORS_DB_PATH = 'src/database/doctors.json';

// In-memory database (loaded from files)
let patients: User[] = [];
let doctors: User[] = [];

// Write data to files
const saveData = () => {
  try {
    // For browser environments, use localStorage
    localStorage.setItem('elysiumAI_patients', JSON.stringify(patients));
    localStorage.setItem('elysiumAI_doctors', JSON.stringify(doctors));
    
    console.log('Saved patients:', patients);
    console.log('Saved doctors:', doctors);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Load data from files or initialize with sample data if files don't exist
const loadInitialData = () => {
  try {
    // For browser environments, use localStorage
    const storedPatients = localStorage.getItem('elysiumAI_patients');
    const storedDoctors = localStorage.getItem('elysiumAI_doctors');
    
    if (storedPatients) {
      patients = JSON.parse(storedPatients);
    } else {
      // Sample patient data if no file exists
      patients = [
        {
          id: '1',
          email: 'patient@example.com',
          password: 'password123',
          name: 'John Patient',
          type: 'patient',
        }
      ];
      // Save the sample data
      saveData();
    }
    
    if (storedDoctors) {
      doctors = JSON.parse(storedDoctors);
    } else {
      // Sample doctor data if no file exists
      doctors = [
        {
          id: '2',
          email: 'doctor@example.com',
          password: 'password123',
          name: 'Dr. Jane Smith',
          type: 'doctor',
          specialization: 'Psychiatrist',
        }
      ];
      // Save the sample data
      saveData();
    }
    
    console.log('Loaded patients:', patients);
    console.log('Loaded doctors:', doctors);
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
};

// Initialize the database
loadInitialData();

// Database operations
export const createUser = (userData: Omit<User, 'id'>) => {
  try {
    // Generate a random ID
    const id = Math.random().toString(36).substring(2, 15);
    
    // Create the new user
    const newUser: User = {
      ...userData,
      id
    };
    
    // Check if user with the same email already exists
    const existingUser = findUserByEmail(userData.email).data;
    if (existingUser) {
      return { 
        data: null, 
        error: { 
          message: `A ${userData.type} with this email already exists` 
        } 
      };
    }
    
    // Add to the appropriate array based on user type
    if (userData.type === 'patient') {
      patients.push(newUser);
    } else if (userData.type === 'doctor') {
      doctors.push(newUser);
    }
    
    // Save to file
    saveData();
    
    console.log(`Created new ${userData.type}:`, newUser);
    console.log('Current patients:', patients);
    console.log('Current doctors:', doctors);
    
    return { data: newUser, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { data: null, error: { message: 'Error creating user' } };
  }
};

export const findUserByEmail = (email: string) => {
  try {
    // Check in both patient and doctor arrays
    const patient = patients.find(p => p.email === email);
    if (patient) {
      return { data: patient, error: null };
    }
    
    const doctor = doctors.find(d => d.email === email);
    if (doctor) {
      return { data: doctor, error: null };
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Error finding user:', error);
    return { data: null, error: { message: 'Error finding user' } };
  }
};

export const authenticateUser = (email: string, password: string) => {
  try {
    // Check in patient array
    let user = patients.find(p => p.email === email && p.password === password);
    
    // If not found in patients, check in doctors
    if (!user) {
      user = doctors.find(d => d.email === email && d.password === password);
    }
    
    if (!user) {
      return { 
        data: null, 
        error: { message: 'Invalid login credentials' }
      };
    }
    
    return { 
      data: { 
        user: { ...user, password: undefined } // Remove password from returned user
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { data: null, error: { message: 'Error authenticating user' } };
  }
};

export const updateUserProfile = (userId: string, userData: Partial<User>) => {
  try {
    // Check in patient array first
    let userIndex = patients.findIndex(p => p.id === userId);
    let userArray = patients;
    let userType = 'patient';
    
    // If not found in patients, check in doctors
    if (userIndex === -1) {
      userIndex = doctors.findIndex(d => d.id === userId);
      userArray = doctors;
      userType = 'doctor';
    }
    
    if (userIndex === -1) {
      return { data: null, error: { message: 'User not found' } };
    }
    
    // Update the user
    userArray[userIndex] = {
      ...userArray[userIndex],
      ...userData
    };
    
    // Save to file
    saveData();
    
    console.log(`Updated ${userType}:`, userArray[userIndex]);
    
    return { data: userArray[userIndex], error: null };
  } catch (error) {
    console.error('Error updating user:', error);
    return { data: null, error: { message: 'Error updating user' } };
  }
};

// Custom hook for using the local database
export const useLocalDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data from files
    const loadData = async () => {
      setIsLoading(false);
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
    updateUserProfile
  };
};
