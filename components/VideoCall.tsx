import { CameraView, useCameraPermissions } from 'expo-camera';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

interface VideoCallProps {
  channelName: string;
  userId: number;
  onCallEnd: () => void;
  isTeacher?: boolean;
}

interface CallParticipant {
  id: string;
  name: string;
  isTeacher: boolean;
  joinedAt: Date;
  isActive: boolean;
  userId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  channelName,
  userId,
  onCallEnd,
  isTeacher = false,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('');
  const [otherParticipant, setOtherParticipant] = useState<CallParticipant | null>(null);
  const [showWebRTC, setShowWebRTC] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  
  const cameraRef = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start call duration timer
  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  // Request camera permission and join call
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    } else {
      joinCall();
    }
  }, [permission]);

  // Listen for participants joining/leaving
  useEffect(() => {
    if (!channelName) return;

    const participantsRef = collection(db, 'videoCallParticipants');
    const q = query(
      participantsRef,
      where('roomId', '==', channelName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const participantsList: CallParticipant[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        participantsList.push({
          id: doc.id,
          name: data.name,
          isTeacher: data.isTeacher,
          joinedAt: data.joinedAt.toDate(),
          isActive: data.isActive,
          userId: data.userId
        });
      });
      
      // Sort by joinedAt on client side
      participantsList.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
      setParticipants(participantsList);
      
      // Find the other participant (not current user)
      const other = participantsList.find(p => p.userId !== userId.toString());
      setOtherParticipant(other || null);
      
      // If we have 2 participants, start WebRTC
      if (participantsList.length >= 2) {
        setIsConnected(true);
        setShowWebRTC(true);
      }
    });

    return () => unsubscribe();
  }, [channelName, userId]);

  // Listen for WebRTC signaling messages
  useEffect(() => {
    if (!channelName || !otherParticipant) return;

    const signalingRef = collection(db, 'videoCallSignaling');
    const q = query(
      signalingRef,
      where('roomId', '==', channelName),
      where('to', '==', userId.toString())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Received signaling data:', data);
        
            // Note: Signaling data would be handled by native WebRTC implementation
        
        // Delete the signaling message after processing
        deleteDoc(doc.ref);
      });
    });

    return () => unsubscribe();
  }, [channelName, userId, otherParticipant]);

  const joinCall = async () => {
    try {
      // Add current user to participants
      const participantData = {
        roomId: channelName,
        userId: userId.toString(),
        name: isTeacher ? 'Teacher' : 'Student',
        isTeacher,
        joinedAt: new Date(),
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, 'videoCallParticipants'), participantData);
      setCurrentParticipantId(docRef.id);
      setIsConnected(true);
    } catch (error) {
      console.error('Error joining call:', error);
      Alert.alert('Error', 'Failed to join video call');
    }
  };

  const leaveCall = async () => {
    try {
      if (currentParticipantId) {
        // Mark current user as inactive
        await updateDoc(doc(db, 'videoCallParticipants', currentParticipantId), {
          isActive: false
        });
      }
      onCallEnd();
    } catch (error) {
      console.error('Error leaving call:', error);
      onCallEnd();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log('Microphone:', isMuted ? 'ON' : 'OFF');
    // Note: Audio control would need to be implemented with native audio APIs
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    console.log('Camera:', isVideoEnabled ? 'OFF' : 'ON');
    // Note: Video control would need to be implemented with camera APIs
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: leaveCall
        }
      ]
    );
  };

  const sendSignalingData = async (signalingData: any) => {
    try {
      await addDoc(collection(db, 'videoCallSignaling'), signalingData);
      console.log('Signaling data sent to Firebase:', signalingData);
    } catch (error) {
      console.error('Error sending signaling data:', error);
    }
  };

  const openGoogleMeet = async () => {
    try {
      // Create a Google Meet link with the channel name
      const meetUrl = `https://meet.google.com/${channelName}`;
      
      // Check if Google Meet app is installed
      const canOpen = await Linking.canOpenURL(meetUrl);
      
      if (canOpen) {
        await Linking.openURL(meetUrl);
      } else {
        // Fallback to web version
        const webMeetUrl = `https://meet.google.com/${channelName}`;
        await Linking.openURL(webMeetUrl);
      }
    } catch (error) {
      console.error('Error opening Google Meet:', error);
      Alert.alert('Error', 'Could not open Google Meet. Please try again.');
    }
  };

  // Native camera implementation - no WebView needed

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera and microphone for video calling.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCallEnd}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show WebRTC interface when both participants are present
  if (showWebRTC && otherParticipant) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        
         {/* Embedded Google Meet WebView */}
         <WebView
           source={{ uri: `https://meet.google.com/new` }}
           style={styles.webview}
           javaScriptEnabled={true}
           domStorageEnabled={true}
           allowsInlineMediaPlayback={true}
           mediaPlaybackRequiresUserAction={false}
           startInLoadingState={true}
           userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
           mixedContentMode="compatibility"
           thirdPartyCookiesEnabled={true}
           sharedCookiesEnabled={true}
           allowsBackForwardNavigationGestures={false}
           scrollEnabled={true}
           bounces={true}
           showsVerticalScrollIndicator={true}
           showsHorizontalScrollIndicator={false}
           nestedScrollEnabled={true}
           onLoadStart={() => {
             console.log('Google Meet loading...');
             setIsWebViewLoading(true);
           }}
           onLoadEnd={() => {
             console.log('Google Meet loaded!');
             setIsWebViewLoading(false);
           }}
           onError={(error) => console.error('WebView error:', error)}
           onNavigationStateChange={(navState) => {
             console.log('Navigation:', navState.url);
             
             // Check if user navigated away from Google Meet (call ended)
             if (!navState.url.includes('meet.google.com') && !navState.url.includes('accounts.google.com')) {
               console.log('User left Google Meet, ending call...');
               onCallEnd();
               return false;
             }
             
             // Block redirects to app stores and external apps
             if (navState.url.includes('app.goo.gl') || 
                 navState.url.includes('play.google.com') || 
                 navState.url.includes('apps.apple.com') ||
                 navState.url.includes('meet.app.goo.gl') ||
                 navState.url.includes('preview.app.goo.gl')) {
               console.log('Blocking redirect to:', navState.url);
               return false; // Block the navigation
             }
             
             // Allow Google Meet URLs
             if (navState.url.includes('meet.google.com')) {
               return true; // Allow Google Meet navigation
             }
             
             return false; // Block other external URLs
           }}
           injectedJavaScript={`
             // Monitor for call end events and optimize scrolling
             (function() {
               // Optimize Google Meet for mobile scrolling
               const style = document.createElement('style');
               style.textContent = \`
                 body { 
                   overflow-y: auto !important; 
                   -webkit-overflow-scrolling: touch !important;
                 }
                 .crqnQb, .VfPpkd-Bz112c-LgbsSe, .VfPpkd-LgbsSe { 
                   touch-action: manipulation !important;
                 }
                 .crqnQb { 
                   overflow-x: auto !important;
                   -webkit-overflow-scrolling: touch !important;
                 }
               \`;
               document.head.appendChild(style);
               
               // Listen for page unload (user closes tab or navigates away)
               window.addEventListener('beforeunload', function() {
                 console.log('Google Meet call ended - beforeunload');
                 window.ReactNativeWebView.postMessage('CALL_ENDED');
               });
               
               // Listen for visibility change (user switches tabs)
               document.addEventListener('visibilitychange', function() {
                 if (document.hidden) {
                   console.log('Google Meet call ended - visibility change');
                   window.ReactNativeWebView.postMessage('CALL_ENDED');
                 }
               });
               
               // Monitor for Google Meet specific call end indicators
               const observer = new MutationObserver(function(mutations) {
                 mutations.forEach(function(mutation) {
                   // Check if call ended by looking for specific elements or text
                   const callEndedElements = document.querySelectorAll('[data-call-ended], .call-ended, [aria-label*="call ended"], [aria-label*="left the meeting"]');
                   if (callEndedElements.length > 0) {
                     console.log('Google Meet call ended - detected call end element');
                     window.ReactNativeWebView.postMessage('CALL_ENDED');
                   }
                 });
               });
               
               // Start observing
               observer.observe(document.body, {
                 childList: true,
                 subtree: true
               });
               
               console.log('Google Meet call monitoring and scroll optimization initialized');
             })();
           `}
           onMessage={(event) => {
             const message = event.nativeEvent.data;
             console.log('WebView message:', message);
             
             if (message === 'CALL_ENDED') {
               console.log('Call ended detected from Google Meet, navigating back...');
               onCallEnd();
             }
           }}
         />
         
         {/* Loading overlay */}
         {isWebViewLoading && (
           <View style={styles.loadingOverlay}>
             <ActivityIndicator size="large" color="#4285f4" />
             <Text style={styles.loadingText}>Starting Google Meet...</Text>
           </View>
         )}
         
      </View>
    );
  }

  // Show waiting screen while waiting for other participant
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Main Video Area - Your Camera */}
      {isVideoEnabled ? (
        <CameraView
          ref={cameraRef}
          style={styles.mainCamera}
          facing="front"
          mode="video"
        />
      ) : (
        <View style={styles.cameraOffContainer}>
          <Text style={styles.cameraOffIcon}>📷</Text>
          <Text style={styles.cameraOffText}>Your Camera is Off</Text>
        </View>
      )}

      {/* Other Participant Info */}
      <View style={styles.remoteVideoContainer}>
        {otherParticipant ? (
          <View style={styles.remoteVideoPlaceholder}>
            <Text style={styles.remoteVideoIcon}>👤</Text>
            <Text style={styles.remoteVideoLabel}>
              {otherParticipant.name}
            </Text>
            <Text style={styles.remoteVideoSubtext}>
              {otherParticipant.isTeacher ? 'Teacher' : 'Student'}
            </Text>
            <View style={styles.connectionIndicator}>
              <View style={styles.connectionDot} />
              <Text style={styles.connectionText}>Connected</Text>
            </View>
            <Text style={styles.videoCallNote}>
              Starting video call...
            </Text>
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingIcon}>⏳</Text>
            <Text style={styles.waitingText}>Waiting for {isTeacher ? 'student' : 'teacher'}...</Text>
             <Text style={styles.waitingSubtext}>
               Google Meet will start when both join
             </Text>
          </View>
        )}
      </View>

      {/* Call Status Overlay */}
      <View style={styles.statusOverlay}>
        <View style={styles.statusInfo}>
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>
          <Text style={styles.durationText}>
            {formatDuration(callDuration)}
          </Text>
          <Text style={styles.roomText}>Room: {channelName}</Text>
          <Text style={styles.participantText}>
            Participants: {participants.length}/2
          </Text>
        </View>
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted ? styles.mutedButton : styles.unmutedButton]}
          onPress={toggleMute}
        >
          <Text style={styles.controlButtonText}>
            {isMuted ? '🎤' : '🔇'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isVideoEnabled ? styles.videoButton : styles.videoOffButton]}
          onPress={toggleVideo}
        >
          <Text style={styles.controlButtonText}>
            {isVideoEnabled ? '📹' : '📷'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Text style={styles.controlButtonText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Call Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {otherParticipant 
            ? `Connected with ${otherParticipant.name}` 
            : `Waiting for ${isTeacher ? 'student' : 'teacher'} to join...`
          }
        </Text>
         {!otherParticipant && (
           <Text style={styles.infoSubtext}>
             Google Meet will open when both participants join
           </Text>
         )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
   webview: {
     flex: 1,
     backgroundColor: '#000',
   },
   loadingOverlay: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: 'rgba(0, 0, 0, 0.8)',
     justifyContent: 'center',
     alignItems: 'center',
     zIndex: 1000,
   },
   loadingText: {
     color: '#fff',
     fontSize: 18,
     marginTop: 20,
     textAlign: 'center',
   },
  meetHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  meetTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meetSubtitle: {
    color: '#ccc',
    fontSize: 16,
  },
  meetContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  meetIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  meetIconText: {
    fontSize: 60,
  },
  meetDescription: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  meetInfo: {
    alignItems: 'flex-start',
  },
  meetInfoText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 8,
  },
  meetControls: {
    width: '100%',
    alignItems: 'center',
  },
  joinMeetButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
  },
  joinMeetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  endCallButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  endCallButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  remoteParticipantOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  remoteParticipantCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  remoteParticipantName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  remoteParticipantStatus: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  callInfoOverlay: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  callDuration: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roomInfo: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  overlayControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayButtonText: {
    fontSize: 24,
  },
  mainCamera: {
    flex: 1,
  },
  cameraOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraOffIcon: {
    fontSize: 100,
    marginBottom: 20,
  },
  cameraOffText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  remoteVideoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 140,
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  remoteVideoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 10,
  },
  remoteVideoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  remoteVideoLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  remoteVideoSubtext: {
    color: '#ccc',
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  videoCallNote: {
    color: '#FFD700',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  waitingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
    padding: 10,
  },
  waitingIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  waitingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  waitingSubtext: {
    color: '#ccc',
    fontSize: 8,
    textAlign: 'center',
  },
  statusOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    minWidth: 200,
  },
  statusInfo: {
    alignItems: 'center',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  durationText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  roomText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  participantText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  unmutedButton: {
    backgroundColor: '#4CAF50',
  },
  mutedButton: {
    backgroundColor: '#F44336',
  },
  videoButton: {
    backgroundColor: '#2196F3',
  },
  videoOffButton: {
    backgroundColor: '#FF9800',
  },
  controlButtonText: {
    fontSize: 24,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 230,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});