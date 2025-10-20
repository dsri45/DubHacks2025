import { Colors } from '@/constants/theme';

import { useAuth } from '@/contexts/AuthContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { Image } from 'expo-image';

import * as ImagePicker from 'expo-image-picker';

// import * as Location from 'expo-location';

import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,

  Alert,

  Dimensions,

  KeyboardAvoidingView,

  Modal,

  Platform,

  SafeAreaView,

  ScrollView,

  StyleSheet,

  Text,

  TextInput,

  TouchableOpacity,

  View
} from 'react-native';

import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { courseRequestService, Skill, skillsService, storageService, usersService } from '../../services/firebaseService';

 

const { width } = Dimensions.get('window');

const cardWidth = (width - 60) / 2; // 2 columns with padding

 

// Sample posts data with different sizes for Pinterest/VSCO style

const samplePosts = [

  {

    id: 1,

    name: "Sarah Chen",

    topic: "Digital Drawing & Illustration",

    cost: 45,

    duration: "2 hours",

    description: "Learn digital drawing techniques using Procreate and Adobe Illustrator. Master brush techniques, color theory, and create stunning illustrations. Perfect for beginners and intermediate artists looking to enhance their digital art skills.",

    image: require("@/assets/images/drawing.jpg"),

    category: "Art",

    height: 250, // Taller card

    location: "Seattle, WA",

    skills: ["Digital Art", "Illustration", "Procreate", "Adobe Illustrator", "Color Theory"]

  },

  {

    id: 2,

    name: "Marcus Johnson",

    topic: "3D Printing Fundamentals",

    cost: 35,

    duration: "1.5 hours",

    description: "Introduction to 3D printing technology, design principles, and practical applications. Learn to use CAD software, understand different materials, and troubleshoot common printing issues. Hands-on workshop included.",

    image: require("@/assets/images/3dprinting.jpg"),

    category: "Technology",

    height: 250, // Medium card

    location: "Portland, OR",

    skills: ["3D Printing", "CAD Design", "Fusion 360", "Material Science", "Prototyping"]

  },

  {

    id: 3,

    name: "Elena Rodriguez",

    topic: "Acoustic Guitar Basics",

    cost: 50,

    duration: "3 hours",

    description: "Master the fundamentals of acoustic guitar playing. Learn proper finger placement, basic chords, strumming patterns, and your first songs. Perfect for complete beginners. Guitar provided if needed.",

    image: require("@/assets/images/guitar.jpg"),

    category: "Music",

    height: 250, // Tallest card

    location: "San Francisco, CA",

    skills: ["Guitar", "Music Theory", "Acoustic Guitar", "Chord Progressions", "Fingerpicking"]

  },

  {

    id: 4,

    name: "David Kim",

    topic: "Social Media Marketing",

    cost: 40,

    duration: "2.5 hours",

    description: "Comprehensive guide to social media marketing across all platforms. Learn content creation, engagement strategies, analytics, and how to build a strong online presence for your brand or business.",

    image: require("@/assets/images/marketing.jpg"),

    category: "Marketing",

    height: 250, // Medium-tall card

    location: "Los Angeles, CA",

    skills: ["Social Media Marketing", "Content Creation", "Analytics", "Brand Strategy", "Digital Marketing"]

  },

  {

    id: 5,

    name: "Lisa Wang",

    topic: "Origami Art & Techniques",

    cost: 25,

    duration: "1 hour",

    description: "Discover the beautiful art of origami. Learn traditional and modern folding techniques, create stunning paper sculptures, and understand the mathematical principles behind this ancient art form.",

    image: require("@/assets/images/origami.jpg"),

    category: "Craft",

    height: 250, // Shorter card

    location: "Vancouver, BC",

    skills: ["Origami", "Paper Craft", "Geometric Design", "Traditional Arts", "Mathematical Art"]

  },

  {

    id: 6,

    name: "Alex Thompson",

    topic: "Portrait Photography",

    cost: 55,

    duration: "2.5 hours",

    description: "Master portrait photography techniques including lighting, composition, and posing. Learn to use natural and studio lighting, work with different camera settings, and edit portraits professionally.",

    image: require("@/assets/images/photography.png"),

    category: "Photography",

    height: 250, // Medium-tall card

    location: "Austin, TX",

    skills: ["Photography", "Portrait Photography", "Lighting", "Photo Editing", "Adobe Lightroom"]

  },

  {

    id: 7,

    name: "Maria Santos",

    topic: "Web Development Bootcamp",

    cost: 75,

    duration: "4 hours",

    description: "Complete web development course covering HTML, CSS, JavaScript, React, and Node.js. Build real projects and learn industry best practices. Perfect for beginners starting their coding journey.",

    image: require("@/assets/images/programming.jpeg"),

    category: "Programming",

    height: 250, // Tall card

    location: "New York, NY",

    skills: ["Web Development", "JavaScript", "React", "Node.js", "HTML", "CSS"]

  },

  {

    id: 8,

    name: "James Wilson",

    topic: "Cooking Fundamentals",

    cost: 30,

    duration: "2 hours",

    description: "Learn essential cooking techniques, knife skills, and basic recipes. Master the fundamentals of cooking and build confidence in the kitchen. Great for beginners and food enthusiasts.",

    image: require("@/assets/images/culinary.jpeg"),

    category: "Culinary",

    height: 250, // Medium card

    location: "Chicago, IL",

    skills: ["Cooking", "Knife Skills", "Culinary Arts", "Recipe Development", "Kitchen Safety"]

  },

  {

    id: 9,

    name: "Priya Patel",

    topic: "Yoga & Meditation",

    cost: 40,

    duration: "1.5 hours",

    description: "Discover the benefits of yoga and meditation for physical and mental wellness. Learn basic poses, breathing techniques, and mindfulness practices for daily life.",

    image: require("@/assets/images/wellness.jpeg"),

    category: "Wellness",

    height: 250, // Medium card

    location: "Denver, CO",

    skills: ["Yoga", "Meditation", "Mindfulness", "Breathing Techniques", "Wellness"]

  },

  {

    id: 10,

    name: "Carlos Rodriguez",

    topic: "Spanish Language Basics",

    cost: 35,

    duration: "2 hours",

    description: "Learn conversational Spanish from scratch. Cover essential vocabulary, grammar, and pronunciation. Practice with real-world scenarios and build confidence in speaking.",

    image: require("@/assets/images/language.jpeg"),

    category: "Language",

    height: 250, // Medium-tall card

    location: "Miami, FL",

    skills: ["Spanish", "Language Learning", "Conversational Spanish", "Grammar", "Pronunciation"]

  },

  {

    id: 11,

    name: "Emma Davis",

    topic: "Graphic Design Principles",

    cost: 50,

    duration: "3 hours",

    description: "Master the fundamentals of graphic design including typography, color theory, layout, and composition. Learn to use design software and create professional visuals.",

    image: require("@/assets/images/design.jpeg"),

    category: "Design",

    height: 250, // Tall card

    location: "Boston, MA",

    skills: ["Graphic Design", "Typography", "Color Theory", "Adobe Creative Suite", "Layout Design"]

  },

  {

    id: 12,

    name: "Michael Chen",

    topic: "Data Analysis with Excel",

    cost: 45,

    duration: "2.5 hours",

    description: "Learn advanced Excel techniques for data analysis, visualization, and reporting. Master pivot tables, charts, formulas, and data manipulation for business insights.",

    image: require("@/assets/images/dataScience.jpeg"),

    category: "Data Science",

    height: 250, // Medium card

    location: "Phoenix, AZ",

    skills: ["Data Analysis", "Excel", "Data Visualization", "Pivot Tables", "Business Intelligence"]

  }

];

 

