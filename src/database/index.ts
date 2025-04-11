
// Permanent file-based database system
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
const PATIENTS_DB_PATH = path.join(process.cwd(), 'src/database/patients.json');
const DOCTORS_DB_PATH = path.join(process.cwd(), 'src/database/doctors.json');

// In-memory database (loaded from files)
let patients: User[] = [];
let doctors: User[] = [];

// Write data to files
const saveData = () => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(PATIENTS_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write data to files
    fs.writeFileSync(PATIENTS_DB_PATH, JSON.stringify(patients, null, 2));
    fs.writeFileSync(DOCTORS_DB_PATH, JSON.stringify(doctors, null, 2));
    
    console.log('Saved patients to file:', PATIENTS_DB_PATH);
    console.log('Saved doctors to file:', DOCTORS_DB_PATH);
  } catch (error) {
    console.error('Error saving data to files:', error);
    
    // Fallback to localStorage if file system access fails (for browser environments)
    try {
      localStorage.setItem('elysiumAI_patients', JSON.stringify(patients));
      localStorage.setItem('elysiumAI_doctors', JSON.stringify(doctors));
      console.log('Saved to localStorage as fallback');
    } catch (localStorageError) {
      console.error('Error saving to localStorage:', localStorageError);
    }
  }
};

// Load data from files or initialize with sample data if files don't exist
const loadInitialData = () => {
  try {
    // Try to load from files first
    if (fs.existsSync(PATIENTS_DB_PATH)) {
      const data = fs.readFileSync(PATIENTS_DB_PATH, 'utf8');
      patients = JSON.parse(data);
      console.log('Loaded patients from file:', PATIENTS_DB_PATH);
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
    
    if (fs.existsSync(DOCTORS_DB_PATH)) {
      const data = fs.readFileSync(DOCTORS_DB_PATH, 'utf8');
      doctors = JSON.parse(data);
      console.log('Loaded doctors from file:', DOCTORS_DB_PATH);
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
  } catch (error) {
    console.error('Error loading data from files:', error);
    
    // Fallback to localStorage if file system access fails
    try {
      const storedPatients = localStorage.getItem('elysiumAI_patients');
      const storedDoctors = localStorage.getItem('elysiumAI_doctors');
      
      if (storedPatients) {
        patients = JSON.parse(storedPatients);
        console.log('Loaded patients from localStorage');
      }
      
      if (storedDoctors) {
        doctors = JSON.parse(storedDoctors);
        console.log('Loaded doctors from localStorage');
      }
    } catch (localStorageError) {
      console.error('Error loading from localStorage:', localStorageError);
    }
  }
};

// Initialize the database
loadInitialData();

// Helper function to check if an email exists in either database
const emailExistsInAnyDatabase = (email: string): boolean => {
  const patientExists = patients.some(p => p.email === email);
  const doctorExists = doctors.some(d => d.email === email);
  return patientExists || doctorExists;
};

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
    
    // Check if email already exists in ANY database (patient or doctor)
    if (emailExistsInAnyDatabase(userData.email)) {
      return { 
        data: null, 
        error: { 
          message: `A user with this email already exists` 
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
