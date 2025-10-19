import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Types
export interface Skill {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  topic: string;
  description: string;
  cost: number;
  duration: string;
  category: string;
  imageUrl?: string;
  skills: string[];
  location: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  skillsHave: string[];
  skillsWant: string[];
  languages: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  avatarUrl?: string;
  credits: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Enrollment {
  id?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  skillId: string;
  skillTopic: string;
  skillDescription: string;
  skillCost: number;
  skillDuration: string;
  skillCategory: string;
  skillImageUrl?: string;
  skillSkills: string[];
  skillLocation: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: Timestamp;
  completedAt?: Timestamp;
}

export interface CourseRequest {
  id?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  skillId: string;
  skillTopic: string;
  skillDescription: string;
  skillCost: number;
  skillDuration: string;
  skillCategory: string;
  skillImageUrl?: string;
  skillSkills: string[];
  skillLocation: string;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
  message?: string;
}

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  enrollmentId?: string; // For course-specific messages
  senderName?: string; // For display purposes
}

// Skills Service
export const skillsService = {
  // Add a new skill
  async addSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'skills'), {
        ...skill,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  },

  // Get all skills
  async getAllSkills(): Promise<Skill[]> {
    try {
      const skillsRef = collection(db, 'skills');
      const q = query(skillsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
    } catch (error) {
      console.error('Error getting skills:', error);
      throw error;
    }
  },

  // Get skills by category
  async getSkillsByCategory(category: string): Promise<Skill[]> {
    try {
      const skillsRef = collection(db, 'skills');
      const q = query(skillsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
    } catch (error) {
      console.error('Error getting skills by category:', error);
      throw error;
    }
  },

  // Search skills
  async searchSkills(searchTerm: string): Promise<Skill[]> {
    try {
      const skillsRef = collection(db, 'skills');
      const q = query(skillsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const allSkills = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];

      // Filter by search term
      const filteredSkills = allSkills.filter(skill => 
        skill.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        skill.location.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filteredSkills;
    } catch (error) {
      console.error('Error searching skills:', error);
      throw error;
    }
  },

  // Real-time listener for all skills
  subscribeToAllSkills(callback: (skills: Skill[]) => void): Unsubscribe {
    const skillsRef = collection(db, 'skills');
    
    return onSnapshot(skillsRef, (querySnapshot) => {
      const skills = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      
      // Sort by createdAt on the client side
      skills.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toDate().getTime();
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toDate().getTime();
        return bTime - aTime; // Descending order (newest first)
      });
      
      callback(skills);
    }, (error) => {
      console.error('Error in skills listener:', error);
    });
  },

  // Update a skill
  async updateSkill(skillId: string, skillData: Partial<Skill>): Promise<void> {
    try {
      const skillRef = doc(db, 'skills', skillId);
      await updateDoc(skillRef, {
        ...skillData,
        updatedAt: new Date()
      });
    } catch (error: any) {
      console.error('Error updating skill:', error);
      throw error;
    }
  },

  // Delete a skill
  async deleteSkill(skillId: string): Promise<void> {
    try {
      // First get the skill to check if it has an image
      const skillRef = doc(db, 'skills', skillId);
      const skillDoc = await getDoc(skillRef);
      
      if (skillDoc.exists()) {
        const skillData = skillDoc.data() as Skill;
        
        // Delete the image from Storage if it exists
        if (skillData.imageUrl) {
          try {
            const imageRef = ref(storage, skillData.imageUrl);
            await deleteObject(imageRef);
          } catch (imageError) {
            // Continue even if image deletion fails
            console.warn('Failed to delete image:', imageError);
          }
        }
        
        // Delete the skill document from Firestore
        await deleteDoc(skillRef);
      }
    } catch (error: any) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
};

// Users Service
export const usersService = {
  // Add or update user profile
  async addOrUpdateUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Create user with specific ID (for Firebase Auth UID)
  async createUserWithId(userId: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = Timestamp.now();
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...user,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Error creating user with ID:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }

      return {
        id: userSnap.id,
        ...userSnap.data()
      } as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  // Update user credits
  async updateUserCredits(userId: string, creditChange: number): Promise<void> {
    try {
      console.log(`Starting credit update for user ${userId}, change: ${creditChange}`);
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error(`User ${userId} not found in Firestore`);
        throw new Error('User not found');
      }

      const currentCredits = userSnap.data().credits || 0;
      const newCredits = Math.max(0, currentCredits + creditChange); // Ensure credits don't go below 0
      
      console.log(`Updating credits: ${currentCredits} + ${creditChange} = ${newCredits}`);
      
      await updateDoc(userRef, {
        credits: newCredits,
        updatedAt: Timestamp.now()
      });
      
      console.log(`Successfully updated user ${userId} credits: ${currentCredits} -> ${newCredits} (change: ${creditChange})`);
    } catch (error) {
      console.error('Error updating user credits:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }
};

// Storage Service
export const storageService = {
  // Upload image - React Native compatible method
  async uploadImage(imageUri: string, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    
    // For React Native, convert the image URI to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the blob
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Alternative simple upload method
  async uploadImageSimple(imageUri: string, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    
    // Convert image URI to blob for React Native
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload the blob
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
};

// Enrollment Service
export const enrollmentService = {
  // Enroll in a skill
  async enrollInSkill(studentId: string, studentName: string, studentEmail: string, skill: Skill): Promise<string> {
    try {
      const now = Timestamp.now();
      
      // Create enrollment record
      const enrollmentData = {
        studentId,
        studentName,
        studentEmail,
        teacherId: skill.userId,
        teacherName: skill.userName,
        teacherEmail: skill.userEmail,
        skillId: skill.id!,
        skillTopic: skill.topic,
        skillDescription: skill.description,
        skillCost: skill.cost,
        skillDuration: skill.duration,
        skillCategory: skill.category,
        skillImageUrl: skill.imageUrl,
        skillSkills: skill.skills,
        skillLocation: skill.location,
        status: 'active' as const,
        enrolledAt: now,
      };

      const docRef = await addDoc(collection(db, 'enrollments'), enrollmentData);
      return docRef.id;
    } catch (error: any) {
      console.error('Error enrolling in skill:', error);
      throw error;
    }
  },

  // Get user's enrollments
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(
        enrollmentsRef, 
        where('studentId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const enrollments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
      
      // Sort by enrolledAt in descending order (most recent first)
      return enrollments.sort((a, b) => {
        const aTime = a.enrolledAt instanceof Date ? a.enrolledAt.getTime() : a.enrolledAt.toDate().getTime();
        const bTime = b.enrolledAt instanceof Date ? b.enrolledAt.getTime() : b.enrolledAt.toDate().getTime();
        return bTime - aTime;
      });
    } catch (error: any) {
      console.error('Error getting user enrollments:', error);
      throw error;
    }
  },

  // Get teacher's enrollments (students enrolled in their skills)
  async getTeacherEnrollments(teacherId: string): Promise<Enrollment[]> {
    try {
      const enrollmentsRef = collection(db, 'enrollments');
      const q = query(
        enrollmentsRef, 
        where('teacherId', '==', teacherId)
      );
      const querySnapshot = await getDocs(q);
      
      const enrollments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
      
      // Sort by enrolledAt in descending order (most recent first)
      return enrollments.sort((a, b) => {
        const aTime = a.enrolledAt instanceof Date ? a.enrolledAt.getTime() : a.enrolledAt.toDate().getTime();
        const bTime = b.enrolledAt instanceof Date ? b.enrolledAt.getTime() : b.enrolledAt.toDate().getTime();
        return bTime - aTime;
      });
    } catch (error: any) {
      console.error('Error getting teacher enrollments:', error);
      throw error;
    }
  },

  // Update enrollment status
  async updateEnrollmentStatus(enrollmentId: string, status: 'active' | 'completed' | 'cancelled'): Promise<void> {
    try {
      const enrollmentRef = doc(db, 'enrollments', enrollmentId);
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      }
      
      await updateDoc(enrollmentRef, updateData);
    } catch (error: any) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }
  },

  // Real-time listener for user's enrollments
  subscribeToUserEnrollments(userId: string, callback: (enrollments: Enrollment[]) => void): Unsubscribe {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef, 
      where('studentId', '==', userId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const enrollments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
      
      // Sort by enrolledAt in descending order (most recent first)
      const sortedEnrollments = enrollments.sort((a, b) => {
        const aTime = a.enrolledAt instanceof Date ? a.enrolledAt.getTime() : a.enrolledAt.toDate().getTime();
        const bTime = b.enrolledAt instanceof Date ? b.enrolledAt.getTime() : b.enrolledAt.toDate().getTime();
        return bTime - aTime;
      });
      
      callback(sortedEnrollments);
    }, (error) => {
      console.error('Error in user enrollments listener:', error);
    });
  },

  // Real-time listener for teacher's enrollments
  subscribeToTeacherEnrollments(teacherId: string, callback: (enrollments: Enrollment[]) => void): Unsubscribe {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef, 
      where('teacherId', '==', teacherId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const enrollments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];
      
      // Sort by enrolledAt in descending order (most recent first)
      const sortedEnrollments = enrollments.sort((a, b) => {
        const aTime = a.enrolledAt instanceof Date ? a.enrolledAt.getTime() : a.enrolledAt.toDate().getTime();
        const bTime = b.enrolledAt instanceof Date ? b.enrolledAt.getTime() : b.enrolledAt.toDate().getTime();
        return bTime - aTime;
      });
      
      callback(sortedEnrollments);
    }, (error) => {
      console.error('Error in teacher enrollments listener:', error);
    });
  }
};