interface Post {

  id: number;

  name: string;

  topic: string;

  cost: number;

  duration: string;

  description: string;

  image: any; // Changed from string to any for require() images

  category: string;

  height: number;

  location: string;

  skills: string[];

}

 

export default function HomeScreen() {

  const colorScheme = useColorScheme();

  const { user } = useAuth();

  const [selectedPost, setSelectedPost] = useState<Skill | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  const [skills, setSkills] = useState<Skill[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [newSkill, setNewSkill] = useState({

    topic: '',

    description: '',

    cost: '',

    duration: '',

    category: 'Other',

    skills: '',

    location: '',

    latitude: null as number | null,

    longitude: null as number | null,

    postalCode: '',

  });

  const [locationSearch, setLocationSearch] = useState('');

  const [locationResults, setLocationResults] = useState<any[]>([]);

  const [locationLoading, setLocationLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [userCredits, setUserCredits] = useState(150); // User credits state

  const [unsubscribeSkills, setUnsubscribeSkills] = useState<(() => void) | null>(null);
  const [unsubscribeUser, setUnsubscribeUser] = useState<(() => void) | null>(null);

 

  // Set up real-time listener for skills

  useEffect(() => {

    console.log('Setting up real-time skills listener');

    setLoading(true);

 

    // Clean up existing listener

    if (unsubscribeSkills) {

      unsubscribeSkills();

    }

 

    // Set up real-time listener

    const unsubscribe = skillsService.subscribeToAllSkills((skills) => {

      console.log('Real-time skills update:', skills);

      setSkills(skills);

      setLoading(false);

    });

 

    setUnsubscribeSkills(() => unsubscribe);

 

    // Cleanup function

    return () => {

      if (unsubscribe) {

        unsubscribe();

      }

    };

  }, []);

 

  // Cleanup listener when component unmounts

  useEffect(() => {

    return () => {

      if (unsubscribeSkills) {

        unsubscribeSkills();

      }

    };

  }, [unsubscribeSkills]);

  // Load user credits when user changes

  useEffect(() => {

    const loadUserCredits = async () => {

      if (user?.id) {

        try {

          const userData = await usersService.getUserById(user.id);

          if (userData) {

            console.log('Loaded user credits:', userData.credits);

            setUserCredits(userData.credits || 150); // Default to 150 if no credits set

          }

        } catch (error) {

          console.error('Error loading user credits:', error);

          // Keep default credits if loading fails

        }

      }

    };

    loadUserCredits();

  }, [user]);

  // Set up real-time listener for user credits
  useEffect(() => {
    if (user?.id) {
      console.log('Setting up real-time user listener for:', user.id);
      
      // Clean up existing listener
      if (unsubscribeUser) {
        unsubscribeUser();
      }

      // Set up real-time listener for user data
      const userRef = doc(db, 'users', user.id);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          console.log('Real-time user update:', userData);
          if (userData.credits !== undefined) {
            setUserCredits(userData.credits);
            console.log('Updated user credits from real-time listener:', userData.credits);
          }
        }
      }, (error) => {
        console.error('Error in user real-time listener:', error);
      });

      setUnsubscribeUser(() => unsubscribe);

      // Cleanup function
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [user?.id]);

  // Cleanup user listener when component unmounts
  useEffect(() => {
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [unsubscribeUser]);

  // Function to refresh user credits (can be called from other components)

  const refreshUserCredits = async () => {

    if (user?.id) {

      try {

        const userData = await usersService.getUserById(user.id);

        if (userData) {

          console.log('Refreshed user credits:', userData.credits);

          setUserCredits(userData.credits || 150);

        }

      } catch (error) {

        console.error('Error refreshing user credits:', error);

      }

    }

  };

 

  // Manual loading function (kept for fallback)

  const loadSkills = async () => {

    try {

      setLoading(true);

      const skillsData = await skillsService.getAllSkills();

      setSkills(skillsData);

    } catch (error: any) {

      Alert.alert('Error', 'Failed to load skills');

    } finally {

      setLoading(false);

    }

  };

 

  // Filter skills based on search query

  const filteredSkills = skills.filter(skill =>

    skill.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||

    skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||

    skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||

    skill.location.toLowerCase().includes(searchQuery.toLowerCase()) ||

    skill.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

  );

 

  // Image picker function (same as profile)

  const pickImage = async () => {

    try {

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {

        Alert.alert('Permission required', 'Permission to access media library is required!');

        return;

      }

 

      const result = await ImagePicker.launchImageLibraryAsync({

        mediaTypes: 'images' as any,

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.8,

      });

 

      // Use the same logic as profile: check for cancelled, then extract uri

      if (!(result as any).cancelled && !(result as any).canceled) {

        const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;

        if (uri) setSelectedImage(uri);

      }

    } catch (error) {

      console.error('Error in image picker:', error);

      Alert.alert('Error', 'Failed to open image picker. Please try again.');

    }

  };

 

  const renderSkill = (skill: Skill) => (

    <TouchableOpacity

      key={skill.id}

      style={[

        styles.postCard,

        {

          backgroundColor: Colors[colorScheme ?? 'light'].background,

          height: 250

        }

      ]}

      onPress={() => setSelectedPost(skill)}

    >

      <View style={[styles.postImage, { height: 150 }]}>

        {skill.imageUrl ? (

          <Image

            source={{ uri: skill.imageUrl }}

            style={styles.postImageContent}

            resizeMode="cover"

          />

        ) : (

          <View style={[styles.postImageContent, { backgroundColor: '#FFE4E1', alignItems: 'center', justifyContent: 'center' }]}>

            <Text style={{ fontSize: 24, color: '#FF69B4' }}>📚</Text>

          </View>

        )}

      </View>

      <View style={styles.postContent}>

        <Text style={[styles.postName, { color: Colors[colorScheme ?? 'light'].text }]}>

          {skill.userName}

        </Text>

        <Text

          style={[styles.postTopic, { color: Colors[colorScheme ?? 'light'].text }]}

          numberOfLines={3}

        >

          {skill.topic}

        </Text>

        <Text style={[styles.postCategory, { color: '#FF69B4' }]}>

          {skill.category}

        </Text>

        <View style={styles.postFooter}>

          <Text style={[styles.postCost, { color: Colors[colorScheme ?? 'light'].text }]}>

            {skill.cost} credits

          </Text>

          <Text style={[styles.postDuration, { color: Colors[colorScheme ?? 'light'].text }]}>

            {skill.duration}

          </Text>

        </View>

      </View>

    </TouchableOpacity>

  );

 

  return (

    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

      <View style={styles.header}>

        <View style={styles.headerTop}>

          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>

            DubHacks

          </Text>

          <View style={styles.headerRight}>

            <TouchableOpacity

              style={styles.addSkillButton}

              onPress={() => setShowAddSkillModal(true)}

            >

              <Text style={styles.addSkillButtonText}>+</Text>

            </TouchableOpacity>

            <View style={styles.creditsContainer}>

              <Text style={[styles.creditsText, { color: '#FF69B4' }]}>

                {userCredits} credits

              </Text>

            </View>

          </View>

        </View>

      </View>

 

      {/* Search Bar with Android buffer */}

      <View style={styles.searchContainer}>

        <TextInput

          style={[

            styles.searchInput,

            {

              backgroundColor: Colors[colorScheme ?? 'light'].background,

              color: Colors[colorScheme ?? 'light'].text,

              borderColor: Colors[colorScheme ?? 'light'].text

            }

          ]}

          placeholder="Search skills, people, or locations..."

          placeholderTextColor={Colors[colorScheme ?? 'light'].text}

          value={searchQuery}

          onChangeText={setSearchQuery}

        />

      </View>

     

      {loading ? (

        <View style={styles.loadingContainer}>

          <ActivityIndicator size="large" color="#FF69B4" />

          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>

            Loading skills...

          </Text>

        </View>

      ) : (

        <ScrollView

          style={styles.scrollView}

          contentContainerStyle={styles.postsContainer}

          showsVerticalScrollIndicator={false}

        >

          {filteredSkills.map(renderSkill)}

        </ScrollView>

      )}

 

      {/* Post Detail Modal */}

      <Modal

        visible={selectedPost !== null}

        animationType="slide"

        presentationStyle="pageSheet"

        onRequestClose={() => setSelectedPost(null)}

      >

        {selectedPost && (

          <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

            <View style={styles.modalHeader}>

              <TouchableOpacity

                style={styles.closeButton}

                onPress={() => setSelectedPost(null)}

              >

                <Text style={[styles.closeButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>

                  ✕

                </Text>

              </TouchableOpacity>

            </View>

           

            <ScrollView style={styles.modalContent}>

              <View style={styles.modalImage}>

                {selectedPost.imageUrl ? (

                  <Image

                    source={{ uri: selectedPost.imageUrl }}

                    style={styles.modalImageContent}

                    resizeMode="cover"

                  />

                ) : (

                  <View style={[styles.modalImageContent, { backgroundColor: '#FFE4E1', alignItems: 'center', justifyContent: 'center' }]}>

                    <Text style={{ fontSize: 48, color: '#FF69B4' }}>📚</Text>

                  </View>

                )}

              </View>

             

              <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>

                {selectedPost.userName}

              </Text>

             

              <Text style={[styles.modalTopic, { color: Colors[colorScheme ?? 'light'].text }]}>

                {selectedPost.topic}

              </Text>

             

              <Text style={[styles.modalCategory, { color: '#FF69B4' }]}>

                {selectedPost.category}

              </Text>

             

              <View style={styles.modalLocation}>

                <Text style={[styles.modalLocationText, { color: Colors[colorScheme ?? 'light'].text }]}>

                  📍 {selectedPost.location}

                </Text>

              </View>

             

              <View style={styles.modalDetails}>

                <Text style={[styles.modalCost, { color: Colors[colorScheme ?? 'light'].text }]}>

                  {selectedPost.cost} credits

                </Text>

                <Text style={[styles.modalDuration, { color: Colors[colorScheme ?? 'light'].text }]}>

                  Duration: {selectedPost.duration}

                </Text>

              </View>

 

              <View style={styles.modalSkills}>

                <Text style={[styles.modalSkillsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>

                  Skills Covered:

                </Text>

                <View style={styles.skillsContainer}>

                  {selectedPost.skills.map((skill, index) => (

                    <View key={index} style={styles.skillTag}>

                      <Text style={styles.skillText}>{skill}</Text>

                    </View>

                  ))}

                </View>

              </View>

             

              <Text style={[styles.modalDescription, { color: Colors[colorScheme ?? 'light'].text }]}>

                {selectedPost.description}

              </Text>

             

              <TouchableOpacity

                style={[styles.enrollButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}

                onPress={async () => {

                  if (!user) {

                    Alert.alert('Error', 'Please log in to request enrollment');

                    return;

                  }

 

                  if (userCredits < selectedPost.cost) {

                    Alert.alert('Insufficient Credits', `You need ${selectedPost.cost} credits but only have ${userCredits}. Please add more credits.`);

                    return;

                  }

 

                  Alert.alert(

                    'Request Enrollment',

                    `Send enrollment request for "${selectedPost.topic}" for ${selectedPost.cost} credits?`,

                    [

                      { text: 'Cancel', style: 'cancel' },

                      {

                        text: 'Send Request',

                        onPress: async () => {

                          try {

                            // Create course request

                            await courseRequestService.createCourseRequest(

                              user.id,

                              user.name || user.email || 'Anonymous',

                              user.email || '',

                              selectedPost,

                              `Hi! I'd like to enroll in your "${selectedPost.topic}" course.`

                            );

                           

                            setSelectedPost(null);

                            Alert.alert('Success', 'Enrollment request sent! The teacher will review and approve your request.');

                          } catch (error: any) {

                            Alert.alert('Error', 'Failed to send request: ' + (error?.message || 'Unknown error'));

                          }

                        }

                      }

                    ]

                  );

                }}

              >

                <Text style={styles.enrollButtonText}>Request Enrollment ({selectedPost.cost} credits)</Text>

              </TouchableOpacity>

            </ScrollView>

          </SafeAreaView>

        )}

      </Modal>

 

      {/* Add Skill Modal */}

      <Modal

        visible={showAddSkillModal}

        animationType="slide"

        presentationStyle="pageSheet"

        onRequestClose={() => setShowAddSkillModal(false)}

      >

        <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

          <View style={styles.modalHeader}>

            <TouchableOpacity

              style={styles.closeButton}

              onPress={() => setShowAddSkillModal(false)}

            >

              <Text style={[styles.closeButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>

                ✕

              </Text>

            </TouchableOpacity>

          </View>

         

          <ScrollView style={styles.modalContent}>

            <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>

              Add Your Skill

            </Text>

            <Text style={[styles.modalDescription, { color: Colors[colorScheme ?? 'light'].text }]}>

              Share what you can teach with the community

            </Text>

           

            {/* Image Upload Section */}

            <View style={styles.imageUploadSection}>

              <Text style={[styles.imageUploadLabel, { color: Colors[colorScheme ?? 'light'].text }]}>

                Add Image (Optional)

              </Text>

              <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>

                {selectedImage ? (

                  <Image source={{ uri: selectedImage }} style={{ width: 116, height: 116, borderRadius: 10 }} />

                ) : (

                  <View style={styles.imageUploadPlaceholder}>

                    <Text style={styles.imageUploadText}>📷</Text>

                    <Text style={styles.imageUploadSubtext}>Tap to add image</Text>

                  </View>

                )}

              </TouchableOpacity>

             

              {/* Debug info */}

              {selectedImage && (

                <Text style={[styles.debugText, { color: Colors[colorScheme ?? 'light'].text }]}>

                  Image selected: {selectedImage.substring(0, 50)}...

                </Text>

              )}

             

            </View>

 

            <TextInput

              style={[styles.addSkillInput, {

                backgroundColor: Colors[colorScheme ?? 'light'].background,

                color: Colors[colorScheme ?? 'light'].text,

                borderColor: Colors[colorScheme ?? 'light'].text

              }]}

              placeholder="Skill/Topic (e.g., 'Digital Art', 'Guitar Lessons')"

              placeholderTextColor={Colors[colorScheme ?? 'light'].text}

              value={newSkill.topic}

              onChangeText={(text) => setNewSkill({...newSkill, topic: text})}

            />

           

            <TextInput

              style={[styles.addSkillInput, styles.addSkillTextArea, {

                backgroundColor: Colors[colorScheme ?? 'light'].background,

                color: Colors[colorScheme ?? 'light'].text,

                borderColor: Colors[colorScheme ?? 'light'].text

              }]}

              placeholder="Description of what you'll teach..."

              placeholderTextColor={Colors[colorScheme ?? 'light'].text}

              value={newSkill.description}

              onChangeText={(text) => setNewSkill({...newSkill, description: text})}

              multiline

              numberOfLines={4}

            />

           

            <View style={styles.addSkillRow}>

              <TextInput

                style={[styles.addSkillInput, styles.addSkillHalf, {

                  backgroundColor: Colors[colorScheme ?? 'light'].background,

                  color: Colors[colorScheme ?? 'light'].text,

                  borderColor: Colors[colorScheme ?? 'light'].text

                }]}

                placeholder="Cost (credits)"

                placeholderTextColor={Colors[colorScheme ?? 'light'].text}

                value={newSkill.cost}

                onChangeText={(text) => setNewSkill({...newSkill, cost: text})}

                keyboardType="numeric"

              />

             

              <TextInput

                style={[styles.addSkillInput, styles.addSkillHalf, {

                  backgroundColor: Colors[colorScheme ?? 'light'].background,

                  color: Colors[colorScheme ?? 'light'].text,

                  borderColor: Colors[colorScheme ?? 'light'].text

                }]}

                placeholder="Duration (e.g., '2 hours')"

                placeholderTextColor={Colors[colorScheme ?? 'light'].text}

                value={newSkill.duration}

                onChangeText={(text) => setNewSkill({...newSkill, duration: text})}

              />

            </View>

           

            <TextInput

              style={[styles.addSkillInput, {

                backgroundColor: Colors[colorScheme ?? 'light'].background,

                color: Colors[colorScheme ?? 'light'].text,

                borderColor: Colors[colorScheme ?? 'light'].text

              }]}

              placeholder="Skills (comma-separated, e.g., 'JavaScript, React, Node.js')"

              placeholderTextColor={Colors[colorScheme ?? 'light'].text}

              value={newSkill.skills}

              onChangeText={(text) => setNewSkill({...newSkill, skills: text})}

            />

 

            {/* Location Picker */}

            <TextInput

              style={[styles.addSkillInput, {

                backgroundColor: Colors[colorScheme ?? 'light'].background,

                color: Colors[colorScheme ?? 'light'].text,

                borderColor: Colors[colorScheme ?? 'light'].text

              }]}

              placeholder="Search for location/address..."

              placeholderTextColor={Colors[colorScheme ?? 'light'].text}

              value={locationSearch}

              onChangeText={async (text) => {

                setLocationSearch(text);

                setLocationLoading(true);

                try {

                  if (text.length > 2) {

                    // Use Nominatim OpenStreetMap API for address search

                    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`;

                    const response = await fetch(url);

                    const data = await response.json();

                    setLocationResults(data);

                  } else {

                    setLocationResults([]);

                  }

                } catch (e) {

                  setLocationResults([]);

                }

                setLocationLoading(false);

              }}

            />

            {locationLoading && <Text style={{color: Colors[colorScheme ?? 'light'].text}}>Searching...</Text>}

            {locationResults.length > 0 && (

              <View style={{maxHeight: 180, backgroundColor: Colors[colorScheme ?? 'light'].background, borderWidth: 1, borderColor: Colors[colorScheme ?? 'light'].text, borderRadius: 8, marginBottom: 8}}>

                <ScrollView>

                  {locationResults.map((loc, idx) => (

                    <TouchableOpacity

                      key={idx}

                      style={{padding: 10, borderBottomWidth: idx < locationResults.length-1 ? 1 : 0, borderColor: '#eee'}}

                      onPress={() => {

                        setNewSkill({

                          ...newSkill,

                          location: loc.display_name,

                          latitude: parseFloat(loc.lat),

                          longitude: parseFloat(loc.lon),

                          postalCode: loc.address?.postcode || ''

                        });

                        setLocationSearch(loc.display_name);

                        setLocationResults([]);

                      }}

                    >

                      <Text style={{color: Colors[colorScheme ?? 'light'].text}}>

                        {loc.display_name}

                        {loc.address?.postcode ? ` (Postal: ${loc.address.postcode})` : ''}

                        {loc.lat && loc.lon ? ` (${parseFloat(loc.lat).toFixed(4)}, ${parseFloat(loc.lon).toFixed(4)})` : ''}

                      </Text>

                    </TouchableOpacity>

                  ))}

                </ScrollView>

              </View>

            )}

            {/* Show selected location */}

            {newSkill.location && newSkill.latitude && newSkill.longitude && (

              <Text style={{color: Colors[colorScheme ?? 'light'].text, marginBottom: 8}}>

                Selected: {newSkill.location} ({newSkill.latitude.toFixed(4)}, {newSkill.longitude.toFixed(4)})

                {newSkill.postalCode ? ` (Postal: ${newSkill.postalCode})` : ''}

              </Text>

            )}

 

            <TextInput

              style={[styles.addSkillInput, {

                backgroundColor: Colors[colorScheme ?? 'light'].background,

                color: Colors[colorScheme ?? 'light'].text,

                borderColor: Colors[colorScheme ?? 'light'].text

              }]}

              placeholder="Category (e.g., 'Art', 'Music', 'Technology')"

              placeholderTextColor={Colors[colorScheme ?? 'light'].text}

              value={newSkill.category}

              onChangeText={(text) => setNewSkill({...newSkill, category: text})}

            />

           

 

            <TouchableOpacity

              style={[styles.enrollButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}

              onPress={async () => {

                if (!user) {

                  Alert.alert('Error', 'Please log in to add a skill');

                  return;

                }

 

                if (!newSkill.topic || !newSkill.description || !newSkill.cost || !newSkill.duration || !newSkill.location) {

                  Alert.alert('Error', 'Please fill in all required fields');

                  return;

                }

 

                try {

                  setUploading(true);

                 

                  let imageUrl = '';

                  if (selectedImage) {

                    try {

                      console.log('Starting image upload for:', selectedImage);

                      const imagePath = `skills/${user.id}/${Date.now()}.jpg`;

                      console.log('Uploading to path:', imagePath);

                      imageUrl = await storageService.uploadImage(selectedImage, imagePath);

                      console.log('Image uploaded successfully:', imageUrl);

                    } catch (imageError: any) {

                      console.error('Image upload failed:', imageError);

                      Alert.alert('Image Upload Failed', 'Failed to upload image. The skill will be added without an image.');

                      imageUrl = '';

                    }

                  }

 

                  const skillData = {

                    userId: user.id,

                    userName: user.name || user.email || 'Anonymous',

                    userEmail: user.email || '',

                    topic: newSkill.topic,

                    description: newSkill.description,

                    cost: parseInt(newSkill.cost) || 0,

                    duration: newSkill.duration,

                    category: newSkill.category,

                    imageUrl: imageUrl,

                    skills: newSkill.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),

                    location: newSkill.location,

                    latitude: newSkill.latitude,

                    longitude: newSkill.longitude,

                    postalCode: newSkill.postalCode,

                  };

 

                  await skillsService.addSkill(skillData);

                 

                  // Reset form

                  setNewSkill({

                    topic: '',

                    description: '',

                    cost: '',

                    duration: '',

                    category: 'Other',

                    skills: '',

                    location: '',

                    latitude: null,

                    longitude: null,

                    postalCode: '',

                  });

                  setSelectedImage(null);

                  setLocationSearch('');

                  setLocationResults([]);

                  setShowAddSkillModal(false);

                  

                  // Real-time listener will automatically update the UI

                  

                  Alert.alert('Success', 'Your skill has been added to the community!');

                } catch (error: any) {

                  Alert.alert('Error', 'Failed to add skill. Please try again.');

                } finally {

                  setUploading(false);

                }

              }}

              disabled={uploading}

            >

              {uploading ? (

                <ActivityIndicator color="white" />

              ) : (

                <Text style={styles.enrollButtonText}>Add Skill</Text>

              )}

            </TouchableOpacity>

          </ScrollView>

        </SafeAreaView>

      </Modal>

    </SafeAreaView>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

  },

  header: {

    padding: 20,

    paddingTop: 60,

    paddingBottom: 10,

  },

  headerTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 8,

  },

  headerRight: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

  },

  addSkillButton: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: '#FF69B4',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#000',

    shadowOffset: {

      width: 0,

      height: 2,

    },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

  },

  addSkillButtonText: {

    color: 'white',

    fontSize: 24,

    fontWeight: 'bold',

  },

  title: {

    fontSize: 36,

    fontWeight: 'bold',

  },

  creditsContainer: {

    backgroundColor: '#FFE4E1',

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 20,

  },

  creditsText: {

    fontSize: 14,

    fontWeight: '600',

  },

  subtitle: {

    fontSize: 16,

    opacity: 0.7,

  },

  searchContainer: {

    paddingHorizontal: 20,

    paddingTop: 10,

    paddingBottom: 20,

  },

  searchInput: {

    borderWidth: 1,

    borderRadius: 25,

    paddingHorizontal: 20,

    paddingVertical: 12,

    fontSize: 16,

    shadowColor: '#000',

    shadowOffset: {

      width: 0,

      height: 2,

    },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

  },

  scrollView: {

    flex: 1,

  },

  postsContainer: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    paddingHorizontal: 20,

    paddingBottom: 20,

    paddingTop: 10,

  },

  postCard: {

    width: cardWidth,

    marginBottom: 15,

    borderRadius: 16,

    shadowColor: '#FF69B4',

    shadowOffset: {

      width: 0,

      height: 4,

    },

    shadowOpacity: 0.15,

    shadowRadius: 8,

    elevation: 5,

    borderWidth: 1,

    borderColor: '#FFE4E1',

    overflow: 'hidden',

  },

  postImage: {

    backgroundColor: '#FFE4E1',

    borderTopLeftRadius: 16,

    borderTopRightRadius: 16,

    overflow: 'hidden',

  },

  postImageContent: {

    width: '100%',

    height: '100%',

  },

  postContent: {

    padding: 12,

    flex: 1,

    justifyContent: 'space-between',

    minHeight: 0,

    flexGrow: 1,

    paddingBottom: 8,

  },

  postName: {

    fontSize: 14,

    fontWeight: '600',

    marginBottom: 4,

  },

  postTopic: {

    fontSize: 12,

    fontWeight: '500',

    marginBottom: 4,

    lineHeight: 16,

    flexShrink: 1,

  },

  postCategory: {

    fontSize: 10,

    fontWeight: '500',

    marginBottom: 6,

    textTransform: 'uppercase',

  },

  postFooter: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 'auto',

  },

  postCost: {

    fontSize: 12,

    fontWeight: 'bold',

  },

  postDuration: {

    fontSize: 10,

    opacity: 0.7,

  },

  modalContainer: {

    flex: 1,

  },

  modalHeader: {

    flexDirection: 'row',

    justifyContent: 'flex-end',

    padding: 20,

    paddingBottom: 10,

  },

  closeButton: {

    width: 30,

    height: 30,

    borderRadius: 15,

    backgroundColor: '#f0f0f0',

    justifyContent: 'center',

    alignItems: 'center',

  },

  closeButtonText: {

    fontSize: 16,

    fontWeight: 'bold',

  },

  modalContent: {

    flex: 1,

    paddingHorizontal: 20,

  },

  modalImage: {

    height: 200,

    backgroundColor: '#f0f0f0',

    borderRadius: 12,

    overflow: 'hidden',

    marginBottom: 20,

  },

  modalImageContent: {

    width: '100%',

    height: '100%',

  },

  modalName: {

    fontSize: 24,

    fontWeight: 'bold',

    marginBottom: 8,

  },

  modalTopic: {

    fontSize: 20,

    fontWeight: '600',

    marginBottom: 8,

    lineHeight: 28,

  },

  modalCategory: {

    fontSize: 14,

    fontWeight: '600',

    marginBottom: 12,

    textTransform: 'uppercase',

  },

  modalLocation: {

    marginBottom: 12,

  },

  modalLocationText: {

    fontSize: 16,

    fontWeight: '500',

  },

  modalSkills: {

    marginBottom: 20,

  },

  modalSkillsTitle: {

    fontSize: 16,

    fontWeight: '600',

    marginBottom: 8,

  },

  skillsContainer: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,

  },

  skillTag: {

    backgroundColor: '#FFE4E1',

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 16,

    marginBottom: 4,

  },

  skillText: {

    fontSize: 12,

    fontWeight: '500',

    color: '#FF69B4',

  },

  modalDetails: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 20,

  },

  modalCost: {

    fontSize: 18,

    fontWeight: 'bold',

  },

  modalDuration: {

    fontSize: 16,

    fontWeight: '500',

  },

  modalDescription: {

    fontSize: 16,

    lineHeight: 24,

    marginBottom: 30,

  },

  enrollButton: {

    paddingVertical: 16,

    borderRadius: 12,

    alignItems: 'center',

    marginBottom: 20,

    backgroundColor: '#FF69B4',

  },

  enrollButtonText: {

    color: 'black',

    fontSize: 16,

    fontWeight: 'bold',

  },

  addSkillInput: {

    borderWidth: 1,

    borderRadius: 12,

    padding: 16,

    fontSize: 16,

    marginBottom: 16,

  },

  addSkillTextArea: {

    height: 100,

    textAlignVertical: 'top',

  },

  addSkillRow: {

    flexDirection: 'row',

    gap: 12,

  },

  addSkillHalf: {

    flex: 1,

  },

  loadingContainer: {

    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 40,

  },

  loadingText: {

    marginTop: 16,

    fontSize: 16,

  },

  imageUploadSection: {

    marginBottom: 16,

  },

  imageUploadLabel: {

    fontSize: 16,

    fontWeight: '600',

    marginBottom: 8,

  },

  imageUploadButton: {

    width: 120,

    height: 120,

    borderRadius: 12,

    borderWidth: 2,

    borderColor: '#ddd',

    borderStyle: 'dashed',

    alignItems: 'center',

    justifyContent: 'center',

    alignSelf: 'center',

  },

  imageUploadPlaceholder: {

    alignItems: 'center',

    justifyContent: 'center',

  },

  imageUploadText: {

    fontSize: 32,

    marginBottom: 4,

  },

  imageUploadSubtext: {

    fontSize: 12,

    color: '#666',

    textAlign: 'center',

  },

  debugText: {

    fontSize: 10,

    color: '#666',

    marginTop: 4,

    textAlign: 'center',

  },

});
