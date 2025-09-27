import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, signUp as apiRegister } from '../api/apiService';
import { AuthContext, type User } from './AuthContextDefinition';

// Define the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for a token in local storage on app load
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ fullName: 'Authenticated User', email: 'user@ipims.com' }); 
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await apiLogin(email, password);
      setIsAuthenticated(true);
      setUser({ fullName: 'Pasan', email: email });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      await apiRegister(fullName, email, password, confirmPassword);
      await login(email, password);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
