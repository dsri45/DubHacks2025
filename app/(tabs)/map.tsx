import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Mock locations for learning sessions
  const locations = [
    { id: '1', name: 'Central Library', address: '123 Main St', sessions: 5, distance: '0.5 mi' },
    { id: '2', name: 'Community Center', address: '456 Oak Ave', sessions: 3, distance: '1.2 mi' },
    { id: '3', name: 'Tech Hub', address: '789 Pine St', sessions: 8, distance: '2.1 mi' },
    { id: '4', name: 'Art Studio', address: '321 Elm St', sessions: 4, distance: '1.8 mi' },
    { id: '5', name: 'Music Academy', address: '654 Maple Ave', sessions: 6, distance: '3.2 mi' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Find Learning Sessions
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Discover nearby learning opportunities
        </Text>
      </View>

      {/* Mock Map Area */}
      <View style={[styles.mapContainer, { backgroundColor: '#f0f0f0' }]}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️</Text>
          <Text style={[styles.mapLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Interactive Map
          </Text>
          <Text style={[styles.mapSubtext, { color: Colors[colorScheme ?? 'light'].text }]}>
            Tap locations to see details
          </Text>
        </View>
      </View>

      {/* Location List */}
      <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Nearby Learning Centers
        </Text>
        
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationCard,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: selectedLocation === location.id ? '#FF69B4' : '#e0e0e0'
              }
            ]}
            onPress={() => setSelectedLocation(
              selectedLocation === location.id ? null : location.id
            )}
          >
            <View style={styles.locationHeader}>
              <Text style={[styles.locationName, { color: Colors[colorScheme ?? 'light'].text }]}>
                {location.name}
              </Text>
              <Text style={[styles.distance, { color: '#FF69B4' }]}>
                {location.distance}
              </Text>
            </View>
            
            <Text style={[styles.locationAddress, { color: Colors[colorScheme ?? 'light'].text }]}>
              {location.address}
            </Text>
            
            <View style={styles.locationFooter}>
              <Text style={[styles.sessionsCount, { color: Colors[colorScheme ?? 'light'].text }]}>
                {location.sessions} sessions available
              </Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>

            {selectedLocation === location.id && (
              <View style={styles.expandedInfo}>
                <Text style={[styles.expandedText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  📍 Available sessions: Drawing, Programming, Music, Photography
                </Text>
                <Text style={[styles.expandedText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  ⏰ Open: Mon-Fri 9AM-8PM, Sat-Sun 10AM-6PM
                </Text>
                <Text style={[styles.expandedText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  💰 Average cost: 35-50 credits per session
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 48,
    marginBottom: 10,
  },
  mapLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  mapSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  locationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationAddress: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  expandedInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  expandedText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});
