import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextDefinition';

// Re-export types for convenience
export interface User {
  fullName: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};