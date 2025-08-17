import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { dbService } from './database';

export const userService = {
  async createUser(userData) {
    try {
      // Use the user's UID as the document ID for easier lookups
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: userData.uid, ...userData };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
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

// Export individual functions for easier imports
export const createUser = userService.createUser.bind(userService);
export const getUserById = userService.getUserById.bind(userService);
export const updateUser = userService.updateUser.bind(userService);
export const getCurrentUser = userService.getCurrentUser.bind(userService);
export const getUserByEmail = userService.getUserByEmail.bind(userService);

// New function specifically for profile updates
export const updateUserProfile = async (userId, profileData) => {
  try {
    return await userService.updateUser(userId, {
      ...profileData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to check if user profile is complete
export const isProfileComplete = async (userId) => {
  try {
    if (!userId) {
      console.warn('isProfileComplete called without userId');
      return false;
    }
    
    const user = await userService.getUserById(userId);
    if (!user) {
      console.log('User document not found for userId:', userId);
      return false;
    }
    
    return user.profileCompleted || false;
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
};
