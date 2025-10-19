import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Configuration
const GEMINI_API_KEY = 'AIzaSyDrt7F-MR5rVDm3FKURLXYVPHdOFjbPD1s';

interface UserPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  skills: string[];
  lookingFor: string[];
  bio: string;
  location: string;
  languages: string[];
  availability: string;
}

// Sample user data across the world
const mockUsers: UserPin[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    latitude: 47.6062,
    longitude: -122.3321,
    skills: ['Digital Art', 'Illustration', 'Procreate'],
    lookingFor: ['3D Modeling', 'Animation'],
    bio: 'Digital artist passionate about illustration and design',
    location: 'Seattle, WA',
    languages: ['English', 'Mandarin'],
    availability: 'Weekends',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    latitude: 40.7128,
    longitude: -74.006,
    skills: ['3D Printing', 'CAD Design', 'Engineering'],
    lookingFor: ['Electronics', 'Robotics'],
    bio: 'Mechanical engineer and maker enthusiast',
    location: 'New York, NY',
    languages: ['English', 'Spanish'],
    availability: 'Evenings',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    latitude: 51.5074,
    longitude: -0.1278,
    skills: ['Guitar', 'Music Theory', 'Composition'],
    lookingFor: ['Piano', 'Music Production'],
    bio: 'Professional musician and music teacher',
    location: 'London, UK',
    languages: ['English', 'Spanish', 'Portuguese'],
    availability: 'Flexible',
  },
  {
    id: '4',
    name: 'David Kim',
    latitude: 37.5665,
    longitude: 126.978,
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    lookingFor: ['Video Editing', 'Graphic Design'],
    bio: 'Marketing specialist with focus on social media',
    location: 'Seoul, South Korea',
    languages: ['Korean', 'English'],
    availability: 'Weekdays',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    latitude: 31.2304,
    longitude: 121.4737,
    skills: ['Origami', 'Paper Crafts', 'Art History'],
    lookingFor: ['Calligraphy', 'Traditional Arts'],
    bio: 'Traditional arts enthusiast and teacher',
    location: 'Shanghai, China',
    languages: ['Mandarin', 'English'],
    availability: 'Weekends',
  },
  {
    id: '6',
    name: 'Alex Thompson',
    latitude: -33.8688,
    longitude: 151.2093,
    skills: ['Photography', 'Photo Editing', 'Lightroom'],
    lookingFor: ['Videography', 'Drone Operation'],
    bio: 'Professional photographer specializing in portraits',
    location: 'Sydney, Australia',
    languages: ['English'],
    availability: 'Flexible',
  },
  {
    id: '7',
    name: 'Maria Santos',
    latitude: -23.5505,
    longitude: -46.6333,
    skills: ['Web Development', 'React', 'Node.js'],
    lookingFor: ['Mobile Development', 'UI/UX Design'],
    bio: 'Full-stack developer passionate about clean code',
    location: 'São Paulo, Brazil',
    languages: ['Portuguese', 'English', 'Spanish'],
    availability: 'Evenings',
  },
  {
    id: '8',
    name: 'James Wilson',
    latitude: 34.0522,
    longitude: -118.2437,
    skills: ['Cooking', 'Baking', 'Recipe Development'],
    lookingFor: ['Food Photography', 'Nutrition'],
    bio: 'Chef and culinary instructor',
    location: 'Los Angeles, CA',
    languages: ['English', 'French'],
    availability: 'Weekends',
  },
  {
    id: '9',
    name: 'Priya Patel',
    latitude: 19.076,
    longitude: 72.8777,
    skills: ['Yoga', 'Meditation', 'Wellness Coaching'],
    lookingFor: ['Nutrition', 'Fitness Training'],
    bio: 'Certified yoga instructor and wellness advocate',
    location: 'Mumbai, India',
    languages: ['Hindi', 'English', 'Gujarati'],
    availability: 'Mornings',
  },
  {
    id: '10',
    name: 'Carlos Rodriguez',
    latitude: 40.4168,
    longitude: -3.7038,
    skills: ['Spanish Language', 'Language Teaching', 'Translation'],
    lookingFor: ['English Teaching', 'French'],
    bio: 'Language teacher with 10 years of experience',
    location: 'Madrid, Spain',
    languages: ['Spanish', 'English', 'Catalan'],
    availability: 'Flexible',
  },
  {
    id: '11',
    name: 'Emma Davis',
    latitude: 49.2827,
    longitude: -123.1207,
    skills: ['Graphic Design', 'Adobe Suite', 'Branding'],
    lookingFor: ['Web Design', 'Motion Graphics'],
    bio: 'Creative designer focused on brand identity',
    location: 'Vancouver, Canada',
    languages: ['English', 'French'],
    availability: 'Weekdays',
  },
  {
    id: '12',
    name: 'Michael Chen',
    latitude: 1.3521,
    longitude: 103.8198,
    skills: ['Data Analysis', 'Excel', 'Python'],
    lookingFor: ['Machine Learning', 'SQL'],
    bio: 'Data analyst working with business intelligence',
    location: 'Singapore',
    languages: ['English', 'Mandarin', 'Malay'],
    availability: 'Evenings',
  },
];

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPin | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserPin[]>(mockUsers);
  const [region, setRegion] = useState({
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  });

  // Simple text search
  const handleTextSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(mockUsers);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.location.toLowerCase().includes(lowercaseQuery) ||
      user.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
      user.lookingFor.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
      user.bio.toLowerCase().includes(lowercaseQuery) ||
      user.languages.some(lang => lang.toLowerCase().includes(lowercaseQuery))
    );
    
    // Defensive: never set to empty array, fallback to all users
    const newFiltered = filtered.length > 0 ? filtered : mockUsers;
    setFilteredUsers(newFiltered);
    
    // If selectedUser is not in the new filtered list, reset it
    if (!newFiltered.length || (selectedUser && !newFiltered.some(u => u.id === selectedUser.id))) {
      setSelectedUser(null);
      setRegion({
        latitude: 20,
        longitude: 0,
        latitudeDelta: 100,
        longitudeDelta: 100,
      });
    }
  };

  const handleMarkerPress = (user: UserPin) => {
    setSelectedUser(user);
    setRegion({
      latitude: user.latitude,
      longitude: user.longitude,
      latitudeDelta: 10,
      longitudeDelta: 10,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Find People
        </Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].text
            }]}
            placeholder="Search by skills, location, or describe what you're looking for..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              handleTextSearch(searchQuery);
              Keyboard.dismiss();
            }}
            returnKeyType="search"
            blurOnSubmit={true}
            multiline={false}
          />
          

        </View>

        <Text style={[styles.resultsCount, { color: Colors[colorScheme ?? 'light'].text }]}>
          {filteredUsers.length} people found
        </Text>
      </View>

      <View style={styles.map}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {Array.isArray(filteredUsers) && filteredUsers.map((user) => {
            if (!user || typeof user.latitude !== 'number' || typeof user.longitude !== 'number') return null;
            return (
              <Marker
                key={user.id}
                coordinate={{
                  latitude: user.latitude,
                  longitude: user.longitude,
                }}
                onPress={() => handleMarkerPress(user)}
                pinColor={selectedUser?.id === user.id ? '#FF69B4' : '#0a7ea4'}
              >
                <View style={styles.markerContainer}>
                  <View style={[
                    styles.markerCircle,
                    { backgroundColor: selectedUser?.id === user.id ? '#FF69B4' : '#0a7ea4' }
                  ]}>
                    <Text style={styles.markerText}>{user.name.charAt(0)}</Text>
                  </View>
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>

      {/* User Detail Modal */}
      <Modal
        visible={selectedUser !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <View style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedUser(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={[styles.modalAvatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <Text style={styles.modalAvatarText}>{selectedUser.name.charAt(0)}</Text>
              </View>

              <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>
                {selectedUser.name}
              </Text>

              <Text style={[styles.modalLocation, { color: Colors[colorScheme ?? 'light'].text }]}>
                📍 {selectedUser.location}
              </Text>

              <Text style={[styles.modalBio, { color: Colors[colorScheme ?? 'light'].text }]}>
                {selectedUser.bio}
              </Text>

              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Skills They Have
                </Text>
                <View style={styles.skillTags}>
                  {selectedUser.skills.map((skill, idx) => (
                    <View key={idx} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Looking to Learn
                </Text>
                <View style={styles.skillTags}>
                  {selectedUser.lookingFor.map((skill, idx) => (
                    <View key={idx} style={[styles.skillTag, styles.wantTag]}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Languages
                </Text>
                <Text style={[styles.modalText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {selectedUser.languages.join(', ')}
                </Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Availability
                </Text>
                <Text style={[styles.modalText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {selectedUser.availability}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => {
                  Alert.alert('Connect', `Send a connection request to ${selectedUser.name}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Connect', 
                      onPress: () => {
                        setSelectedUser(null);
                        Alert.alert('Success', 'Connection request sent!');
                      }
                    }
                  ]);
                }}
              >
                <Text style={styles.connectButtonText}>Connect 🤝</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 50,
  },

  resultsCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    opacity: 0.7,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  wantTag: {
    backgroundColor: '#0a7ea4',
  },
  skillTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  userBio: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalAvatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  modalName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalLocation: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  modalBio: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  connectButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});