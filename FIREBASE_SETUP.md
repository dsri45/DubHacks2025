# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "dubhacks2025")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Add Your App to Firebase

1. In your Firebase project, click "Add app"
2. Select the web icon (</>) to add a web app
3. Enter your app nickname (e.g., "DubHacks2025 App")
4. Click "Register app"
5. Copy the Firebase configuration object

## 3. Update Firebase Configuration

1. Open `config/firebase.ts` in your project
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 4. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## 5. Test Your Setup

1. Run your app: `npx expo start`
2. Try creating a new account
3. Try logging in with the created account
4. Check Firebase Console > Authentication > Users to see registered users

## Features Included

- ✅ Firebase Authentication (Email/Password)
- ✅ Firestore Database (ready to use)
- ✅ Persistent login state
- ✅ Automatic user session management
- ✅ Cross-platform compatibility (iOS/Android)

## Next Steps

- Add Firestore data storage
- Implement user profiles
- Add real-time features
- Set up security rules
