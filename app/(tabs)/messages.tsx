import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { VideoCall } from '../../components/VideoCall';
import { CourseRequest, courseRequestService, Enrollment, enrollmentService, Message, messagesService, usersService } from '../../services/firebaseService';
import { translateToEnglish } from '../../services/translationService';

// Remove CourseMessage interface - using Firebase Message instead

export default function CoursesScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [teachingEnrollments, setTeachingEnrollments] = useState<Enrollment[]>([]);
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Enrollment | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [courseMessages, setCourseMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'teaching' | 'requests'>('enrolled');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  // Translation state
  const [messageTranslations, setMessageTranslations] = useState<{[messageId: string]: {
    translatedText: string;
    detectedLanguage: string;
    isTranslating: boolean;
    showTranslation: boolean;
  }}>({});
  
  // Store unsubscribe functions for cleanup
  const [unsubscribers, setUnsubscribers] = useState<(() => void)[]>([]);
  const [unsubscribeMessages, setUnsubscribeMessages] = useState<(() => void) | null>(null);

  // Manual loading functions (kept for debugging and fallback)
  const loadEnrollments = async () => {
    if (!user) return;
    try {
      const userEnrollments = await enrollmentService.getUserEnrollments(user.id);
      setEnrollments(userEnrollments);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const loadTeachingEnrollments = async () => {
    if (!user) return;
    try {
      const teachingEnrollments = await enrollmentService.getTeacherEnrollments(user.id);
      setTeachingEnrollments(teachingEnrollments);
    } catch (error) {
      console.error('Error loading teaching enrollments:', error);
    }
  };

  const loadCourseRequests = async () => {
    if (!user) return;
    try {
      const requests = await courseRequestService.getTeacherRequests(user.id);
      setCourseRequests(requests);
    } catch (error) {
      console.error('Error loading course requests:', error);
    }
  };

  // Set up real-time listeners when component mounts
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('Setting up real-time listeners for user:', user.id);
    setLoading(true);

    // Clean up existing listeners
    unsubscribers.forEach(unsubscribe => unsubscribe());
    setUnsubscribers([]);

    const newUnsubscribers: (() => void)[] = [];

    // Set up real-time listener for user enrollments
    const unsubscribeEnrollments = enrollmentService.subscribeToUserEnrollments(
      user.id,
      (enrollments) => {
        console.log('Real-time enrollments update:', enrollments);
        setEnrollments(enrollments);
        setLoading(false);
      }
    );
    newUnsubscribers.push(unsubscribeEnrollments);

    // Set up real-time listener for teaching enrollments
    const unsubscribeTeaching = enrollmentService.subscribeToTeacherEnrollments(
      user.id,
      (enrollments) => {
        console.log('Real-time teaching enrollments update:', enrollments);
        setTeachingEnrollments(enrollments);
      }
    );
    newUnsubscribers.push(unsubscribeTeaching);

    // Set up real-time listener for course requests
    const unsubscribeRequests = courseRequestService.subscribeToTeacherRequests(
      user.id,
      (requests) => {
        console.log('Real-time course requests update:', requests);
        setCourseRequests(requests);
      }
    );
    newUnsubscribers.push(unsubscribeRequests);

    setUnsubscribers(newUnsubscribers);

    // Cleanup function
    return () => {
      newUnsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user]);

  // Cleanup listeners when component unmounts
  useEffect(() => {
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [unsubscribers, unsubscribeMessages]);

  // Set up real-time messaging when a course is selected
  useEffect(() => {
    if (!selectedCourse || !user) {
      // Clean up existing message listener
      if (unsubscribeMessages) {
        unsubscribeMessages();
        setUnsubscribeMessages(null);
      }
      setCourseMessages([]);
      return;
    }

    console.log('Setting up real-time messages for course:', selectedCourse.id);
    
    // Clean up existing message listener
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }

    // Set up real-time listener for course messages
    const unsubscribe = messagesService.subscribeToCourseMessages(
      selectedCourse.id!,
      (messages) => {
        console.log('Real-time messages update:', messages);
        setCourseMessages(messages);
      }
    );

    setUnsubscribeMessages(() => unsubscribe);

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedCourse, user]);

  // Add a test enrollment for debugging
  const addTestEnrollment = async () => {
    if (!user) return;
    
    try {
      // Create a test enrollment
      const testEnrollment = {
        studentId: user.id,
        studentName: user.name || user.email || 'Test User',
        studentEmail: user.email || '',
        teacherId: 'test-teacher-id',
        teacherName: 'Test Teacher',
        teacherEmail: 'teacher@test.com',
        skillId: 'test-skill-id',
        skillTopic: 'Test Course',
        skillDescription: 'This is a test course for debugging',
        skillCost: 10,
        skillDuration: '1 hour',
        skillCategory: 'Test',
        skillImageUrl: '',
        skillSkills: ['Testing', 'Debugging'],
        skillLocation: 'Test Location',
        status: 'active' as const,
        enrolledAt: new Date(),
      };

      await enrollmentService.enrollInSkill(
        testEnrollment.studentId,
        testEnrollment.studentName,
        testEnrollment.studentEmail,
        {
          id: testEnrollment.skillId,
          userId: testEnrollment.teacherId,
          userName: testEnrollment.teacherName,
          userEmail: testEnrollment.teacherEmail,
          topic: testEnrollment.skillTopic,
          description: testEnrollment.skillDescription,
          cost: testEnrollment.skillCost,
          duration: testEnrollment.skillDuration,
          category: testEnrollment.skillCategory,
          imageUrl: testEnrollment.skillImageUrl,
          skills: testEnrollment.skillSkills,
          location: testEnrollment.skillLocation,
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
        } as any
      );
      
      Alert.alert('Success', 'Test enrollment added!');
      // Real-time listeners will automatically update the UI
    } catch (error) {
      console.error('Error adding test enrollment:', error);
      Alert.alert('Error', 'Failed to add test enrollment: ' + (error as Error)?.message);
    }
  };

  // Handle course request approval
  const handleApproveRequest = async (request: CourseRequest) => {
    try {
      // First, check if student has enough credits
      let student = await usersService.getUserById(request.studentId);
      if (!student) {
        // Student doesn't exist in Firestore yet, create them with default credits
        console.log('Student not found in Firestore, creating user with default credits');
        try {
          await usersService.createUserWithId(request.studentId, {
            name: request.studentName,
            email: request.studentEmail,
            bio: '',
            skillsHave: [],
            skillsWant: [],
            languages: ['English'],
            location: '',
            credits: 150, // Default starting credits
            avatarUrl: ''
          });
          student = await usersService.getUserById(request.studentId);
          if (!student) {
            Alert.alert('Error', 'Failed to create student profile');
            return;
          }
        } catch (error) {
          console.error('Error creating student:', error);
          Alert.alert('Error', 'Failed to create student profile');
          return;
        }
      }

      if (student.credits < request.skillCost) {
        Alert.alert('Insufficient Credits', `Student only has ${student.credits} credits but needs ${request.skillCost} credits for this course.`);
        return;
      }

      // Approve the request
      await courseRequestService.approveRequest(request.id!);
      
      // Deduct credits from student
      console.log(`Deducting ${request.skillCost} credits from student ${request.studentId}`);
      console.log(`Student current credits: ${student.credits}`);
      await usersService.updateUserCredits(request.studentId, -request.skillCost);
      console.log(`Student credits after deduction: ${student.credits - request.skillCost}`);
      
      // Ensure teacher exists in Firestore and add credits
      let teacher = await usersService.getUserById(request.teacherId);
      if (!teacher) {
        // Teacher doesn't exist in Firestore yet, create them
        console.log('Teacher not found in Firestore, creating user');
        try {
          await usersService.createUserWithId(request.teacherId, {
            name: request.teacherName,
            email: request.teacherEmail,
            bio: '',
            skillsHave: [],
            skillsWant: [],
            languages: ['English'],
            location: '',
            credits: 150, // Default starting credits
            avatarUrl: ''
          });
          teacher = await usersService.getUserById(request.teacherId);
        } catch (error) {
          console.error('Error creating teacher:', error);
          // Continue with credit update even if teacher creation fails
        }
      }
      
      // Add credits to teacher
      console.log(`Adding ${request.skillCost} credits to teacher ${request.teacherId}`);
      if (teacher) {
        console.log(`Teacher current credits: ${teacher.credits}`);
      }
      await usersService.updateUserCredits(request.teacherId, request.skillCost);
      console.log(`Teacher credits after addition: ${teacher ? teacher.credits + request.skillCost : 'unknown'}`);
      
      // Create a Skill object from the request data for enrollment
      const skillData = {
        id: request.skillId,
        userId: request.teacherId,
        userName: request.teacherName,
        userEmail: request.teacherEmail,
        topic: request.skillTopic,
        description: request.skillDescription,
        cost: request.skillCost,
        duration: request.skillDuration,
        category: request.skillCategory,
        imageUrl: request.skillImageUrl,
        skills: request.skillSkills,
        location: request.skillLocation,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };

      await enrollmentService.enrollInSkill(
        request.studentId,
        request.studentName,
        request.studentEmail,
        skillData as any
      );
      
      Alert.alert('Success', `Request approved! ${request.skillCost} credits transferred from student to teacher.`);
      // Real-time listeners will automatically update the UI
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve request: ' + (error as Error)?.message);
    }
  };

  // Handle course request decline
  const handleDeclineRequest = async (request: CourseRequest) => {
    try {
      await courseRequestService.declineRequest(request.id!);
      Alert.alert('Success', 'Request declined');
      // Real-time listeners will automatically update the UI
    } catch (error) {
      console.error('Error declining request:', error);
      Alert.alert('Error', 'Failed to decline request');
    }
  };

  // Add a test course request for debugging
  const addTestRequest = async () => {
    if (!user) return;
    
    try {
      // Create a mock skill for testing
      const mockSkill = {
        id: 'test-skill-request',
        topic: 'Test Course Request',
        description: 'This is a test course request for debugging',
        cost: 15,
        duration: '2 hours',
        category: 'Test',
        skills: ['Testing', 'Debugging', 'Requests'],
        location: 'Online',
        userId: user.id,
        userName: user.name || user.email || 'Test Teacher',
        userEmail: user.email || '',
        imageUrl: '',
        createdAt: new Date() as any,
        updatedAt: new Date() as any
      } as any;

      await courseRequestService.createCourseRequest(
        'test-student-id',
        'Test Student',
        'teststudent@example.com',
        mockSkill,
        'Hi! I would like to enroll in your test course. Please approve my request.'
      );
      
      Alert.alert('Success', 'Test request added!');
      // Real-time listeners will automatically update the UI
    } catch (error) {
      console.error('Error adding test request:', error);
      Alert.alert('Error', 'Failed to add test request: ' + (error as Error)?.message);
    }
  };

  const renderCourseCard = ({ item }: { item: Enrollment }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => setSelectedCourse(item)}
    >
      <View style={styles.courseCardContent}>
        <View style={styles.courseImageContainer}>
          {item.skillImageUrl ? (
            <Image source={{ uri: item.skillImageUrl }} style={styles.courseImage} />
          ) : (
            <View style={[styles.courseImagePlaceholder, { backgroundColor: '#FFE4E1' }]}>
              <Text style={styles.courseImageText}>📚</Text>
            </View>
          )}
        </View>
        
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.skillTopic}
            </Text>
          <Text style={[styles.teacherName, { color: Colors[colorScheme ?? 'light'].text }]}>
            by {item.teacherName}
          </Text>
          <View style={styles.courseDetails}>
            <Text style={[styles.courseDetail, { color: '#FF69B4' }]}>
              {item.skillCost} credits
            </Text>
            <Text style={[styles.courseDetail, { color: Colors[colorScheme ?? 'light'].text }]}>
              • {item.skillDuration}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }
            ]}>
              <Text style={styles.statusText}>
                {item.status === 'active' ? 'Active' : 'Completed'}
            </Text>
              </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => {
    const isSentByUser = message.senderId === user?.id;
    const timestamp = message.timestamp instanceof Date 
      ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const translation = message.id ? messageTranslations[message.id] : undefined;
    const displayText = translation?.showTranslation ? translation.translatedText : message.content;

    return (
    <View
      key={message.id}
      style={[
        styles.messageBubble,
          isSentByUser ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      <Text style={[
        styles.messageText,
          { color: isSentByUser ? 'white' : 'black' }
      ]}>
          {displayText}
      </Text>
        
        {/* Translation info */}
        {translation?.showTranslation && translation.detectedLanguage !== 'English' && (
          <Text style={[
            styles.translationInfo,
            { color: isSentByUser ? 'rgba(255,255,255,0.7)' : '#888' }
          ]}>
            Translated from {translation.detectedLanguage}
      </Text>
        )}
        
        {/* Message actions */}
        <View style={styles.messageActions}>
      <Text style={[
        styles.messageTime,
            { color: isSentByUser ? 'rgba(255,255,255,0.8)' : '#666' }
      ]}>
            {timestamp}
      </Text>
          
          {/* Translate button - only show for received messages */}
          {!isSentByUser && (
            <TouchableOpacity
              style={styles.translateButton}
              onPress={() => {
                console.log('Translate button pressed for message:', message.id);
                if (translation?.isTranslating || !message.id) {
                  console.log('Translation blocked - already translating or no message ID');
                  return;
                }
                if (translation?.translatedText) {
                  console.log('Toggling translation display');
                  toggleTranslation(message.id);
                } else {
                  console.log('Starting new translation');
                  translateMessage(message.id, message.content);
                }
              }}
              disabled={translation?.isTranslating}
            >
              {translation?.isTranslating ? (
                <ActivityIndicator size="small" color="#4285f4" />
              ) : (
                <Text style={styles.translateButtonText}>
                  {translation?.translatedText ? 
                    (translation.showTranslation ? 'Show Original' : 'Translate') : 
                    '🌐'
                  }
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
    </View>
  );
  };

  const handleSendMessage = async () => {
    if (!selectedCourse || !newMessage.trim() || !user) return;

    try {
      // Determine receiver ID based on whether user is student or teacher
      const receiverId = user.id === selectedCourse.studentId 
        ? selectedCourse.teacherId 
        : selectedCourse.studentId;

      const messageData = {
        senderId: user.id,
        receiverId: receiverId,
        content: newMessage.trim(),
        timestamp: new Date() as any,
        isRead: false,
        enrollmentId: selectedCourse.id!,
        senderName: user.name || user.email || 'Anonymous',
      };

      await messagesService.addMessage(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleCallTeacher = () => {
    if (!selectedCourse) return;
    
    Alert.alert(
      'Video Call',
      `Start video call with ${selectedCourse.teacherName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Call', 
          onPress: () => {
            setIsVideoCallActive(true);
          }
        }
      ]
    );
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
  };

  // Translation functions
  const translateMessage = async (messageId: string, messageContent: string) => {
    console.log('Starting translation for message:', messageId, messageContent);
    
    // Set translating state
    setMessageTranslations(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        isTranslating: true
      }
    }));

    try {
      console.log('Calling translateToEnglish...');
      const translationResult = await translateToEnglish(messageContent);
      console.log('Translation result:', translationResult);
      
      setMessageTranslations(prev => ({
        ...prev,
        [messageId]: {
          translatedText: translationResult.translatedText,
          detectedLanguage: translationResult.detectedLanguage,
          isTranslating: false,
          showTranslation: true
        }
      }));
      console.log('Translation state updated');
    } catch (error) {
      console.error('Translation error:', error);
      setMessageTranslations(prev => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          isTranslating: false
        }
      }));
    }
  };

  const toggleTranslation = (messageId: string) => {
    setMessageTranslations(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        showTranslation: !prev[messageId]?.showTranslation
      }
    }));
  };

  // Render teaching card (students enrolled in your courses)
  const renderTeachingCard = ({ item }: { item: Enrollment }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => setSelectedCourse(item)}
    >
      <View style={styles.courseCardContent}>
        <View style={styles.courseImageContainer}>
          {item.skillImageUrl ? (
            <Image source={{ uri: item.skillImageUrl }} style={styles.courseImage} />
          ) : (
            <View style={[styles.courseImagePlaceholder, { backgroundColor: '#FFE4E1' }]}>
              <Text style={styles.courseImageText}>📚</Text>
            </View>
          )}
        </View>
        
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.skillTopic}
          </Text>
          <Text style={[styles.teacherName, { color: Colors[colorScheme ?? 'light'].text }]}>
            Student: {item.studentName}
          </Text>
          <View style={styles.courseDetails}>
            <Text style={[styles.courseDetail, { color: '#FF69B4' }]}>
              {item.skillCost} credits
            </Text>
            <Text style={[styles.courseDetail, { color: Colors[colorScheme ?? 'light'].text }]}>
              • {item.skillDuration}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }
            ]}>
              <Text style={styles.statusText}>
                {item.status === 'active' ? 'Teaching' : 'Completed'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render request card (pending course requests)
  const renderRequestCard = ({ item }: { item: CourseRequest }) => (
    <View style={[styles.courseCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.courseCardContent}>
        <View style={styles.courseImageContainer}>
          {item.skillImageUrl ? (
            <Image source={{ uri: item.skillImageUrl }} style={styles.courseImage} />
          ) : (
            <View style={[styles.courseImagePlaceholder, { backgroundColor: '#FFE4E1' }]}>
              <Text style={styles.courseImageText}>📚</Text>
            </View>
          )}
        </View>
        
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.skillTopic}
          </Text>
          <Text style={[styles.teacherName, { color: Colors[colorScheme ?? 'light'].text }]}>
            Request from: {item.studentName}
          </Text>
          
          {item.message && (
            <Text style={[styles.courseDescription, { color: Colors[colorScheme ?? 'light'].text }]}>
              "{item.message}"
            </Text>
          )}
          
          <View style={styles.courseDetails}>
            <Text style={[styles.courseDetail, { color: '#FF69B4' }]}>
              {item.skillCost} credits
            </Text>
            <Text style={[styles.courseDetail, { color: Colors[colorScheme ?? 'light'].text }]}>
              • {item.skillDuration}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.statusText}>Pending</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={[styles.approveButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleApproveRequest(item)}
        >
          <Text style={styles.actionButtonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.declineButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleDeclineRequest(item)}
        >
          <Text style={styles.actionButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading your courses...
      </Text>
    </View>
  );
  }

  // Show video call if active
  if (isVideoCallActive && selectedCourse && user) {
    return (
      <VideoCall
        channelName={`course-${selectedCourse.id}`}
        userId={parseInt(user.id.replace(/\D/g, '').slice(-6)) || Math.floor(Math.random() * 100000)}
        onCallEnd={handleEndVideoCall}
        isTeacher={selectedCourse.teacherId === user.id}
      />
    );
  }

  if (selectedCourse) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Course Header */}
        <View style={[styles.courseHeader, { borderBottomColor: '#e0e0e0' }]}>
          <TouchableOpacity onPress={() => setSelectedCourse(null)}>
            <Text style={[styles.backButton, { color: '#FF69B4' }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.courseHeaderInfo}>
            <Text style={[styles.courseHeaderTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {selectedCourse.skillTopic}
            </Text>
            <Text style={[styles.courseHeaderTeacher, { color: Colors[colorScheme ?? 'light'].text }]}>
              with {selectedCourse.teacherName}
            </Text>
          </View>
        </View>

        {/* Course Info & Messages */}
        <ScrollView style={styles.courseInfoContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.courseInfoCard}>
            <Text style={[styles.courseInfoText, { color: '#333' }]}>
              {selectedCourse.skillDescription}
            </Text>
            
            <View style={styles.courseInfoRow}>
              <Text style={[styles.courseInfoLabel, { color: '#666' }]}>
                {selectedCourse.skillDuration} • {selectedCourse.skillCost} credits
              </Text>
            </View>
            
            <View style={styles.skillTags}>
              {selectedCourse.skillSkills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* Messages */}
          <View style={styles.messagesSection}>
            <Text style={[styles.messagesTitle, { color: '#333' }]}>
              Messages
            </Text>
            {courseMessages.length === 0 ? (
              <Text style={[styles.noMessagesText, { color: '#666' }]}>
                No messages yet. Start a conversation with your teacher!
              </Text>
            ) : (
              courseMessages.map(renderMessage)
            )}
          </View>
        </ScrollView>

        {/* Message Input */}
        <View style={[styles.inputContainer, { borderTopColor: '#e0e0e0' }]}>
          <TextInput
            style={[
              styles.messageInput,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }
            ]}
            placeholder="Message your teacher..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallTeacher}>
              <Text style={styles.callButtonText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          My Courses
        </Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enrolled' && styles.activeTab]}
            onPress={() => setActiveTab('enrolled')}
          >
            <Text style={[styles.tabText, activeTab === 'enrolled' && styles.activeTabText]}>
              Enrolled ({enrollments.length})
        </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'teaching' && styles.activeTab]}
            onPress={() => setActiveTab('teaching')}
          >
            <Text style={[styles.tabText, activeTab === 'teaching' && styles.activeTabText]}>
              Teaching ({teachingEnrollments.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Requests ({courseRequests.length})
        </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      {activeTab === 'enrolled' && (
        <>
          {enrollments.length === 0 ? (
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                You haven't enrolled in any courses yet.
              </Text>
              <Text style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].text }]}>
                Browse the Home tab to find skills you'd like to learn!
              </Text>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={addTestEnrollment}
              >
                <Text style={styles.testButtonText}>Add Test Course (Debug)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={enrollments}
              renderItem={renderCourseCard}
              keyExtractor={(item) => item.id!}
              contentContainerStyle={styles.coursesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === 'teaching' && (
        <>
          {teachingEnrollments.length === 0 ? (
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                No students enrolled in your courses yet.
        </Text>
              <Text style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].text }]}>
                Students will appear here when they enroll in your skills.
        </Text>
      </View>
          ) : (
            <FlatList
              data={teachingEnrollments}
              renderItem={renderTeachingCard}
              keyExtractor={(item) => item.id!}
              contentContainerStyle={styles.coursesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {courseRequests.length === 0 ? (
            <View style={styles.centered}>
              <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                No pending course requests.
              </Text>
              <Text style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].text }]}>
                Students will send requests to enroll in your courses.
              </Text>
            </View>
          ) : (
            <FlatList
              data={courseRequests}
              renderItem={renderRequestCard}
              keyExtractor={(item) => item.id!}
              contentContainerStyle={styles.coursesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  coursesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseImageContainer: {
    marginRight: 16,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  courseImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseImageText: {
    fontSize: 24,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseDetail: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  // Course Detail View Styles
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  courseHeaderInfo: {
    flex: 1,
  },
  courseHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  courseHeaderTeacher: {
    fontSize: 14,
    opacity: 0.7,
  },
  courseInfoContainer: {
    flex: 1,
    padding: 20,
  },
  courseInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courseInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  courseInfoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  courseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  courseInfoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillsContainer: {
    marginBottom: 8,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  messagesSection: {
    marginBottom: 20,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noMessagesText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  sentMessage: {
    backgroundColor: '#FF69B4',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  translateButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(66, 133, 244, 0.3)',
  },
  translateButtonText: {
    fontSize: 12,
    color: '#4285f4',
    fontWeight: '500',
  },
  translationInfo: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  callButtonText: {
    fontSize: 20,
  },
  sendButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF69B4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  // Teaching card styles
  studentInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  // Request card styles
  requestCard: {
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  requestStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  requestMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Course detail styles
  courseStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseCost: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
});