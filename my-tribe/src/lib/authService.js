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
      const token = credential?.accessToken;
      
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
          googleAccessToken: credential?.accessToken,
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
