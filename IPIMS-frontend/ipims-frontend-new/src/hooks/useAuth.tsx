import React, { useState, useEffect } from 'react';
import { login as apiLogin, signUp as apiRegister } from '../api/apiService';
import { AuthContext } from '../contexts/AuthContextDefinition';
import type { User } from '../contexts/AuthContextDefinition';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // ----------Check for a token in local storage on app load
    const token = localStorage.getItem('jwtToken');
    const savedName = localStorage.getItem('userFullName');

    if (token) {
      setIsAuthenticated(true);
      if (savedName) {
        setUser({ fullName: savedName, email: '' });
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await apiLogin(email, password);
      if (success) {
        setIsAuthenticated(true);
        const fullName = localStorage.getItem('userFullName') || 'User';
        console.log('[DEBUG] useAuth Login - Setting User:', fullName);
        setUser({ fullName: fullName, email: email });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userFullName');
      return false;
    }
  };

  const signup = async (fullName: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      await apiRegister(fullName, email, password, confirmPassword);
      await login(email, password);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userFullName');
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
