// Daily.co Configuration for Video Calling
// Get your API key from: https://dashboard.daily.co/

export const DAILY_CONFIG = {
  // Replace with your actual Daily.co API key
  API_KEY: 'YOUR_DAILY_API_KEY',
  
  // Domain for your Daily.co rooms
  DOMAIN: 'dubhacks25.daily.co',
  
  // Default room settings
  ROOM_SETTINGS: {
    max_participants: 2,
    enable_recording: false,
    enable_screenshare: false,
    enable_chat: true,
    enable_knocking: false,
    enable_prejoin_ui: false,
  },
  
  // Video quality settings
  VIDEO_QUALITY: 'high', // low, medium, high
  AUDIO_QUALITY: 'high', // low, medium, high
};

// Instructions for getting your Daily.co API key:
// 1. Go to https://dashboard.daily.co/
// 2. Sign up for a free account
// 3. Create a new project
// 4. Copy the API key and replace 'YOUR_DAILY_API_KEY' above
// 5. Set up your domain (e.g., dubhacks25.daily.co)
