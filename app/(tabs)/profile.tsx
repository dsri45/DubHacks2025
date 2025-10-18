import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Alert, ImageStyle, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

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
  const fileInputRef = useRef<any>(null);

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

      <View style={styles.menuContainer}>
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

        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Editor modal for sections */}
      <Modal visible={editorVisible} animationType="slide" onRequestClose={() => setEditorVisible(false)}>
        <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>{editorField ? `Edit ${editorField}` : 'Edit'}</Text>
          <TextInput
            style={[styles.editorInput, { color: Colors[colorScheme ?? 'light'].text }]}
            multiline
            value={editorValue}
            onChangeText={setEditorValue}
            placeholder="Enter value"
            placeholderTextColor="#999"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {
              if (editorField === 'bio') setBio(editorValue);
              if (editorField === 'skillsHave') setSkillsHave(editorValue);
              if (editorField === 'skillsWant') setSkillsWant(editorValue);
              if (editorField === 'languages') setLanguages(editorValue);
              setEditorVisible(false);
            }}>
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setEditorVisible(false)}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

type Styles = {
  container: ViewStyle;
  profileHeader: ViewStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  name: TextStyle;
  email: TextStyle;
  menuContainer: ViewStyle;
  menuItem: ViewStyle;
  menuText: TextStyle;
  section: ViewStyle;
  sectionRow: ViewStyle;
  sectionTitle: TextStyle;
  sectionValue: TextStyle;
  avatarWrapper: ViewStyle;
  avatarImage: ImageStyle;
  editButton: ViewStyle;
  editButtonText: TextStyle;
  modalContent: ViewStyle;
  expandedImage: ImageStyle;
  expandedPlaceholder: ViewStyle;
  modalButtons: ViewStyle;
  primaryButton: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonText: TextStyle;
  smallEditButton: ViewStyle;
  editorInput: TextStyle;
};

const styles = StyleSheet.create<Styles>({
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
  menuContainer: {
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
  section: {
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  editorInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    minHeight: 120,
    width: '100%',
  },
});