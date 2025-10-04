
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'training' | 'event' | 'urgent';
}

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Mandatory Training Session',
      content: 'All explorers must attend the mandatory training session tomorrow at 0800 hours. Please bring your uniform, notebook, and water bottle. The session will cover emergency procedures and community policing techniques.',
      author: 'Sergeant Martinez',
      timestamp: '2024-01-14T10:30:00Z',
      priority: 'high',
      category: 'training',
    },
    {
      id: '2',
      title: 'Community Safety Fair',
      content: 'We need volunteers for the upcoming Community Safety Fair this Saturday. This is a great opportunity to interact with the public and demonstrate our commitment to community service. Sign up with Officer Johnson.',
      author: 'Officer Johnson',
      timestamp: '2024-01-14T08:15:00Z',
      priority: 'medium',
      category: 'event',
    },
    {
      id: '3',
      title: 'Equipment Inspection',
      content: 'Monthly equipment inspection will be conducted this Friday. Ensure all your gear is clean, functional, and properly maintained. Any damaged equipment should be reported immediately.',
      author: 'Lieutenant Davis',
      timestamp: '2024-01-13T16:45:00Z',
      priority: 'medium',
      category: 'general',
    },
    {
      id: '4',
      title: 'Weather Alert',
      content: 'Severe weather expected this evening. All outdoor activities are postponed. Stay safe and monitor weather updates. Report any emergency situations immediately.',
      author: 'Chief Williams',
      timestamp: '2024-01-13T14:20:00Z',
      priority: 'high',
      category: 'urgent',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as Announcement['priority'],
    category: 'general' as Announcement['category'],
  });

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case 'training': return 'figure.run';
      case 'event': return 'calendar';
      case 'urgent': return 'exclamationmark.triangle.fill';
      case 'general': return 'info.circle.fill';
      default: return 'megaphone.fill';
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'training': return colors.primary;
      case 'event': return colors.accent;
      case 'urgent': return colors.error;
      case 'general': return colors.textSecondary;
      default: return colors.primary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: 'Current User', // In a real app, this would come from user context
      timestamp: new Date().toISOString(),
      priority: newAnnouncement.priority,
      category: newAnnouncement.category,
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      category: 'general',
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Announcement posted successfully!');
  };

  const deleteAnnouncement = (id: string) => {
    Alert.alert(
      'Delete Announcement',
      'Are you sure you want to delete this announcement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAnnouncements(announcements.filter(a => a.id !== id));
          },
        },
      ]
    );
  };

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
            Announcements
          </Text>
          <Pressable 
            onPress={() => setShowAddForm(!showAddForm)} 
            style={[commonStyles.headerButton, styles.addButton]}
          >
            <IconSymbol name={showAddForm ? "xmark" : "plus"} color={colors.primary} size={20} />
          </Pressable>
        </View>

        {/* Add Announcement Form */}
        {showAddForm && (
          <GlassView style={[
            styles.addForm,
            Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
          ]} glassEffectStyle="regular">
            <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
              New Announcement
            </Text>
            
            <TextInput
              style={[commonStyles.input]}
              placeholder="Announcement title..."
              placeholderTextColor={colors.textSecondary}
              value={newAnnouncement.title}
              onChangeText={(text) => setNewAnnouncement({...newAnnouncement, title: text})}
            />
            
            <TextInput
              style={[commonStyles.input, styles.contentInput]}
              placeholder="Announcement content..."
              placeholderTextColor={colors.textSecondary}
              value={newAnnouncement.content}
              onChangeText={(text) => setNewAnnouncement({...newAnnouncement, content: text})}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.formRow}>
              <View style={styles.selectContainer}>
                <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Priority</Text>
                <View style={styles.priorityButtons}>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Pressable
                      key={priority}
                      onPress={() => setNewAnnouncement({...newAnnouncement, priority})}
                      style={[
                        styles.priorityButton,
                        { backgroundColor: newAnnouncement.priority === priority ? getPriorityColor(priority) : colors.card },
                        { borderColor: getPriorityColor(priority) }
                      ]}
                    >
                      <Text style={[
                        styles.priorityButtonText,
                        { color: newAnnouncement.priority === priority ? 'white' : getPriorityColor(priority) }
                      ]}>
                        {priority.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formButtons}>
              <Pressable
                onPress={() => setShowAddForm(false)}
                style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
              >
                <Text style={[buttonStyles.text, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={addAnnouncement}
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
              >
                <Text style={[buttonStyles.text, { color: 'white' }]}>Post</Text>
              </Pressable>
            </View>
          </GlassView>
        )}

        {/* Announcements List */}
        <View style={styles.announcementsList}>
          {announcements.map((announcement) => (
            <View key={announcement.id} style={[commonStyles.card, styles.announcementCard]}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementMeta}>
                  <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(announcement.category) }]}>
                    <IconSymbol 
                      name={getCategoryIcon(announcement.category) as any} 
                      color="white" 
                      size={16} 
                    />
                  </View>
                  <View style={styles.announcementInfo}>
                    <Text style={[styles.announcementTitle, { color: colors.text }]}>
                      {announcement.title}
                    </Text>
                    <Text style={[styles.announcementAuthor, { color: colors.textSecondary }]}>
                      By {announcement.author} • {formatTimestamp(announcement.timestamp)}
                    </Text>
                  </View>
                </View>
                <View style={styles.announcementActions}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(announcement.priority) }]}>
                    <Text style={styles.priorityText}>
                      {announcement.priority.toUpperCase()}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => deleteAnnouncement(announcement.id)}
                    style={styles.deleteButton}
                  >
                    <IconSymbol name="trash" color={colors.error} size={16} />
                  </Pressable>
                </View>
              </View>
              <Text style={[styles.announcementContent, { color: colors.textSecondary }]}>
                {announcement.content}
              </Text>
            </View>
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
  addButton: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  addForm: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    marginBottom: 16,
  },
  selectContainer: {
    flex: 1,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  announcementsList: {
    flex: 1,
  },
  announcementCard: {
    marginBottom: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  announcementMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  announcementAuthor: {
    fontSize: 12,
  },
  announcementActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 4,
  },
  announcementContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});
