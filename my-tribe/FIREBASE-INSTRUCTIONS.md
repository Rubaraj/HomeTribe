# Firebase Database Integration Instructions

This document provides step-by-step instructions for integrating Google Firebase database (Firestore) into the HomeTribe application.

## Table of Contents
1. [Firebase Project Setup](#firebase-project-setup)
2. [Google Authentication Setup](#google-authentication-setup)
3. [Installation and Configuration](#installation-and-configuration)
4. [Environment Variables](#environment-variables)
5. [Firebase Configuration](#firebase-configuration)
6. [Database Structure](#database-structure)
7. [Implementation Examples](#implementation-examples)
8. [Google Authentication Integration](#google-authentication-integration)
9. [Security Rules](#security-rules)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Firebase Project Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `hometribe` (or your preferred name)
4. Choose whether to enable Google Analytics (recommended)
5. Select Analytics location and accept terms
6. Click "Create project"

### 2. Enable Firestore Database
1. In Firebase Console, navigate to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (we'll set proper rules later)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

### 3. Set up Authentication (Optional but Recommended)
1. Navigate to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable desired providers:
   - **Google**: Click Google → Enable → Add your project support email
   - **Email/Password**: Click Email/Password → Enable

---

## Google Authentication Setup

### 1. Configure Google OAuth in Firebase Console

#### Enable Google Sign-in Provider
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Click **Enable** toggle
4. **Project support email**: Enter your project's support email
5. Click **Save**

#### Configure OAuth Consent Screen (Google Cloud Console)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Choose **External** user type (for public app) or **Internal** (for G Suite domain)
5. Fill in required fields:
   - **App name**: HomeTribe
   - **User support email**: Your support email
   - **Developer contact information**: Your email
6. Add **Authorized domains**: 
   - `localhost` (for development)
   - Your production domain (e.g., `hometribe.com`)
7. Save and continue through the scopes and test users sections

#### Configure OAuth Credentials
1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Your Firebase project should have automatically created OAuth 2.0 credentials
3. Click on the **Web client** credential
4. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/__/auth/handler` (for development)
   - `https://yourdomain.com/__/auth/handler` (for production)
6. Click **Save**

### 2. Additional Google Authentication Configuration

#### Custom OAuth Parameters (Optional)
You can configure additional OAuth parameters for Google sign-in:

```javascript
import { GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();

// Request additional scopes
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Set custom parameters
provider.setCustomParameters({
  prompt: 'select_account' // Always show account selector
});
```

#### Domain Restrictions (Optional)
If you want to restrict sign-in to specific domains:

```javascript
provider.setCustomParameters({
  hd: 'yourdomain.com' // Restrict to specific domain
});
```

### 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with nickname: "HomeTribe Web"
5. Copy the Firebase configuration object

---

## Installation and Configuration

### 1. Install Firebase SDK
```bash
cd C:\Users\rubar\Repositories\HomeTribe\my-tribe
npm install firebase
```

### 2. Install Additional Dependencies (if needed)
```bash
# For Firebase Admin SDK (server-side operations)
npm install firebase-admin

# For Firebase Functions (if using)
npm install firebase-functions
```

---

## Environment Variables

### 1. Create Environment File
Create `.env.local` in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Firebase Measurement ID (for Analytics)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Update .gitignore
Ensure `.env.local` is in your `.gitignore` file:
```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## Firebase Configuration

### 1. Create Firebase Configuration File
Create `src/lib/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

### 2. Create Database Service File
Create `src/lib/database.js`:

```javascript
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations
export const dbService = {
  // Create document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Read single document
  async getById(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Read all documents in collection
  async getAll(collectionName, orderByField = 'createdAt') {
    try {
      const q = query(collection(db, collectionName), orderBy(orderByField, 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  },

  // Update document
  async update(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { id: docId, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete document
  async delete(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Query with conditions
  async query(collectionName, conditions = [], orderByField = 'createdAt', limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Add ordering
      q = query(q, orderBy(orderByField, 'desc'));
      
      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  },

  // Real-time listener
  subscribe(collectionName, callback, conditions = []) {
    let q = collection(db, collectionName);
    
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    return onSnapshot(q, callback);
  }
};
```

---

## Database Structure

### Recommended Collection Structure for HomeTribe:

```
hometribe/
├── users/
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── photoURL: string
│   │   ├── socialAccounts: array
│   │   ├── preferences: object
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
├── posts/
│   ├── {postId}/
│   │   ├── userId: string
│   │   ├── content: string
│   │   ├── platform: string
│   │   ├── socialAccountId: string
│   │   ├── status: string (draft, scheduled, published)
│   │   ├── scheduledFor: timestamp
│   │   ├── publishedAt: timestamp
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
├── socialAccounts/
│   ├── {accountId}/
│   │   ├── userId: string
│   │   ├── platform: string (google, apple, facebook, twitter, etc.)
│   │   ├── accountUsername: string
│   │   ├── accessToken: string (encrypted)
│   │   ├── refreshToken: string (encrypted)
│   │   ├── isActive: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
└── analytics/
    ├── {analyticsId}/
    │   ├── userId: string
    │   ├── postId: string
    │   ├── platform: string
    │   ├── metrics: object
    │   ├── date: timestamp
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    └── ...
```

---

## Implementation Examples

### 1. User Management
Create `src/lib/userService.js`:

```javascript
import { dbService } from './database';
import { auth } from './firebase';

export const userService = {
  async createUser(userData) {
    return await dbService.create('users', userData);
  },

  async getUserById(userId) {
    return await dbService.getById('users', userId);
  },

  async updateUser(userId, userData) {
    return await dbService.update('users', userId, userData);
  },

  async getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
      return await this.getUserById(user.uid);
    }
    return null;
  },

  async getUserByEmail(email) {
    const users = await dbService.query('users', [
      { field: 'email', operator: '==', value: email }
    ]);
    return users.length > 0 ? users[0] : null;
  }
};
```

### 2. Posts Management
Create `src/lib/postService.js`:

```javascript
import { dbService } from './database';

export const postService = {
  async createPost(postData) {
    return await dbService.create('posts', postData);
  },

  async getUserPosts(userId) {
    return await dbService.query('posts', [
      { field: 'userId', operator: '==', value: userId }
    ]);
  },

  async updatePost(postId, postData) {
    return await dbService.update('posts', postId, postData);
  },

  async deletePost(postId) {
    return await dbService.delete('posts', postId);
  },

  async getScheduledPosts() {
    return await dbService.query('posts', [
      { field: 'status', operator: '==', value: 'scheduled' },
      { field: 'scheduledFor', operator: '<=', value: new Date() }
    ]);
  }
};
```

### 3. React Hook for Real-time Data
Create `src/hooks/useFirestore.js`:

```javascript
import { useState, useEffect } from 'react';
import { dbService } from '../lib/database';

export function useFirestore(collectionName, conditions = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = dbService.subscribe(
      collectionName,
      (snapshot) => {
        try {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(documents);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      },
      conditions
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(conditions)]);

  return { data, loading, error };
}
```

---

---

## Google Authentication Integration

### 1. Authentication Service Setup

Create `src/lib/authService.js`:

```javascript
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';
import { userService } from './userService';

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const authService = {
  // Google Sign-in with Popup
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get additional user info from Google
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // Create or update user profile in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        googleAccessToken: token,
        emailVerified: user.emailVerified,
        socialAccounts: [{
          platform: 'google',
          accountId: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }],
        lastLoginAt: new Date(),
        preferences: {
          theme: 'auto',
          notifications: true
        }
      };
      
      // Check if user exists, create or update
      const existingUser = await userService.getUserById(user.uid);
      if (existingUser) {
        await userService.updateUser(user.uid, {
          lastLoginAt: new Date(),
          photoURL: user.photoURL,
          displayName: user.displayName
        });
      } else {
        await userService.createUser(userData);
      }
      
      return { user, userData };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Google Sign-in with Redirect (for mobile or popup-blocked environments)
  async signInWithGoogleRedirect() {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google redirect sign-in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Handle redirect result
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        // Same user data creation logic as popup
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          googleAccessToken: credential.accessToken,
          emailVerified: user.emailVerified,
          lastLoginAt: new Date()
        };
        
        const existingUser = await userService.getUserById(user.uid);
        if (!existingUser) {
          await userService.createUser(userData);
        }
        
        return { user, userData };
      }
      return null;
    } catch (error) {
      console.error('Redirect result error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Email/Password Sign Up
  async signUpWithEmail(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || '',
        photoURL: '',
        provider: 'email',
        emailVerified: user.emailVerified,
        socialAccounts: [],
        lastLoginAt: new Date(),
        preferences: {
          theme: 'auto',
          notifications: true
        }
      };
      
      await userService.createUser(userData);
      return { user, userData };
    } catch (error) {
      console.error('Email sign up error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Email/Password Sign In
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update last login
      await userService.updateUser(user.uid, {
        lastLoginAt: new Date()
      });
      
      return { user };
    } catch (error) {
      console.error('Email sign in error:', error);
      throw this.handleAuthError(error);
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Auth State Observer
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Error handling
  handleAuthError(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        return new Error('An account already exists with the same email address but different sign-in credentials.');
      case 'auth/auth-domain-config-required':
        return new Error('Authentication domain configuration is required.');
      case 'auth/cancelled-popup-request':
        return new Error('Sign-in popup was cancelled.');
      case 'auth/operation-not-allowed':
        return new Error('Google sign-in is not enabled for this project.');
      case 'auth/operation-not-supported-in-this-environment':
        return new Error('This operation is not supported in the current environment.');
      case 'auth/popup-blocked':
        return new Error('Sign-in popup was blocked by the browser.');
      case 'auth/popup-closed-by-user':
        return new Error('Sign-in popup was closed before completing the sign-in.');
      case 'auth/unauthorized-domain':
        return new Error('This domain is not authorized for OAuth operations.');
      case 'auth/user-disabled':
        return new Error('This user account has been disabled.');
      case 'auth/email-already-in-use':
        return new Error('The email address is already in use by another account.');
      case 'auth/invalid-email':
        return new Error('The email address is not valid.');
      case 'auth/weak-password':
        return new Error('The password is too weak.');
      default:
        return new Error(errorMessage || 'An authentication error occurred.');
    }
  }
};
```

### 2. Auth Context Provider

Create `src/contexts/AuthContext.js`:

```javascript
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
        setLoading(false);
      }
    });

    // Handle redirect result on app load
    authService.handleRedirectResult().catch(err => {
      console.error('Redirect result error:', err);
      setError(err.message);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signInWithGoogle();
      return result;
    } catch (err) {
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
```

### 3. Updated Signup Page Implementation

Update `src/app/signup/page.js`:

```javascript
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Icon components (keep existing GoogleIcon and AppleIcon)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignUp() {
  const { signInWithGoogle, signUpWithEmail, loading, error } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [formError, setFormError] = useState('');

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error) {
      console.error('Google sign up failed:', error);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName);
      router.push('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error) {
      console.error('Email sign up failed:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Join HomeTribe
          </h1>
          <p className="text-xs sm:text-sm opacity-80 px-2" style={{ color: 'var(--foreground)' }}>
            Connect all your social platforms in one place
          </p>
        </div>

        {/* Sign Up Card */}
        <div 
          className="p-6 sm:p-8 rounded-xl shadow-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center" style={{ color: 'var(--card-text)' }}>
            Get Started
          </h2>
          
          {/* Error Display */}
          {(error || formError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
              <p className="text-red-700 text-sm">{error || formError}</p>
            </div>
          )}
          
          {/* Social Sign Up Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="signup-btn-google w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: '#4285F4',
                color: 'var(--card-text)',
                background: 'var(--card-bg)',
              }}
            >
              <div className="social-login-icon">
                <GoogleIcon />
              </div>
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
            <span className="px-3 text-sm" style={{ color: 'var(--card-text)' }}>or</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <input
                type="text"
                name="displayName"
                placeholder="Full Name (optional)"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                }}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                }}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center mt-4 opacity-70" style={{ color: 'var(--card-text)' }}>
            By signing up, you agree to our{' '}
            <a href="#" className="underline hover:opacity-100">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:opacity-100">Privacy Policy</a>
          </p>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            Already have an account?{' '}
            <a href="/signin" className="font-semibold underline hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 4. Layout Integration

Update `src/app/layout.js` to include the AuthProvider:

```javascript
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen transition-colors duration-300 overflow-hidden`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen w-full overflow-hidden">
            <AppHeader />
            <main className="flex-1 w-full overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16">
              {children}
            </main>
            <AppFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 5. Protected Routes

Create `src/components/ProtectedRoute.js`:

```javascript
'use client';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
```

---

## Security Rules

### Set up Firestore Security Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own posts
    match /posts/{postId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can read and write their own social accounts
    match /socialAccounts/{accountId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can read and write their own analytics
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Best Practices

### 1. Error Handling
- Always wrap Firebase operations in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging

### 2. Data Validation
- Validate data on both client and server side
- Use Firebase Security Rules for server-side validation
- Implement form validation for user inputs

### 3. Performance Optimization
- Use pagination for large datasets
- Implement proper indexing in Firestore
- Cache frequently accessed data
- Use real-time listeners sparingly

### 4. Security
- Never store sensitive data in plain text
- Use Firebase Security Rules effectively
- Implement proper authentication checks
- Encrypt sensitive tokens before storing

### 5. Cost Optimization
- Monitor read/write operations
- Use compound queries efficiently
- Implement proper data archiving strategies
- Optimize security rules to prevent unnecessary reads

---

## Troubleshooting

### Common Issues:

1. **"Firebase App not initialized"**
   - Ensure environment variables are properly set
   - Check if firebase.js is imported correctly

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify user permissions

3. **"Network error"**
   - Check internet connectivity
   - Verify Firebase project configuration
   - Check if Firestore is enabled

4. **Environment variables not loading**
   - Ensure `.env.local` is in the correct location
   - Restart the development server
   - Check variable names have `NEXT_PUBLIC_` prefix

### Google Authentication Specific Issues:

5. **"Operation not allowed" (Google Sign-in)**
   - Ensure Google provider is enabled in Firebase Console
   - Check that OAuth consent screen is configured
   - Verify project support email is set

6. **"Unauthorized domain" error**
   - Add your domain to authorized domains in Firebase Console
   - For localhost: Add `localhost` to authorized domains
   - For production: Add your actual domain

7. **"Popup blocked" error**
   - Use `signInWithRedirect` instead of `signInWithPopup`
   - Inform users to allow popups for your site
   - Implement fallback to redirect method

8. **"Invalid OAuth client" error**
   - Check OAuth credentials in Google Cloud Console
   - Ensure authorized JavaScript origins are correct
   - Verify authorized redirect URIs include Firebase auth handler

9. **"Access blocked" or consent screen issues**
   - Complete OAuth consent screen configuration
   - Ensure app is published (for external users)
   - Check scopes are properly configured

10. **"Account exists with different credential"**
    - Implement account linking functionality
    - Guide users to sign in with their original method first
    - Use Firebase Auth to link accounts

### Debug Tips:
- Use Firebase Emulator Suite for local development
- Enable debug logging: `firebase.auth().settings.appVerificationDisabledForTesting = true`
- Check browser console for detailed error messages
- Use Firebase Console to monitor authentication events
- Test Google sign-in in incognito mode to avoid cached credentials
- Verify OAuth scopes in the Google Cloud Console
- Check network tab for failed authentication requests

### Testing Checklist:

#### Development Environment:
- [ ] Firebase project created and configured
- [ ] Google OAuth provider enabled
- [ ] OAuth consent screen configured
- [ ] Authorized domains include `localhost`
- [ ] Environment variables properly set
- [ ] Development server running on correct port

#### Production Environment:
- [ ] Production domain added to authorized domains
- [ ] OAuth consent screen published
- [ ] Production environment variables set
- [ ] HTTPS enabled (required for OAuth)
- [ ] Privacy policy and terms of service links working

#### User Experience Testing:
- [ ] Google sign-in popup works
- [ ] Redirect fallback works when popup is blocked
- [ ] Error messages are user-friendly
- [ ] Loading states are displayed during auth
- [ ] User profile data is correctly saved to Firestore
- [ ] Sign-out functionality works properly

---

## Next Steps

1. **Set up environment variables** with your Firebase configuration
2. **Install required packages** using npm: `npm install firebase`
3. **Configure Google OAuth** in Google Cloud Console
4. **Create the Firebase configuration files** in `src/lib/`
5. **Implement AuthProvider** in your app layout
6. **Update your signup page** to use Google authentication
7. **Set up Firestore security rules** in Firebase Console
8. **Test Google sign-in** in both development and production
9. **Implement protected routes** for authenticated content
10. **Test the complete authentication flow**

---

## Additional Resources

### Firebase Documentation
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Google Sign-in for Web](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

### Google OAuth Documentation
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)

### Next.js Integration
- [Next.js with Firebase](https://firebase.google.com/docs/hosting/nextjs)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [React Context for Authentication](https://react.dev/reference/react/useContext)

### Testing and Development
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firebase Local Emulator UI](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)

---

**Last Updated**: August 2025  
**Version**: 2.0 - Added comprehensive Google Authentication integration
