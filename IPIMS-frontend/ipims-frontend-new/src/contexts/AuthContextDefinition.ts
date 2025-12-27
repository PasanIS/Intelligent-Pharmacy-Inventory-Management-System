import { createContext } from 'react';

// ----------Define the types for authentication context
export interface User {
  fullName: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
}

// ----------Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);