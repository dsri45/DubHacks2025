import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Skill, skillsService, usersService } from '../../services/firebaseService';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout, clearStorage } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorField, setEditorField] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [skillsHave, setSkillsHave] = useState<string>('');
  const [skillsWant, setSkillsWant] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editSkillModal, setEditSkillModal] = useState(false);
  const [editSkillData, setEditSkillData] = useState({
    topic: '',
    description: '',
    cost: '',
    duration: '',
    category: '',
    skills: '',
    location: ''
  });
  const fileInputRef = useRef<any>(null);

  // Friendly labels for editor modal
  const fieldLabels: Record<string, string> = {
    bio: 'Bio',
    skillsHave: 'Skills I Have',
    skillsWant: 'Skills I Want to Learn',
    languages: 'Languages',
  };

  // Load profile fields from Firestore when user is available
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const u = await usersService.getUserById(user.id);
        if (u) {
          setBio(u.bio ?? '');
          setSkillsHave((u.skillsHave && u.skillsHave.join(', ')) ?? '');
          setSkillsWant((u.skillsWant && u.skillsWant.join(', ')) ?? '');
          setLanguages((u.languages && u.languages.join(', ')) ?? '');
          if (u.avatarUrl) setPhotoUri(u.avatarUrl);
        }
      } catch (e) {
        console.error('Failed to load user profile from Firestore:', e);
      }
    };

    loadProfile();
  }, [user]);

  // Load user's skills
  useEffect(() => {
    if (user) {
      loadUserSkills();
    }
  }, [user]);

  // Refresh skills when profile tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadUserSkills();
      }
    }, [user])
  );

  const loadUserSkills = async () => {
    if (!user) return;
    
    try {
      setLoadingSkills(true);
      const allSkills = await skillsService.getAllSkills();
      const userSkillsData = allSkills.filter(skill => skill.userId === user.id);
      setUserSkills(userSkillsData);
    } catch (error) {
      console.error('Error loading user skills:', error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleDeleteSkill = (skillId: string) => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await skillsService.deleteSkill(skillId);
              await loadUserSkills();
              Alert.alert('Success', 'Skill deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete skill');
            }
          }
        }
      ]
    );
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setEditSkillData({
      topic: skill.topic,
      description: skill.description,
      cost: skill.cost.toString(),
      duration: skill.duration,
      category: skill.category,
      skills: skill.skills.join(', '),
      location: skill.location
    });
    setEditSkillModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSkill || !user) return;

    try {
      const updatedSkillData = {
        topic: editSkillData.topic,
        description: editSkillData.description,
        cost: parseInt(editSkillData.cost) || 0,
        duration: editSkillData.duration,
        category: editSkillData.category,
        skills: editSkillData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        location: editSkillData.location
      };

      await skillsService.updateSkill(editingSkill.id!, updatedSkillData);
      await loadUserSkills();
      setEditSkillModal(false);
      setEditingSkill(null);
      Alert.alert('Success', 'Skill updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update skill');
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would go here');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality would go here');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const openImagePickerAsync = async () => {
    if (Platform.OS === 'web') {
      // trigger a hidden file input for web
      fileInputRef.current?.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // some installed versions expect the lowercase string values
      // (e.g. 'images', 'videos', 'livePhotos') so pass the literal to avoid runtime casting issues
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!(result as any).cancelled) {
      // expo-image-picker v14 returns an object with assets
      const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
      if (uri) setPhotoUri(uri);
    }
  };

  const onWebFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUri(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Edit profile photo"
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: Colors[colorScheme ?? 'light'].text }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>

      {/* Modal for expanded view + upload controls */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.modalContent}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.expandedImage} contentFit="contain" />
            ) : (
              <View style={[styles.expandedPlaceholder, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={openImagePickerAsync}>
                <Text style={styles.primaryButtonText}>Choose Image</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.secondaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Web file input fallback (hidden) */}
      {Platform.OS === 'web' && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onWebFileChange} />
      )}

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Bio</Text>
          <TouchableOpacity
            style={styles.smallEditButton}
            onPress={() => {
              setEditorField('bio');
              setEditorValue(bio);
              setEditorVisible(true);
            }}
          >
            <Text style={[styles.editButtonText, styles.smallEditButtonText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
          {bio || 'Add a short bio...'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Skills I Have</Text>
          <TouchableOpacity
            style={styles.smallEditButton}
            onPress={() => {
              setEditorField('skillsHave');
              setEditorValue(skillsHave);
              setEditorVisible(true);
            }}
          >
            <Text style={[styles.editButtonText, styles.smallEditButtonText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
          {skillsHave || 'Add your skills...'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Skills I Want to Learn</Text>
          <TouchableOpacity
            style={styles.smallEditButton}
            onPress={() => {
              setEditorField('skillsWant');
              setEditorValue(skillsWant);
              setEditorVisible(true);
            }}
          >
            <Text style={[styles.editButtonText, styles.smallEditButtonText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
          {skillsWant || 'Add skills you want to learn...'}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Languages</Text>
          <TouchableOpacity
            style={styles.smallEditButton}
            onPress={() => {
              setEditorField('languages');
              setEditorValue(languages);
              setEditorVisible(true);
            }}
          >
            <Text style={[styles.editButtonText, styles.smallEditButtonText]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
          {languages || 'Add languages you speak...'}
        </Text>
      </View>

      {/* User's Skills Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            My Skills
          </Text>
          <View style={styles.skillCountBadge}>
            <Text style={styles.skillCountText}>{userSkills.length}</Text>
          </View>
        </View>
        {loadingSkills ? (
          <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading your skills...
          </Text>
        ) : userSkills.length === 0 ? (
          <Text style={[styles.sectionValue, { color: Colors[colorScheme ?? 'light'].text }]}>
            You haven't posted any skills yet. Go to the home tab to add your first skill!
          </Text>
        ) : (
          <FlatList
            data={userSkills}
            keyExtractor={(item) => item.id || `skill-${Math.random()}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.skillCard}
                onPress={() => handleEditSkill(item)}
                onLongPress={() => handleDeleteSkill(item.id!)}
              >
                <View style={styles.skillCardContent}>
                  <Text style={styles.skillTitle}>
                    {item.topic}
                  </Text>
                  <View style={styles.skillTags}>
                    {item.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillTagText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.skillActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleEditSkill(item)}
                  >
                    <Text style={styles.actionIconText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDeleteSkill(item.id!)}
                  >
                    <Text style={styles.actionIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        )}
      </View>

      <TouchableOpacity 
        style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
        onPress={handleLogout}
      >
        <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
      </TouchableOpacity>

      {/* Editor modal for sections */}
      <Modal visible={editorVisible} animationType="slide" onRequestClose={() => setEditorVisible(false)}>
        <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>{editorField ? `Edit ${fieldLabels[editorField] ?? editorField}` : 'Edit'}</Text>
          <TextInput
            style={[styles.editorInput, { color: Colors[colorScheme ?? 'light'].text }]}
            multiline
            value={editorValue}
            onChangeText={setEditorValue}
            placeholder="Enter value"
            placeholderTextColor="#999"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={async () => {
                if (!user?.id) {
                  Alert.alert('Error', 'No user logged in');
                  return;
                }

                // Update local state
                if (editorField === 'bio') setBio(editorValue);
                if (editorField === 'skillsHave') setSkillsHave(editorValue);
                if (editorField === 'skillsWant') setSkillsWant(editorValue);
                if (editorField === 'languages') setLanguages(editorValue);

                // Prepare data for Firestore
                const updateData: any = {};
                if (editorField === 'bio') updateData.bio = editorValue;
                if (editorField === 'skillsHave') updateData.skillsHave = editorValue.split(',').map(s => s.trim()).filter(Boolean);
                if (editorField === 'skillsWant') updateData.skillsWant = editorValue.split(',').map(s => s.trim()).filter(Boolean);
                if (editorField === 'languages') updateData.languages = editorValue.split(',').map(s => s.trim()).filter(Boolean);

                try {
                  await usersService.updateUserProfile(user.id, updateData);
                  Alert.alert('Saved', 'Profile updated');
                } catch (e) {
                  console.error('Failed to update profile:', e);
                  Alert.alert('Error', 'Failed to save changes');
                } finally {
                  setEditorVisible(false);
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setEditorVisible(false)}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal visible={editSkillModal} animationType="slide" onRequestClose={() => setEditSkillModal(false)}>
        <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditSkillModal(false)}
            >
              <Text style={[styles.closeButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Edit Skill
            </Text>
            
            <TextInput
              style={[styles.addSkillInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }]}
              placeholder="Skill/Topic"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={editSkillData.topic}
              onChangeText={(text) => setEditSkillData({...editSkillData, topic: text})}
            />
            
            <TextInput
              style={[styles.addSkillInput, styles.addSkillTextArea, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }]}
              placeholder="Description"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={editSkillData.description}
              onChangeText={(text) => setEditSkillData({...editSkillData, description: text})}
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
                value={editSkillData.cost}
                onChangeText={(text) => setEditSkillData({...editSkillData, cost: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.addSkillInput, styles.addSkillHalf, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].text
                }]}
                placeholder="Duration"
                placeholderTextColor={Colors[colorScheme ?? 'light'].text}
                value={editSkillData.duration}
                onChangeText={(text) => setEditSkillData({...editSkillData, duration: text})}
              />
            </View>
            
            <TextInput
              style={[styles.addSkillInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }]}
              placeholder="Skills (comma-separated)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={editSkillData.skills}
              onChangeText={(text) => setEditSkillData({...editSkillData, skills: text})}
            />

            <TextInput
              style={[styles.addSkillInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }]}
              placeholder="Location"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={editSkillData.location}
              onChangeText={(text) => setEditSkillData({...editSkillData, location: text})}
            />

            <TextInput
              style={[styles.addSkillInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }]}
              placeholder="Category"
              placeholderTextColor={Colors[colorScheme ?? 'light'].text}
              value={editSkillData.category}
              onChangeText={(text) => setEditSkillData({...editSkillData, category: text})}
            />
            
            <TouchableOpacity
              style={[styles.enrollButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.enrollButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.3,
  },
  skillCountBadge: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  skillCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionValue: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(0, 123, 255, 0)',
    elevation: 2,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  expandedImage: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  expandedPlaceholder: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: 'rgba(0, 123, 255, 0)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#111',
    fontWeight: '600',
  },
  smallEditButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(0, 123, 255, 0)',
  },
  smallEditButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  editorInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    minHeight: 120,
    width: '100%',
  },
  menuItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // User Skills Styles
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  skillCardContent: {
    flex: 1,
    paddingRight: 16,
  },
  skillTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2c3e50',
    letterSpacing: 0.3,
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
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.2,
  },
  skillActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconText: {
    fontSize: 16,
  },
  // Modal styles (reused from home)
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
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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