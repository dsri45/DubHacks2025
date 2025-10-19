# 🎥 Video Calling Setup Guide

## **📋 Prerequisites**

1. **Agora.io Account**: Sign up at [console.agora.io](https://console.agora.io/)
2. **React Native Development Environment**: Already set up
3. **Expo/React Native CLI**: Already configured

## **🚀 Step-by-Step Setup**

### **1. Get Agora App ID**

1. Go to [Agora Console](https://console.agora.io/)
2. Sign up for a free account
3. Create a new project:
   - Project Name: "DubHacks2025 Video Calling"
   - Authentication: "App ID" (for development)
4. Copy your **App ID** from the project dashboard

### **2. Configure Your App**

1. Open `config/agora.ts`
2. Replace `YOUR_AGORA_APP_ID` with your actual App ID:
   ```typescript
   export const AGORA_CONFIG = {
     APP_ID: 'your-actual-app-id-here',
     // ... rest of config
   };
   ```

### **3. Install Dependencies**

The following packages are already installed:
- ✅ `react-native-agora` - Agora SDK
- ✅ `expo-av` - Audio/Video support

### **4. Platform-Specific Setup**

#### **For iOS (if building native):**
```bash
cd ios && pod install
```

#### **For Android (if building native):**
Add permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### **5. Test the Implementation**

1. **Start your app**: `npx expo start`
2. **Navigate to Courses tab**
3. **Select a course** to view details
4. **Tap the call button** (📞) in the course details
5. **Confirm the video call** in the alert dialog
6. **Test video calling** between two devices/users

## **🎯 How It Works**

### **Video Call Flow:**
1. **User taps call button** → Confirmation dialog appears
2. **User confirms** → Video call component loads
3. **Agora SDK initializes** → Connects to Agora servers
4. **Users join channel** → Video/audio streams start
5. **Real-time communication** → Users can see/hear each other
6. **Call ends** → Returns to course details

### **Channel Naming:**
- Each course gets a unique channel: `course-{courseId}`
- Both teacher and student join the same channel
- Channel names are automatically generated

### **User Roles:**
- **Teacher**: Broadcaster (can send video/audio)
- **Student**: Audience (can receive video/audio)
- Both can switch roles during the call

## **🔧 Features Included**

### **✅ Video Calling Features:**
- **HD Video**: Up to 720p quality
- **Audio**: High-quality voice communication
- **Mute/Unmute**: Toggle microphone
- **Video On/Off**: Toggle camera
- **End Call**: Terminate video session
- **Multiple Users**: Support for group calls
- **Real-time**: Low latency communication

### **✅ UI Features:**
- **Local Video**: Picture-in-picture view
- **Remote Video**: Full-screen remote user
- **Call Controls**: Intuitive button layout
- **Status Display**: Connection status and channel info
- **Loading States**: Smooth user experience

## **🛠️ Customization Options**

### **Video Quality:**
```typescript
// In config/agora.ts
VIDEO_PROFILE: '720p', // Change to 480p, 360p, etc.
```

### **Audio Quality:**
```typescript
// In config/agora.ts
AUDIO_PROFILE: 'music_standard', // Change to music_high_quality, etc.
```

### **UI Styling:**
- Modify `components/VideoCall.tsx` styles
- Customize colors, layouts, button designs
- Add your app's branding

## **🔒 Security & Production**

### **For Development:**
- ✅ App ID authentication (current setup)
- ✅ Free tier: 10,000 minutes/month

### **For Production:**
1. **Enable Token Authentication**:
   - Generate tokens on your server
   - Implement token refresh logic
   - Update `AGORA_CONFIG.TOKEN`

2. **Server-Side Token Generation**:
   ```javascript
   // Example token generation (Node.js)
   const Agora = require('agora-access-token');
   const token = Agora.RtcTokenBuilder.buildTokenWithUid(
     appId, appCertificate, channelName, uid, role, privilegeExpiredTs
   );
   ```

## **🐛 Troubleshooting**

### **Common Issues:**

1. **"Failed to initialize Agora"**
   - Check your App ID is correct
   - Ensure internet connection
   - Verify Agora account is active

2. **"No video/audio"**
   - Check device permissions
   - Ensure microphone/camera access
   - Test on different devices

3. **"Can't join channel"**
   - Verify channel name format
   - Check network connectivity
   - Ensure App ID is valid

### **Debug Mode:**
Enable console logs in `components/VideoCall.tsx`:
```typescript
console.log('Agora events:', event);
```

## **📱 Testing**

### **Test Scenarios:**
1. **Same Device**: Use two different browsers/apps
2. **Different Devices**: Test on iOS/Android
3. **Network Conditions**: Test on WiFi/cellular
4. **Multiple Users**: Test group calls
5. **Call Quality**: Test audio/video quality

### **Test Users:**
- Create multiple test accounts
- Enroll in the same course
- Test teacher-student communication

## **💰 Pricing**

### **Agora Free Tier:**
- **10,000 minutes/month** free
- **100 concurrent users** max
- **Perfect for development/testing**

### **Production Pricing:**
- **$0.99 per 1,000 minutes** after free tier
- **Volume discounts** available
- **Enterprise plans** for large scale

## **🎉 You're Ready!**

Your video calling feature is now fully integrated! Users can:
- ✅ Start video calls from course details
- ✅ See and hear each other in real-time
- ✅ Control audio/video during calls
- ✅ End calls and return to course view

**Next Steps:**
1. Get your Agora App ID
2. Update the configuration
3. Test with multiple devices
4. Deploy to production when ready!

---

**Need Help?**
- [Agora Documentation](https://docs.agora.io/)
- [React Native Agora Guide](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native)
- [Agora Community](https://www.agora.io/en/community/)
