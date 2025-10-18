import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userCredits = 150; // Sample user credits

  // Filter posts based on search query
  const filteredPosts = samplePosts.filter(post => 
    post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderPost = (post: Post) => (
    <TouchableOpacity
      key={post.id}
      style={[
        styles.postCard, 
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: post.height
        }
      ]}
      onPress={() => setSelectedPost(post)}
    >
      <View style={[styles.postImage, { height: post.height * 0.6 }]}>
        <Image 
          source={post.image} 
          style={styles.postImageContent}
          resizeMode="cover"
        />
      </View>
      <View style={styles.postContent}>
        <Text style={[styles.postName, { color: Colors[colorScheme ?? 'light'].text }]}>
          {post.name}
        </Text>
        <Text 
          style={[styles.postTopic, { color: Colors[colorScheme ?? 'light'].text }]}
          numberOfLines={3}
        >
          {post.topic}
        </Text>
        <Text style={[styles.postCategory, { color: '#FF69B4' }]}>
          {post.category}
        </Text>
        <View style={styles.postFooter}>
          <Text style={[styles.postCost, { color: Colors[colorScheme ?? 'light'].text }]}>
            {post.cost} credits
          </Text>
          <Text style={[styles.postDuration, { color: Colors[colorScheme ?? 'light'].text }]}>
            {post.duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            DubHacks
          </Text>
          <View style={styles.creditsContainer}>
            <Text style={[styles.creditsText, { color: '#FF69B4' }]}>
              {userCredits} credits
            </Text>
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
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map(renderPost)}
      </ScrollView>

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
                <Image 
                  source={selectedPost.image} 
                  style={styles.modalImageContent}
                  resizeMode="cover"
                />
              </View>
              
              <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>
                {selectedPost.name}
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
                onPress={() => {
                  // TODO: Implement enrollment logic
                  setSelectedPost(null);
                }}
              >
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
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
    overflow: 'hidden', // Ensure content stays within card bounds
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
    minHeight: 0, // Allow flex to work properly
    flexGrow: 1, // Allow content to grow
    paddingBottom: 8, // Reduce bottom padding to fit more content
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
    flexShrink: 1, // Allow topic to shrink if needed
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
    marginTop: 'auto', // Push footer to bottom
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
});
