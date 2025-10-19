import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      lastMessage: 'Thanks for the great drawing session!',
      timestamp: '2m ago',
      unreadCount: 0,
      avatar: '🎨'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      lastMessage: 'When is the next 3D printing workshop?',
      timestamp: '1h ago',
      unreadCount: 2,
      avatar: '🖨️'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      lastMessage: 'The guitar lesson was amazing!',
      timestamp: '3h ago',
      unreadCount: 0,
      avatar: '🎸'
    },
    {
      id: '4',
      name: 'David Kim',
      lastMessage: 'Can we schedule a marketing consultation?',
      timestamp: '1d ago',
      unreadCount: 1,
      avatar: '📱'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      lastMessage: 'The origami techniques were so helpful',
      timestamp: '2d ago',
      unreadCount: 0,
      avatar: '📄'
    },
  ]);

  // Mock messages per conversation (make stateful so we can append)
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', sender: 'Sarah Chen', content: 'Loved the drawing tips today — thanks!', timestamp: '2m ago', isRead: true },
      { id: '2', sender: 'You', content: 'Glad it helped! Want to practice together?', timestamp: '1m ago', isRead: true },
    ],
    '2': [
      { id: '1', sender: 'Marcus Johnson', content: 'When is the next 3D printing workshop?', timestamp: '1h ago', isRead: false },
      { id: '2', sender: 'You', content: 'Next Saturday at 10am — want me to save a spot?', timestamp: '55m ago', isRead: true },
      { id: '3', sender: 'Marcus Johnson', content: 'Yes please, that would be great!', timestamp: '50m ago', isRead: false },
    ],
    '3': [
      { id: '1', sender: 'Elena Rodriguez', content: 'The guitar lesson was amazing — thanks for the chord charts.', timestamp: '3h ago', isRead: true },
    ],
    '4': [
      { id: '1', sender: 'David Kim', content: 'Can we schedule a marketing consultation next week?', timestamp: '1d ago', isRead: false },
    ],
    '5': [
      { id: '1', sender: 'Lisa Wang', content: 'The origami techniques were so helpful. Any tips for beginners?', timestamp: '2d ago', isRead: true },
    ],
  });

  const renderConversation = (conversation: Conversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={[
        styles.conversationCard,
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: selectedConversation === conversation.id ? '#FF69B4' : '#e0e0e0'
        }
      ]}
      onPress={() => setSelectedConversation(conversation.id)}
    >
      <View style={styles.conversationHeader}>
        <Text style={styles.avatar}>{conversation.avatar}</Text>
        <View style={styles.conversationInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.conversationName, { color: Colors[colorScheme ?? 'light'].text }]}>
              {conversation.name}
            </Text>
            <Text style={[styles.timestamp, { color: Colors[colorScheme ?? 'light'].text }]}>
              {conversation.timestamp}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage, 
                { color: Colors[colorScheme ?? 'light'].text },
                conversation.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {conversation.lastMessage}
            </Text>
            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageBubble,
        message.sender === 'You' ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        { color: message.sender === 'You' ? 'white' : 'black' }
      ]}>
        {message.content}
      </Text>
      <Text style={[
        styles.messageTime,
        { color: message.sender === 'You' ? 'rgba(255,255,255,0.7)' : Colors[colorScheme ?? 'light'].text }
      ]}>
        {message.timestamp}
      </Text>
    </View>
  );

  if (selectedConversation) {
    // pick messages for the selected conversation
    const messagesForSelected = conversationMessages[selectedConversation] ?? [];
    const currentConversation = conversations.find(c => c.id === selectedConversation);

    const handleSend = () => {
      const text = newMessage.trim();
      if (!text) return;

      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: text,
        timestamp: 'Now',
        isRead: true,
      };

      setConversationMessages(prev => {
        const existing = prev[selectedConversation] ?? [];
        return { ...prev, [selectedConversation]: [...existing, newMsg] };
      });

      setConversations(prev =>
        prev.map(c => (c.id === selectedConversation ? { ...c, lastMessage: newMsg.content, timestamp: 'Now' } : c))
      );

      setNewMessage('');

      // scroll to bottom after update
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
    };

    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { borderBottomColor: '#e0e0e0' }]}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Text style={[styles.backButton, { color: '#FF69B4' }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatAvatar}>{currentConversation?.avatar ?? '👤'}</Text>
            <Text style={[styles.chatName, { color: Colors[colorScheme ?? 'light'].text }]}>
              {currentConversation?.name ?? ''}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ref={ref => { scrollViewRef.current = ref; }}
        >
          {messagesForSelected.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={[styles.inputContainer, { borderTopColor: '#e0e0e0' }]}>
          <TextInput
            style={[
              styles.messageInput,
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].text
              }
            ]}
            placeholder="Type a message..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Messages
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Connect with your learning community
        </Text>
      </View>

      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.map(renderConversation)}
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
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    opacity: 1,
  },
  unreadBadge: {
    backgroundColor: '#FF69B4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Chat view styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  sentMessage: {
    backgroundColor: '#FF69B4',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});