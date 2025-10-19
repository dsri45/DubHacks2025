// Agora.io Configuration
// Get your App ID from: https://console.agora.io/

export const AGORA_CONFIG = {
  // Replace with your actual Agora App ID
  APP_ID: '6df9e10ce6cc491e9cd6d63d12c156bc',
  
  // Optional: Token for production (leave empty for development)
  TOKEN: '',
  
  // Channel settings
  CHANNEL_PROFILE: 'communication', // or 'live'
  
  // Video settings
  VIDEO_PROFILE: '720p', // 720p, 480p, 360p, etc.
  
  // Audio settings
  AUDIO_PROFILE: 'music_standard', // music_standard, music_high_quality, etc.
};

// Instructions for getting your App ID:
// 1. Go to https://console.agora.io/
// 2. Sign up for a free account
// 3. Create a new project
// 4. Copy the App ID and replace 'YOUR_AGORA_APP_ID' above
// 5. For production, you'll also need to generate tokens for security
