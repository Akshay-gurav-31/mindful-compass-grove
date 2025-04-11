
import { v4 as uuidv4 } from 'uuid';

// In-memory database as fallback
let patientsDB: any[] = [];
let doctorsDB: any[] = [];

// Function to load patients data from JSON file
const loadPatientsData = () => {
  try {
    // In a real application, this would be an API call
    const data = require('./patients.json');
    patientsDB = data;
    return data;
  } catch (error) {
    console.error("Error loading patients data:", error);
    return [];
  }
};

// Function to load doctors data from JSON file
const loadDoctorsData = () => {
  try {
    // In a real application, this would be an API call
    const data = require('./doctors.json');
    doctorsDB = data;
    return data;
  } catch (error) {
    console.error("Error loading doctors data:", error);
    return [];
  }
};

// Initialize databases
const initializeDB = () => {
  // Load data from JSON files
  patientsDB = loadPatientsData();
  doctorsDB = loadDoctorsData();
  
  console.log("Database initialized with patients:", patientsDB.length);
  console.log("Database initialized with doctors:", doctorsDB.length);
};

// Initialize on first import
initializeDB();

// Check if email already exists in either patients or doctors DB
const isEmailUnique = (email: string) => {
  const patientExists = patientsDB.some(patient => patient.email === email);
  const doctorExists = doctorsDB.some(doctor => doctor.email === email);
  
  return !patientExists && !doctorExists;
};

// Create a new user (patient or doctor)
export const createUser = (userData: any) => {
  try {
    // Check if email already exists
    if (!isEmailUnique(userData.email)) {
      return {
        data: null,
        error: { message: "Email already in use. Please use a different email." }
      };
    }
    
    // Create user object with ID
    const newUser = {
      id: uuidv4(),
      ...userData,
      // Ensure created timestamp
      createdAt: new Date().toISOString()
    };
    
    // Add to appropriate database based on user type
    if (userData.type === 'patient') {
      patientsDB.push(newUser);
      
      // In a real app, this would save to the server
      console.log("Created new patient:", newUser.email);
    } else if (userData.type === 'doctor') {
      doctorsDB.push(newUser);
      
      // In a real app, this would save to the server
      console.log("Created new doctor:", newUser.email);
    } else {
      return {
        data: null,
        error: { message: "Invalid user type. Must be 'patient' or 'doctor'." }
      };
    }
    
    return {
      data: { user: newUser },
      error: null
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      data: null,
      error: { message: "Failed to create user. Please try again." }
    };
  }
};

// Authenticate a user (login)
export const authenticateUser = (email: string, password: string) => {
  try {
    // Check patients database
    let user = patientsDB.find(patient => patient.email === email);
    
    // If not found in patients, check doctors
    if (!user) {
      user = doctorsDB.find(doctor => doctor.email === email);
    }
    
    // User not found with this email
    if (!user) {
      return {
        data: null,
        error: { message: "No account found with this email." }
      };
    }
    
    // Check password
    if (user.password !== password) {
      return {
        data: null,
        error: { message: "Incorrect password." }
      };
    }
    
    // Successful authentication
    return {
      data: { user },
      error: null
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      data: null,
      error: { message: "Authentication failed. Please try again." }
    };
  }
};

// Get user by ID
export const getUserById = (userId: string) => {
  try {
    // Check patients database
    let user = patientsDB.find(patient => patient.id === userId);
    
    // If not found in patients, check doctors
    if (!user) {
      user = doctorsDB.find(doctor => doctor.id === userId);
    }
    
    if (!user) {
      return {
        data: null,
        error: { message: "User not found." }
      };
    }
    
    return {
      data: { user },
      error: null
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      data: null,
      error: { message: "Failed to retrieve user." }
    };
  }
};

// Update user profile
export const updateUserProfile = (userId: string, userData: any) => {
  try {
    // Find in patients
    const patientIndex = patientsDB.findIndex(patient => patient.id === userId);
    
    if (patientIndex !== -1) {
      // Update patient
      patientsDB[patientIndex] = {
        ...patientsDB[patientIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        data: { user: patientsDB[patientIndex] },
        error: null
      };
    }
    
    // Find in doctors
    const doctorIndex = doctorsDB.findIndex(doctor => doctor.id === userId);
    
    if (doctorIndex !== -1) {
      // Update doctor
      doctorsDB[doctorIndex] = {
        ...doctorsDB[doctorIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        data: { user: doctorsDB[doctorIndex] },
        error: null
      };
    }
    
    return {
      data: null,
      error: { message: "User not found." }
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      data: null,
      error: { message: "Failed to update profile. Please try again." }
    };
  }
};

// Get all doctors
export const getAllDoctors = () => {
  try {
    return {
      data: { doctors: doctorsDB },
      error: null
    };
  } catch (error) {
    console.error("Error getting doctors:", error);
    return {
      data: null,
      error: { message: "Failed to retrieve doctors." }
    };
  }
};

// Get all patients
export const getAllPatients = () => {
  try {
    return {
      data: { patients: patientsDB },
      error: null
    };
  } catch (error) {
    console.error("Error getting patients:", error);
    return {
      data: null,
      error: { message: "Failed to retrieve patients." }
    };
  }
};

// Add a new appointment
export const addAppointment = (appointmentData: any) => {
  try {
    // In a real app, this would save to the database
    console.log("New appointment added:", appointmentData);
    
    return {
      data: { appointment: appointmentData },
      error: null
    };
  } catch (error) {
    console.error("Error adding appointment:", error);
    return {
      data: null,
      error: { message: "Failed to add appointment. Please try again." }
    };
  }
};

// Add patient request
export const addPatientRequest = (requestData: any) => {
  try {
    // In a real app, this would save to the database
    console.log("New patient request added:", requestData);
    
    return {
      data: { request: requestData },
      error: null
    };
  } catch (error) {
    console.error("Error adding patient request:", error);
    return {
      data: null,
      error: { message: "Failed to submit request. Please try again." }
    };
  }
};
