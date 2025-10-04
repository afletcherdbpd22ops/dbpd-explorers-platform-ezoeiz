
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Alert, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  type: 'text' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user names
  replyTo?: string; // message id this is replying to
  edited?: boolean;
  editedAt?: string;
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
  isTyping?: boolean;
  typingUsers?: string[];
  isPinned?: boolean;
  isMuted?: boolean;
}

export default function MessagesScreen() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeout = useRef<NodeJS.Timeout>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [isTyping]);

  // Animate search bar
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSearch ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSearch, fadeAnim]);

  // Enhanced conversations with more realistic data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'explorer-group',
      name: 'Explorer Group Chat',
      lastMessage: 'Welcome to the Explorer team! Ready to serve as professional public servants.',
      timestamp: '2024-01-14T16:00:00Z',
      unreadCount: 3,
      isGroup: true,
      participants: ['All Registered Explorers'],
      isPinned: true,
      isTyping: false,
      typingUsers: [],
    },
    {
      id: '2',
      name: 'Officer Johnson',
      lastMessage: 'Great work on the community event',
      timestamp: '2024-01-14T14:15:00Z',
      unreadCount: 0,
      isGroup: false,
      isTyping: false,
    },
    {
      id: '3',
      name: 'Sarah Martinez',
      lastMessage: 'Training session went well today',
      timestamp: '2024-01-14T13:30:00Z',
      unreadCount: 1,
      isGroup: false,
      isTyping: true,
      typingUsers: ['Sarah Martinez'],
    },
    {
      id: '4',
      name: 'Michael Chen',
      lastMessage: 'Equipment check completed',
      timestamp: '2024-01-14T12:45:00Z',
      unreadCount: 0,
      isGroup: false,
      isTyping: false,
    },
    {
      id: '5',
      name: 'Emma Thompson',
      lastMessage: 'See you at tonight\'s patrol',
      timestamp: '2024-01-14T11:20:00Z',
      unreadCount: 0,
      isGroup: false,
      isMuted: true,
    },
  ]);

  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    'explorer-group': [
      {
        id: '1',
        sender: 'System',
        content: 'Welcome to the Explorer Group Chat! All registered explorers are automatically added to this group.',
        timestamp: '2024-01-14T08:00:00Z',
        isCurrentUser: false,
        type: 'system',
        status: 'read',
      },
      {
        id: '2',
        sender: 'Sarah Martinez',
        content: 'Welcome everyone! Remember, we are professional public servants dedicated to serving our community.',
        timestamp: '2024-01-14T08:15:00Z',
        isCurrentUser: false,
        type: 'text',
        status: 'read',
        reactions: { '👍': ['Michael Chen', 'Emma Thompson'], '❤️': ['Alex Johnson'] },
      },
      {
        id: '3',
        sender: 'Michael Chen',
        content: 'Looking forward to working with everyone. Let\'s make a positive impact!',
        timestamp: '2024-01-14T08:30:00Z',
        isCurrentUser: false,
        type: 'text',
        status: 'read',
        reactions: { '💪': ['Sarah Martinez', 'You'] },
      },
      {
        id: '4',
        sender: 'You',
        content: 'Excited to be part of the team and serve as a professional public servant!',
        timestamp: '2024-01-14T09:00:00Z',
        isCurrentUser: true,
        type: 'text',
        status: 'read',
        reactions: { '🎉': ['Sarah Martinez', 'Michael Chen'] },
      },
      {
        id: '5',
        sender: 'Emma Thompson',
        content: 'Don\'t forget tonight\'s community patrol at 1800 hours.',
        timestamp: '2024-01-14T15:45:00Z',
        isCurrentUser: false,
        type: 'text',
        status: 'delivered',
      },
      {
        id: '6',
        sender: 'Alex Johnson',
        content: 'Ready to serve as professional public servants. See everyone tonight!',
        timestamp: '2024-01-14T16:00:00Z',
        isCurrentUser: false,
        type: 'text',
        status: 'sent',
        replyTo: '5',
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
        status: 'read',
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
        status: 'read',
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
        status: 'read',
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
        status: 'read',
      },
    ],
  });

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

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return 'clock';
      case 'sent': return 'checkmark';
      case 'delivered': return 'checkmark.circle';
      case 'read': return 'checkmark.circle.fill';
      default: return 'checkmark';
    }
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'sending': return colors.textSecondary;
      case 'sent': return colors.textSecondary;
      case 'delivered': return colors.primary;
      case 'read': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const messageId = Date.now().toString();
    const newMsg: Message = {
      id: messageId,
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      type: 'text',
      status: 'sending',
      replyTo: replyingTo?.id,
    };

    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMsg]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, lastMessage: newMessage.trim(), timestamp: new Date().toISOString() }
        : conv
    ));

    setNewMessage('');
    setReplyingTo(null);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeConversation]: prev[activeConversation].map(msg => 
          msg.id === messageId ? { ...msg, status: 'sent' } : msg
        )
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeConversation]: prev[activeConversation].map(msg => 
          msg.id === messageId ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 2000);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    console.log('Message sent:', newMessage);
  };

  const startNewConversation = () => {
    Alert.alert(
      'New Conversation',
      'Select contacts from the roster to start a new conversation',
      [{ text: 'OK', onPress: () => console.log('Start new conversation') }]
    );
  };

  const toggleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setMessages(prev => ({
      ...prev,
      [activeConversation!]: prev[activeConversation!].map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (reactions[emoji]) {
            if (reactions[emoji].includes('You')) {
              reactions[emoji] = reactions[emoji].filter(user => user !== 'You');
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
            } else {
              reactions[emoji] = [...reactions[emoji], 'You'];
            }
          } else {
            reactions[emoji] = ['You'];
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    }));
    
    setShowReactions(false);
    setSelectedMessage(null);
  };

  const replyToMessage = (message: Message) => {
    setReplyingTo(message);
    setSelectedMessage(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getReplyMessage = (replyId: string) => {
    if (!activeConversation) return null;
    return messages[activeConversation]?.find(msg => msg.id === replyId);
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveConversation(null);
                setReplyingTo(null);
              }}
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" color={colors.primary} size={20} />
            </Pressable>
            <View style={styles.chatHeaderInfo}>
              <Text style={[styles.chatHeaderName, { color: colors.text }]}>
                {conversation?.name}
                {conversation?.isPinned && (
                  <IconSymbol name="pin.fill" color={colors.warning} size={12} />
                )}
                {conversation?.isMuted && (
                  <IconSymbol name="speaker.slash.fill" color={colors.textSecondary} size={12} />
                )}
              </Text>
              <Text style={[styles.chatHeaderStatus, { color: colors.textSecondary }]}>
                {conversation?.isTyping ? 
                  `${conversation.typingUsers?.join(', ')} typing...` :
                  conversation?.isGroup ? 
                    `Group Chat • ${conversation.participants?.length || 'Multiple'} members` : 
                    'Online'
                }
              </Text>
            </View>
            <View style={styles.chatHeaderActions}>
              <Pressable 
                style={styles.chatHeaderAction}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert('Video Call', 'Video calling feature coming soon!');
                }}
              >
                <IconSymbol name="video.fill" color={colors.primary} size={18} />
              </Pressable>
              <Pressable 
                style={styles.chatHeaderAction}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert('Voice Call', 'Voice calling feature coming soon!');
                }}
              >
                <IconSymbol name="phone.fill" color={colors.primary} size={18} />
              </Pressable>
            </View>
          </View>

          {/* Reply Banner */}
          {replyingTo && (
            <View style={styles.replyBanner}>
              <View style={styles.replyContent}>
                <Text style={[styles.replyLabel, { color: colors.primary }]}>
                  Replying to {replyingTo.sender}
                </Text>
                <Text style={[styles.replyText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {replyingTo.content}
                </Text>
              </View>
              <Pressable
                onPress={() => setReplyingTo(null)}
                style={styles.replyClose}
              >
                <IconSymbol name="xmark" color={colors.textSecondary} size={16} />
              </Pressable>
            </View>
          )}

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={[
              styles.messagesContent,
              Platform.OS !== 'ios' && { paddingBottom: 100 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {conversationMessages.map((message) => {
              const replyMessage = message.replyTo ? getReplyMessage(message.replyTo) : null;
              
              return (
                <Pressable
                  key={message.id}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setSelectedMessage(message.id);
                    setShowReactions(true);
                  }}
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
                  
                  {/* Reply Preview */}
                  {replyMessage && (
                    <View style={[
                      styles.replyPreview,
                      message.isCurrentUser ? styles.replyPreviewRight : styles.replyPreviewLeft
                    ]}>
                      <View style={[styles.replyLine, { backgroundColor: colors.primary }]} />
                      <View style={styles.replyPreviewContent}>
                        <Text style={[styles.replyPreviewSender, { color: colors.primary }]}>
                          {replyMessage.sender}
                        </Text>
                        <Text style={[styles.replyPreviewText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {replyMessage.content}
                        </Text>
                      </View>
                    </View>
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
                      {message.edited && (
                        <Text style={[styles.editedLabel, { color: colors.textSecondary }]}> (edited)</Text>
                      )}
                    </Text>
                  </GlassView>

                  {/* Message Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <View style={[
                      styles.reactionsContainer,
                      message.isCurrentUser ? styles.reactionsRight : styles.reactionsLeft
                    ]}>
                      {Object.entries(message.reactions).map(([emoji, users]) => (
                        <Pressable
                          key={emoji}
                          onPress={() => addReaction(message.id, emoji)}
                          style={[
                            styles.reactionBubble,
                            users.includes('You') && styles.reactionBubbleActive
                          ]}
                        >
                          <Text style={styles.reactionEmoji}>{emoji}</Text>
                          <Text style={[
                            styles.reactionCount,
                            { color: users.includes('You') ? colors.primary : colors.textSecondary }
                          ]}>
                            {users.length}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  <View style={[
                    styles.messageFooter,
                    message.isCurrentUser ? styles.messageFooterRight : styles.messageFooterLeft
                  ]}>
                    <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
                      {formatMessageTime(message.timestamp)}
                    </Text>
                    {message.isCurrentUser && (
                      <IconSymbol 
                        name={getStatusIcon(message.status)} 
                        color={getStatusColor(message.status)} 
                        size={12} 
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <Pressable
              style={styles.attachButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Attachments', 'File sharing feature coming soon!');
              }}
            >
              <IconSymbol name="plus" color={colors.primary} size={20} />
            </Pressable>
            <TextInput
              style={[styles.messageInput, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={newMessage}
              onChangeText={(text) => {
                setNewMessage(text);
                if (!isTyping && text.length > 0) {
                  setIsTyping(true);
                }
              }}
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

        {/* Reaction Modal */}
        <Modal
          visible={showReactions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowReactions(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowReactions(false)}
          >
            <View style={styles.reactionModal}>
              <Text style={[styles.reactionModalTitle, { color: colors.text }]}>
                React to message
              </Text>
              <View style={styles.reactionOptions}>
                {['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '💪'].map(emoji => (
                  <Pressable
                    key={emoji}
                    onPress={() => selectedMessage && addReaction(selectedMessage, emoji)}
                    style={styles.reactionOption}
                  >
                    <Text style={styles.reactionOptionEmoji}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.reactionModalActions}>
                <Pressable
                  onPress={() => selectedMessage && replyToMessage(messages[activeConversation].find(m => m.id === selectedMessage)!)}
                  style={[styles.reactionModalAction, { backgroundColor: colors.primary }]}
                >
                  <IconSymbol name="arrowshape.turn.up.left" color="white" size={16} />
                  <Text style={[styles.reactionModalActionText, { color: 'white' }]}>Reply</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
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
          <View style={styles.headerActions}>
            <Pressable 
              onPress={toggleSearch} 
              style={[commonStyles.headerButton, styles.searchButton]}
            >
              <IconSymbol name="magnifyingglass" color={colors.primary} size={20} />
            </Pressable>
            <Pressable 
              onPress={startNewConversation} 
              style={[commonStyles.headerButton, styles.newChatButton]}
            >
              <IconSymbol name="square.and.pencil" color={colors.primary} size={20} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
          {showSearch && (
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          )}
        </Animated.View>

        {/* Info Banner */}
        <View style={[commonStyles.card, styles.infoBanner]}>
          <IconSymbol name="info.circle.fill" color={colors.primary} size={20} />
          <Text style={[styles.infoBannerText, { color: colors.text }]}>
            All registered explorers are automatically added to the Explorer Group Chat. 
            Use the roster to start direct messages with individual explorers.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickAction, { backgroundColor: colors.primary }]}>
            <IconSymbol name="person.3.fill" color="white" size={20} />
            <Text style={[styles.quickActionText, { color: 'white' }]}>Group Chat</Text>
          </Pressable>
          <Pressable style={[styles.quickAction, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="phone.fill" color={colors.text} size={20} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Voice Call</Text>
          </Pressable>
          <Pressable style={[styles.quickAction, { backgroundColor: colors.accent }]}>
            <IconSymbol name="video.fill" color="white" size={20} />
            <Text style={[styles.quickActionText, { color: 'white' }]}>Video Call</Text>
          </Pressable>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsList}>
          {filteredConversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveConversation(conversation.id);
                // Mark as read
                setConversations(prev => prev.map(conv => 
                  conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
                ));
              }}
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
                {conversation.isTyping && (
                  <View style={styles.typingIndicator}>
                    <View style={[styles.typingDot, { backgroundColor: colors.success }]} />
                  </View>
                )}
              </View>
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <View style={styles.conversationTitleRow}>
                    <Text style={[styles.conversationName, { color: colors.text }]}>
                      {conversation.name}
                    </Text>
                    {conversation.isPinned && (
                      <IconSymbol name="pin.fill" color={colors.warning} size={12} />
                    )}
                    {conversation.isMuted && (
                      <IconSymbol name="speaker.slash.fill" color={colors.textSecondary} size={12} />
                    )}
                    {conversation.id === 'explorer-group' && (
                      <Text style={[styles.groupBadge, { color: colors.primary }]}> • Official</Text>
                    )}
                  </View>
                  <Text style={[styles.conversationTime, { color: colors.textSecondary }]}>
                    {formatTimestamp(conversation.timestamp)}
                  </Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text 
                    style={[
                      styles.conversationLastMessage, 
                      { 
                        color: conversation.isTyping ? colors.primary : colors.textSecondary,
                        fontStyle: conversation.isTyping ? 'italic' : 'normal'
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {conversation.isTyping ? 
                      `${conversation.typingUsers?.join(', ')} typing...` : 
                      conversation.lastMessage
                    }
                  </Text>
                  {conversation.unreadCount > 0 && (
                    <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.unreadCount}>
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
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
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  newChatButton: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.backgroundAlt,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
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
    position: 'relative',
  },
  typingIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  conversationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatHeaderStatus: {
    fontSize: 12,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHeaderAction: {
    padding: 8,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
  },
  replyClose: {
    padding: 4,
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
  replyPreview: {
    maxWidth: '80%',
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  replyPreviewRight: {
    alignSelf: 'flex-end',
  },
  replyPreviewLeft: {
    alignSelf: 'flex-start',
  },
  replyLine: {
    width: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewSender: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 12,
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
  editedLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionsRight: {
    alignSelf: 'flex-end',
  },
  reactionsLeft: {
    alignSelf: 'flex-start',
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionBubbleActive: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageFooterRight: {
    alignSelf: 'flex-end',
  },
  messageFooterLeft: {
    alignSelf: 'flex-start',
  },
  messageTime: {
    fontSize: 10,
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
    gap: 12,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 300,
    width: '100%',
  },
  reactionModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  reactionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  reactionOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionOptionEmoji: {
    fontSize: 24,
  },
  reactionModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reactionModalAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  reactionModalActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
