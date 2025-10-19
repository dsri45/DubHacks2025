import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { usersService } from '../services/firebaseService';

interface User {
  id: string;
  email: string;
  name: string;
  credits?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearStorage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(
      // Fix: Import and use the correct 'auth' instance and remove unknown type 'FirebaseUser'
      // Import the 'auth' instance from your firebase config
      // Make sure to actually add this import at the top of your file:
      // import { auth } from '../firebase'; // adjust the path as needed
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in - try to load full user data from Firestore
          try {
            const userData = await usersService.getUserById(firebaseUser.uid);
            if (userData) {
              // User exists in Firestore, use that data
              setUser({
                id: userData.id!,
                email: userData.email,
                name: userData.name,
                credits: userData.credits
              });
            } else {
              // User doesn't exist in Firestore yet, create basic user data
              const basicUserData: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                credits: 150 // Default starting credits
              };
              setUser(basicUserData);
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            // Fallback to basic user data if Firestore fails
            const basicUserData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              credits: 150
            };
            setUser(basicUserData);
          }
        } else {
          // User is signed out
          setUser(null);
        }
        setIsLoading(false);
      });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name using the updateProfile function from the Firebase Auth module
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearStorage = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Clear storage error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    clearStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
