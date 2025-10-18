import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock search results
  const searchResults = [
    { id: '1', title: 'Sample Result 1', description: 'This is a sample search result' },
    { id: '2', title: 'Sample Result 2', description: 'Another sample search result' },
    { id: '3', title: 'Sample Result 3', description: 'Yet another sample search result' },
  ];

  const filteredResults = searchResults.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
        Search
      </Text>
      
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          color: Colors[colorScheme ?? 'light'].text,
          borderColor: Colors[colorScheme ?? 'light'].text
        }]}
        placeholder="Search..."
        placeholderTextColor={Colors[colorScheme ?? 'light'].text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.resultItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <Text style={[styles.resultTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.title}
            </Text>
            <Text style={[styles.resultDescription, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.description}
            </Text>
          </View>
        )}
        style={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  resultDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
});
