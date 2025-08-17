'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/authService';
import { userService } from '../lib/userService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          // Fetch user profile from Firestore
          const profile = await userService.getUserById(authUser.uid);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Handle redirect result on app load
    authService.handleRedirectResult().catch(err => {
      console.error('Redirect result error:', err);
      setError(err.message);
    });

    // Fallback: Set loading to false after 3 seconds if auth state hasn't changed
    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        console.log('Auth state fallback: setting loading to false');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Starting Google sign-in...');
      const result = await authService.signInWithGoogle();
      console.log('Google sign-in successful:', result);
      return result;
    } catch (err) {
      console.error('Google sign-in error in context:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signUpWithEmail(email, password, displayName);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signInWithEmail(email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
