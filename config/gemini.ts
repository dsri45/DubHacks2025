// Gemini AI Configuration
// Get your API key from: https://makersuite.google.com/app/apikey

export const GEMINI_CONFIG = {
  // Replace with your actual Gemini API key
  API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyCzaY5FsEkCechHRLbzu3mPoH3eF-tqARg',
  
  // Model configuration
  MODEL: 'gemini-2.0-flash',
  
  // Translation settings
  TRANSLATION: {
    TARGET_LANGUAGE: 'English',
    CONFIDENCE_THRESHOLD: 0.7,
    MAX_RETRIES: 3,
    TIMEOUT: 10000 // 10 seconds
  }
};

// Instructions for setting up Gemini API:
// 1. Go to https://makersuite.google.com/app/apikey
// 2. Create a new API key
// 3. Add it to your environment variables as EXPO_PUBLIC_GEMINI_API_KEY
// 4. Or replace 'your_gemini_api_key_here' with your actual key

export default GEMINI_CONFIG;
