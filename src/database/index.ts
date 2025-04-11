
// Simple file-based database system
import { useState, useEffect } from 'react';

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

// In-memory database
const users: User[] = [];

// Load initial data (in a real app, this would read from files)
const loadInitialData = () => {
  try {
    // In a real implementation, this would read from a file
    // For now, we'll just use some sample data
    const sampleUsers = [
      {
        id: '1',
        email: 'patient@example.com',
        password: 'password123',
        name: 'John Patient',
        type: 'patient' as const,
      },
      {
        id: '2',
        email: 'doctor@example.com',
        password: 'password123',
        name: 'Dr. Jane Smith',
        type: 'doctor' as const,
        specialization: 'Psychiatrist',
      }
    ];
    
    users.push(...sampleUsers);
    console.log('Loaded sample users:', users);
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
    
    // Add to the in-memory database
    users.push(newUser);
    
    // In a real implementation, we would save to a file here
    console.log('Created new user:', newUser);
    console.log('Current users:', users);
    
    return { data: newUser, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { data: null, error: { message: 'Error creating user' } };
  }
};

export const findUserByEmail = (email: string) => {
  try {
    const user = users.find(u => u.email === email);
    return { data: user || null, error: null };
  } catch (error) {
    console.error('Error finding user:', error);
    return { data: null, error: { message: 'Error finding user' } };
  }
};

export const authenticateUser = (email: string, password: string) => {
  try {
    const user = users.find(u => u.email === email && u.password === password);
    
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
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { data: null, error: { message: 'User not found' } };
    }
    
    // Update the user
    users[userIndex] = {
      ...users[userIndex],
      ...userData
    };
    
    // In a real implementation, we would save to a file here
    console.log('Updated user:', users[userIndex]);
    
    return { data: users[userIndex], error: null };
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
      // In a real implementation, this would read from files
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    loadData();
  }, []);
  
  return {
    isLoading,
    users,
    createUser,
    findUserByEmail,
    authenticateUser,
    updateUserProfile
  };
};
