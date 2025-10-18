import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout, clearStorage } = useAuth();

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

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
          onPress={handleEditProfile}
        >
          <Text style={[styles.menuText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Edit Profile
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
    </View>
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
});
