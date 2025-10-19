import { Colors } from '@/constants/theme';

import { useAuth } from '@/contexts/AuthContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

import React, { useEffect, useState } from 'react';

import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, Region } from 'react-native-maps';

import { courseRequestService, Skill, skillsService } from '../../services/firebaseService';

 

interface MapSkill extends Skill {

  latitude?: number | null;

  longitude?: number | null;

  postalCode?: string | null;

}

 

export default function MapScreen() {

  const colorScheme = useColorScheme();

  const { user } = useAuth();

  const [skills, setSkills] = useState<MapSkill[]>([]);

  const [selectedSkill, setSelectedSkill] = useState<MapSkill | null>(null);

  const [region, setRegion] = useState<Region>({ latitude: 20, longitude: 0, latitudeDelta: 100, longitudeDelta: 100 });

 

  useEffect(() => {

    const unsubscribe = skillsService.subscribeToAllSkills((data: any[]) => setSkills((data || []) as MapSkill[]));

    return () => unsubscribe && unsubscribe();

  }, []);

 

  const handleMarkerPress = (skill: MapSkill) => {

    setSelectedSkill(skill);

    if (typeof skill.latitude === 'number' && typeof skill.longitude === 'number') {

      setRegion({ latitude: skill.latitude, longitude: skill.longitude, latitudeDelta: 10, longitudeDelta: 10 });

    }

  };

 

  const handleRequestEnrollment = async () => {

    if (!selectedSkill || !user) {

      Alert.alert('Error', 'Please log in to request enrollment');

      return;

    }

 

    Alert.alert(

      'Request Enrollment',

      `Send enrollment request for "${selectedSkill.topic}" to ${selectedSkill.userName}?`,

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

                selectedSkill,

                `Hi! I'd like to enroll in your "${selectedSkill.topic}" course.`

              );

 

              setSelectedSkill(null);

              Alert.alert('Success', 'Enrollment request sent! The teacher will review and approve your request.');

            } catch (error: any) {

              Alert.alert('Error', 'Failed to send request: ' + (error?.message || 'Unknown error'));

            }

          }

        }

      ]

    );

  };

 

  return (

    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

      <View style={styles.header}>

        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Map</Text>

        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>{skills.length} skills</Text>

      </View>

 

      <MapView style={styles.map} region={region} onRegionChangeComplete={(r) => setRegion(r)} showsUserLocation>

        {skills

          .filter((s) => typeof s.latitude === 'number' && typeof s.longitude === 'number')

          .map((s) => (

            <Marker

              key={s.id}

              coordinate={{ latitude: s.latitude as number, longitude: s.longitude as number }}

              onPress={() => handleMarkerPress(s)}

              pinColor={selectedSkill?.id === s.id ? '#FF69B4' : '#0a7ea4'}

            >

              <View style={styles.markerContainer}>

                <View style={[

                  styles.markerCircle,

                  { backgroundColor: selectedSkill?.id === s.id ? '#FF69B4' : '#0a7ea4' }

                ]}>

                  <Text style={styles.markerText}>

                    {s.userName?.charAt(0) || s.topic?.charAt(0) || '?'}

                  </Text>

                </View>

              </View>

            </Marker>

          ))}

      </MapView>

 

      <Modal visible={!!selectedSkill} onRequestClose={() => setSelectedSkill(null)} animationType="slide" presentationStyle="pageSheet">

        {selectedSkill && (

          <View style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

            <View style={styles.modalHeader}>

              <TouchableOpacity onPress={() => setSelectedSkill(null)} style={styles.closeButton}>

                <Text style={styles.closeButtonText}>✕</Text>

              </TouchableOpacity>

            </View>

            <ScrollView style={styles.modalContent}>

              <View style={[styles.modalAvatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>

                <Text style={styles.modalAvatarText}>

                  {selectedSkill.userName?.charAt(0) || selectedSkill.topic?.charAt(0) || '?'}

                </Text>

              </View>

 

              <Text style={[styles.modalName, { color: Colors[colorScheme ?? 'light'].text }]}>

                {selectedSkill.userName || 'User'}

              </Text>

 

              <Text style={[styles.modalSkillTopic, { color: Colors[colorScheme ?? 'light'].text }]}>

                Teaching: {selectedSkill.topic}

              </Text>

 

              <Text style={[styles.modalLocation, { color: Colors[colorScheme ?? 'light'].text }]}>

                📍 {selectedSkill.location}

              </Text>

 

              {selectedSkill.description && (

                <Text style={[styles.modalBio, { color: Colors[colorScheme ?? 'light'].text }]}>

                  {selectedSkill.description}

                </Text>

              )}

 

              <View style={styles.modalSection}>

                <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>

                  Course Details

                </Text>

                <View style={styles.detailsCard}>

                  <View style={styles.detailItem}>

                    <Text style={styles.detailLabel}>Category:</Text>

                    <Text style={[styles.detailValue, { color: '#FF69B4' }]}>

                      {selectedSkill.category}

                    </Text>

                  </View>

                  <View style={styles.detailItem}>

                    <Text style={styles.detailLabel}>Cost:</Text>

                    <Text style={styles.detailValue}>{selectedSkill.cost} credits</Text>

                  </View>

                  <View style={styles.detailItem}>

                    <Text style={styles.detailLabel}>Duration:</Text>

                    <Text style={styles.detailValue}>{selectedSkill.duration}</Text>

                  </View>

                  {!!selectedSkill.postalCode && (

                    <View style={styles.detailItem}>

                      <Text style={styles.detailLabel}>Postal Code:</Text>

                      <Text style={styles.detailValue}>{selectedSkill.postalCode}</Text>

                    </View>

                  )}

                </View>

              </View>

 

              {selectedSkill.skills && selectedSkill.skills.length > 0 && (

                <View style={styles.modalSection}>

                  <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>

                    Skills Covered

                  </Text>

                  <View style={styles.skillTags}>

                    {selectedSkill.skills.map((skill, idx) => (

                      <View key={idx} style={styles.skillTag}>

                        <Text style={styles.skillTagText}>{skill}</Text>

                      </View>

                    ))}

                  </View>

                </View>

              )}

 

              <TouchableOpacity

                style={styles.connectButton}

                onPress={handleRequestEnrollment}

              >

                <Text style={styles.connectButtonText}>Request Enrollment 📚</Text>

              </TouchableOpacity>

            </ScrollView>

          </View>

        )}

      </Modal>

    </View>

  );

}

 

const styles = StyleSheet.create({

  container: { flex: 1 },

  header: { padding: 16, paddingTop: 56 },

  title: { fontSize: 28, fontWeight: 'bold' },

  subtitle: { fontSize: 14, opacity: 0.7 },

  map: { flex: 1 },

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

  modalContainer: { flex: 1 },

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

    alignItems: 'center',

    justifyContent: 'center'

  },

  closeButtonText: {

    fontSize: 20,

    fontWeight: 'bold',

    color: '#333',

  },

  modalContent: {

    flex: 1,

    paddingHorizontal: 20

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

  modalSkillTopic: {

    fontSize: 18,

    fontWeight: '600',

    textAlign: 'center',

    marginBottom: 8,

    color: '#FF69B4',

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

    marginBottom: 24

  },

  modalSectionTitle: {

    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 12,

  },

  detailsCard: {

    backgroundColor: '#FFE4E1',

    borderRadius: 12,

    padding: 16,

    borderWidth: 1,

    borderColor: '#FFB6C1',

    gap: 8,

  },

  detailItem: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

  },

  detailLabel: {

    fontSize: 14,

    fontWeight: '600',

    color: '#666',

  },

  detailValue: {

    fontSize: 14,

    fontWeight: '500',

    color: '#333',

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

  skillTagText: {

    color: 'white',

    fontSize: 12,

    fontWeight: '600',

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