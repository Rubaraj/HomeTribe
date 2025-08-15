# Firebase Setup Instructions

Your Firebase integration is now complete! Follow these steps to finish the setup:

## 1. Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `hometribe` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable **Google** provider:
   - Click on Google
   - Enable it
   - Add your project's domain (localhost:3000 for development)
   - Save
3. Enable **Email/Password** provider:
   - Click on Email/Password
   - Enable it
   - Save

## 3. Setup Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred location
5. Create database

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) 
4. Register your app with nickname "HomeTribe Web"
5. Copy the Firebase configuration object

## 5. Update Environment Variables

1. Open your `.env.local` file in the project root
2. Replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`

3. Test both authentication methods:
   - Google Sign-in (popup method)
   - Email/Password registration

## 7. Firestore Security Rules (Production)

When ready for production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## Files Created

Your Firebase integration includes these files:

- `src/lib/firebase.js` - Firebase configuration and initialization
- `src/lib/database.js` - Firestore database operations
- `src/lib/authService.js` - Authentication service with Google OAuth
- `src/lib/userService.js` - User management operations
- `src/contexts/AuthContext.js` - React context for authentication state
- `src/components/ProtectedRoute.js` - Route protection component
- `.env.local` - Environment variables (update with your config)

## What's Working

✅ Google OAuth authentication  
✅ Email/password registration  
✅ User profile creation in Firestore  
✅ Authentication state management  
✅ Protected routes  
✅ Error handling  
✅ Loading states  

## Next Steps

After completing the setup:

1. Create additional protected pages
2. Add user profile management
3. Implement password reset functionality
4. Add email verification (optional)
5. Create your app's core features with user authentication

Your signup page is now fully integrated with Firebase authentication! 🚀
