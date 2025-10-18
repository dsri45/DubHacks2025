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
    height: 220 // Taller card
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
    height: 200 // Medium card
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
    height: 240 // Tallest card
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
    height: 210 // Medium-tall card
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
    height: 180 // Shorter card
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
    height: 230 // Medium-tall card
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
    height: 250 // Tall card
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
    height: 190 // Medium card
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
    height: 200 // Medium card
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
    height: 210 // Medium-tall card
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
    height: 220 // Tall card
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
    height: 195 // Medium card
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
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const userCredits = 150; // Sample user credits

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
        <Text style={[styles.postTopic, { color: Colors[colorScheme ?? 'light'].text }]}>
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
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Discover amazing skills to learn
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {samplePosts.map(renderPost)}
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
              
              <View style={styles.modalDetails}>
                <Text style={[styles.modalCost, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {selectedPost.cost} credits
                </Text>
                <Text style={[styles.modalDuration, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Duration: {selectedPost.duration}
                </Text>
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
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
  },
  postName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  postTopic: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
    flexShrink: 1, // Allow topic to shrink if needed
  },
  postCategory: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push footer to bottom
  },
  postCost: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  postDuration: {
    fontSize: 11,
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