// Messages Service
export const messagesService = {
  // Add a new message
  async addMessage(message: Omit<Message, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'messages'), message);
      return docRef.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Get messages between two users
  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2])
      );
      const querySnapshot = await getDocs(q);
      
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort by timestamp in ascending order (oldest first)
      return messages.sort((a, b) => {
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toDate().getTime();
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toDate().getTime();
        return aTime - bTime;
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Real-time listener for messages between two users
  subscribeToMessages(userId1: string, userId2: string, callback: (messages: Message[]) => void): Unsubscribe {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2])
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort by timestamp in ascending order (oldest first)
      const sortedMessages = messages.sort((a, b) => {
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toDate().getTime();
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toDate().getTime();
        return aTime - bTime;
      });
      
      callback(sortedMessages);
    }, (error) => {
      console.error('Error in messages listener:', error);
    });
  },

  // Real-time listener for course messages (using enrollment ID)
  subscribeToCourseMessages(enrollmentId: string, callback: (messages: Message[]) => void): Unsubscribe {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('enrollmentId', '==', enrollmentId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort by timestamp in ascending order (oldest first)
      const sortedMessages = messages.sort((a, b) => {
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toDate().getTime();
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toDate().getTime();
        return aTime - bTime;
      });
      
      callback(sortedMessages);
    }, (error) => {
      console.error('Error in course messages listener:', error);
    });
  }
};

