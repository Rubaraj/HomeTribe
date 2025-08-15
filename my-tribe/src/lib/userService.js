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
