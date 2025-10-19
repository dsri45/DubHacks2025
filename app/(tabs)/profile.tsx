import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
<<<<<<< Updated upstream
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
=======
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Skill, skillsService, usersService } from '../../services/firebaseService';
>>>>>>> Stashed changes

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout, clearStorage } = useAuth();
<<<<<<< Updated upstream
=======
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorField, setEditorField] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState<string>('');
  // Friendly labels for editor fields
  const fieldLabels: Record<string, string> = {
    bio: 'Bio',
    skillsHave: 'Skills I Have',
    skillsWant: 'Skills I Want to Learn',
    languages: 'Languages',
  };
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

  // Load user's skills
  useEffect(() => {
    if (user) {
      loadUserSkills();
    }
  }, [user]);

  // Load user profile fields from Firestore when authenticated
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const userData = await usersService.getUserById(user.id);
        if (userData) {
          setBio(userData.bio || '');
          setSkillsHave((userData.skillsHave || []).join(', '));
          setSkillsWant((userData.skillsWant || []).join(', '));
          setLanguages((userData.languages || []).join(', '));
          if (userData.avatarUrl) setPhotoUri(userData.avatarUrl);
        }
      } catch (err) {
        console.warn('Failed to load user profile:', err);
      }
    };

    loadProfile();
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
>>>>>>> Stashed changes

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality would go here');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality would go here');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  const handleClearStorage = () => {
    Alert.alert('Clear Storage', 'This will clear all stored data and log you out. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearStorage }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: Colors[colorScheme ?? 'light'].text }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>

<<<<<<< Updated upstream
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleEditProfile}
        >
          <Text style={[styles.menuText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Edit Profile
=======
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
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} onPress={openImagePickerAsync}>
                <Text style={[styles.primaryButtonText, { color: '#fff' }]}>Choose Image</Text>
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
            <Text style={styles.editButtonText}>Edit</Text>
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
            <Text style={styles.editButtonText}>Edit</Text>
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
            <Text style={styles.editButtonText}>Edit</Text>
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
            <Text style={styles.editButtonText}>Edit</Text>
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
>>>>>>> Stashed changes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleSettings}
        >
          <Text style={[styles.menuText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleClearStorage}
        >
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>
            Clear Storage (Debug)
          </Text>
        </TouchableOpacity>
      </View>
<<<<<<< Updated upstream
    </View>
=======

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
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]} onPress={async () => {
              // Update local state
              if (editorField === 'bio') setBio(editorValue);
              if (editorField === 'skillsHave') setSkillsHave(editorValue);
              if (editorField === 'skillsWant') setSkillsWant(editorValue);
              if (editorField === 'languages') setLanguages(editorValue);

              // Persist to Firestore if we have a logged-in user
              if (user) {
                try {
                  const updateData: any = {};
                  if (editorField === 'bio') updateData.bio = editorValue;
                  if (editorField === 'skillsHave') updateData.skillsHave = editorValue.split(',').map(s => s.trim()).filter(Boolean);
                  if (editorField === 'skillsWant') updateData.skillsWant = editorValue.split(',').map(s => s.trim()).filter(Boolean);
                  if (editorField === 'languages') updateData.languages = editorValue.split(',').map(s => s.trim()).filter(Boolean);

                  if (Object.keys(updateData).length > 0) {
                    await usersService.updateUserProfile(user.id, updateData);
                  }
                } catch (err) {
                  Alert.alert('Save failed', 'Could not save profile changes. Please try again.');
                  console.error('Failed to save profile:', err);
                }
              }

              setEditorVisible(false);
            }}>
              <Text style={[styles.primaryButtonText, { color: '#fff' }]}>Save</Text>
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
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
<<<<<<< Updated upstream
  menuContainer: {
=======
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
    color: '#000',
  },
  modalContent: {
>>>>>>> Stashed changes
    flex: 1,
  },
  menuItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