// Course Request Service
export const courseRequestService = {
  // Create a course request
  async createCourseRequest(studentId: string, studentName: string, studentEmail: string, skill: Skill, message?: string): Promise<string> {
    try {
      const now = Timestamp.now();
      
      const requestData = {
        studentId,
        studentName,
        studentEmail,
        teacherId: skill.userId,
        teacherName: skill.userName,
        teacherEmail: skill.userEmail,
        skillId: skill.id!,
        skillTopic: skill.topic,
        skillDescription: skill.description,
        skillCost: skill.cost,
        skillDuration: skill.duration,
        skillCategory: skill.category,
        skillImageUrl: skill.imageUrl,
        skillSkills: skill.skills,
        skillLocation: skill.location,
        status: 'pending' as const,
        requestedAt: now,
        message: message || '',
      };

      const docRef = await addDoc(collection(db, 'courseRequests'), requestData);
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating course request:', error);
      throw error;
    }
  },

  // Get pending requests for a teacher
  async getTeacherRequests(teacherId: string): Promise<CourseRequest[]> {
    try {
      const requestsRef = collection(db, 'courseRequests');
      const q = query(
        requestsRef, 
        where('teacherId', '==', teacherId),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseRequest[];
      
      // Sort by requestedAt in descending order (most recent first)
      return requests.sort((a, b) => {
        const aTime = a.requestedAt instanceof Date ? a.requestedAt.getTime() : a.requestedAt.toDate().getTime();
        const bTime = b.requestedAt instanceof Date ? b.requestedAt.getTime() : b.requestedAt.toDate().getTime();
        return bTime - aTime;
      });
    } catch (error: any) {
      console.error('Error getting teacher requests:', error);
      throw error;
    }
  },

  // Get student's requests
  async getStudentRequests(studentId: string): Promise<CourseRequest[]> {
    try {
      const requestsRef = collection(db, 'courseRequests');
      const q = query(
        requestsRef, 
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseRequest[];
      
      // Sort by requestedAt in descending order (most recent first)
      return requests.sort((a, b) => {
        const aTime = a.requestedAt instanceof Date ? a.requestedAt.getTime() : a.requestedAt.toDate().getTime();
        const bTime = b.requestedAt instanceof Date ? b.requestedAt.getTime() : b.requestedAt.toDate().getTime();
        return bTime - aTime;
      });
    } catch (error: any) {
      console.error('Error getting student requests:', error);
      throw error;
    }
  },

  // Approve a course request
  async approveRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(db, 'courseRequests', requestId);
      await updateDoc(requestRef, {
        status: 'approved',
        respondedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error approving request:', error);
      throw error;
    }
  },

  // Decline a course request
  async declineRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(db, 'courseRequests', requestId);
      await updateDoc(requestRef, {
        status: 'declined',
        respondedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error declining request:', error);
      throw error;
    }
  },

  // Real-time listener for teacher's course requests
  subscribeToTeacherRequests(teacherId: string, callback: (requests: CourseRequest[]) => void): Unsubscribe {
    const requestsRef = collection(db, 'courseRequests');
    const q = query(
      requestsRef, 
      where('teacherId', '==', teacherId),
      where('status', '==', 'pending')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseRequest[];
      
      // Sort by requestedAt in descending order (most recent first)
      const sortedRequests = requests.sort((a, b) => {
        const aTime = a.requestedAt instanceof Date ? a.requestedAt.getTime() : a.requestedAt.toDate().getTime();
        const bTime = b.requestedAt instanceof Date ? b.requestedAt.getTime() : b.requestedAt.toDate().getTime();
        return bTime - aTime;
      });
      
      callback(sortedRequests);
    }, (error) => {
      console.error('Error in teacher requests listener:', error);
    });
  },

  // Real-time listener for student's course requests
  subscribeToStudentRequests(studentId: string, callback: (requests: CourseRequest[]) => void): Unsubscribe {
    const requestsRef = collection(db, 'courseRequests');
    const q = query(
      requestsRef, 
      where('studentId', '==', studentId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseRequest[];
      
      // Sort by requestedAt in descending order (most recent first)
      const sortedRequests = requests.sort((a, b) => {
        const aTime = a.requestedAt instanceof Date ? a.requestedAt.getTime() : a.requestedAt.toDate().getTime();
        const bTime = b.requestedAt instanceof Date ? b.requestedAt.getTime() : b.requestedAt.toDate().getTime();
        return bTime - aTime;
      });
      
      callback(sortedRequests);
    }, (error) => {
      console.error('Error in student requests listener:', error);
    });
  }
};
