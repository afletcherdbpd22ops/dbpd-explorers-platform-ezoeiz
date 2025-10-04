
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  type: 'text' | 'system';
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  avatar?: string;
  participants?: string[];
}

export default function MessagesScreen() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Explorer group chat is always first and includes all registered users
  const conversations: Conversation[] = [
    {
      id: 'explorer-group',
      name: 'Explorer Group Chat',
      lastMessage: 'Welcome to the Explorer team! Ready to serve as professional public servants.',
      timestamp: '2024-01-14T16:00:00Z',
      unreadCount: 3,
      isGroup: true,
      participants: ['All Registered Explorers'],
    },
    {
      id: '2',
      name: 'Officer Johnson',
      lastMessage: 'Great work on the community event',
      timestamp: '2024-01-14T14:15:00Z',
      unreadCount: 0,
      isGroup: false,
    },
    {
      id: '3',
      name: 'Sarah Martinez',
      lastMessage: 'Training session went well today',
      timestamp: '2024-01-14T13:30:00Z',
      unreadCount: 1,
      isGroup: false,
    },
    {
      id: '4',
      name: 'Michael Chen',
      lastMessage: 'Equipment check completed',
      timestamp: '2024-01-14T12:45:00Z',
      unreadCount: 0,
      isGroup: false,
    },
    {
      id: '5',
      name: 'Emma Thompson',
      lastMessage: 'See you at tonight\'s patrol',
      timestamp: '2024-01-14T11:20:00Z',
      unreadCount: 0,
      isGroup: false,
    },
  ];

  const messages: { [key: string]: Message[] } = {
    'explorer-group': [
      {
        id: '1',
        sender: 'System',
        content: 'Welcome to the Explorer Group Chat! All registered explorers are automatically added to this group.',
        timestamp: '2024-01-14T08:00:00Z',
        isCurrentUser: false,
        type: 'system',
      },
      {
        id: '2',
        sender: 'Sarah Martinez',
        content: 'Welcome everyone! Remember, we are professional public servants dedicated to serving our community.',
        timestamp: '2024-01-14T08:15:00Z',
        isCurrentUser: false,
        type: 'text',
      },
      {
        id: '3',
        sender: 'Michael Chen',
        content: 'Looking forward to working with everyone. Let\'s make a positive impact!',
        timestamp: '2024-01-14T08:30:00Z',
        isCurrentUser: false,
        type: 'text',
      },
      {
        id: '4',
        sender: 'You',
        content: 'Excited to be part of the team and serve as a professional public servant!',
        timestamp: '2024-01-14T09:00:00Z',
        isCurrentUser: true,
        type: 'text',
      },
      {
        id: '5',
        sender: 'Emma Thompson',
        content: 'Don\'t forget tonight\'s community patrol at 1800 hours.',
        timestamp: '2024-01-14T15:45:00Z',
        isCurrentUser: false,
        type: 'text',
      },
      {
        id: '6',
        sender: 'Alex Johnson',
        content: 'Ready to serve as professional public servants. See everyone tonight!',
        timestamp: '2024-01-14T16:00:00Z',
        isCurrentUser: false,
        type: 'text',
      },
    ],
    '2': [
      {
        id: '7',
        sender: 'Officer Johnson',
        content: 'Great work on the community event today. The feedback from residents was very positive. You\'re developing into excellent professional public servants.',
        timestamp: '2024-01-14T14:15:00Z',
        isCurrentUser: false,
        type: 'text',
      },
    ],
    '3': [
      {
        id: '8',
        sender: 'Sarah Martinez',
        content: 'Training session went well today. Keep up the excellent work as professional public servants.',
        timestamp: '2024-01-14T13:30:00Z',
        isCurrentUser: false,
        type: 'text',
      },
    ],
    '4': [
      {
        id: '9',
        sender: 'Michael Chen',
        content: 'Equipment check completed. Everything is ready for tonight\'s patrol.',
        timestamp: '2024-01-14T12:45:00Z',
        isCurrentUser: false,
        type: 'text',
      },
    ],
    '5': [
      {
        id: '10',
        sender: 'Emma Thompson',
        content: 'See you at tonight\'s patrol. Remember to bring your gear and maintain our standards as professional public servants.',
        timestamp: '2024-01-14T11:20:00Z',
        isCurrentUser: false,
        type: 'text',
      },
    ],
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    Alert.alert(
      'Message Sent',
      'In a real app, this would send the message to the server and update the conversation.',
      [{ text: 'OK', onPress: () => console.log('Message sent:', newMessage) }]
    );
    
    setNewMessage('');
  };

  const startNewConversation = () => {
    Alert.alert(
      'New Conversation',
      'Select contacts from the roster to start a new conversation',
      [{ text: 'OK', onPress: () => console.log('Start new conversation') }]
    );
  };

  if (activeConversation) {
    const conversation = conversations.find(c => c.id === activeConversation);
    const conversationMessages = messages[activeConversation] || [];

    return (
      <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
        <View style={styles.container}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <Pressable
              onPress={() => setActiveConversation(null)}
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
            </Pressable>
            <View style={styles.chatHeaderInfo}>
              <Text style={[styles.chatHeaderName, { color: colors.text }]}>
                {conversation?.name}
              </Text>
              <Text style={[styles.chatHeaderStatus, { color: colors.textSecondary }]}>
                {conversation?.isGroup ? 
                  `Group Chat • ${conversation.participants?.length || 'Multiple'} members` : 
                  'Online'
                }
              </Text>
            </View>
            <Pressable style={styles.chatHeaderAction}>
              <IconSymbol name="phone.fill" color={colors.primary} size={20} />
            </Pressable>
          </View>

          {/* Messages */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              Platform.OS !== 'ios' && { paddingBottom: 100 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {conversationMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.type === 'system' ? styles.systemMessage :
                  message.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
                ]}
              >
                {!message.isCurrentUser && message.type !== 'system' && (
                  <Text style={[styles.messageSender, { color: colors.textSecondary }]}>
                    {message.sender}
                  </Text>
                )}
                <GlassView
                  style={[
                    styles.messageBubble,
                    message.type === 'system' ? styles.systemBubble :
                    message.isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                    Platform.OS !== 'ios' && {
                      backgroundColor: message.type === 'system' ? colors.secondary :
                        message.isCurrentUser ? colors.primary : 'rgba(255,255,255,0.9)'
                    }
                  ]}
                  glassEffectStyle="regular"
                >
                  <Text style={[
                    styles.messageText,
                    { 
                      color: message.type === 'system' ? colors.text :
                        message.isCurrentUser ? 'white' : colors.text,
                      fontStyle: message.type === 'system' ? 'italic' : 'normal'
                    }
                  ]}>
                    {message.content}
                  </Text>
                </GlassView>
                <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
                  {formatMessageTime(message.timestamp)}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={[styles.messageInput, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={sendMessage}
              style={[
                styles.sendButton,
                { backgroundColor: newMessage.trim() ? colors.primary : colors.textSecondary }
              ]}
              disabled={!newMessage.trim()}
            >
              <IconSymbol name="paperplane.fill" color="white" size={20} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            Messages
          </Text>
          <Pressable 
            onPress={startNewConversation} 
            style={[commonStyles.headerButton, styles.newChatButton]}
          >
            <IconSymbol name="square.and.pencil" color={colors.primary} size={20} />
          </Pressable>
        </View>

        {/* Info Banner */}
        <View style={[commonStyles.card, styles.infoBanner]}>
          <IconSymbol name="info.circle.fill" color={colors.primary} size={20} />
          <Text style={[styles.infoBannerText, { color: colors.text }]}>
            All registered explorers are automatically added to the Explorer Group Chat. 
            Use the roster to start direct messages with individual explorers.
          </Text>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsList}>
          {conversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => setActiveConversation(conversation.id)}
              style={[commonStyles.card, styles.conversationCard]}
            >
              <View style={[
                styles.conversationAvatar,
                conversation.id === 'explorer-group' && { backgroundColor: colors.primary }
              ]}>
                <IconSymbol 
                  name={conversation.isGroup ? "person.3.fill" : "person.fill"} 
                  color={conversation.id === 'explorer-group' ? 'white' : colors.primary} 
                  size={24} 
                />
              </View>
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={[styles.conversationName, { color: colors.text }]}>
                    {conversation.name}
                    {conversation.id === 'explorer-group' && (
                      <Text style={[styles.groupBadge, { color: colors.primary }]}> • Official</Text>
                    )}
                  </Text>
                  <Text style={[styles.conversationTime, { color: colors.textSecondary }]}>
                    {formatTimestamp(conversation.timestamp)}
                  </Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text 
                    style={[styles.conversationLastMessage, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage}
                  </Text>
                  {conversation.unreadCount > 0 && (
                    <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.unreadCount}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  newChatButton: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    backgroundColor: colors.backgroundAlt,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  conversationsList: {
    flex: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
  },
  conversationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  groupBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  conversationTime: {
    fontSize: 12,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationLastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Chat Screen Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatHeaderStatus: {
    fontSize: 12,
  },
  chatHeaderAction: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  systemMessage: {
    alignItems: 'center',
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    backgroundColor: colors.card,
  },
  systemBubble: {
    backgroundColor: colors.secondary,
    maxWidth: '90%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 12,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
