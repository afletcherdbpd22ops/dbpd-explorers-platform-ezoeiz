
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { colors, commonStyles } from "@/styles/commonStyles";

interface ExplorerProfile {
  id: string;
  name: string;
  rank: string;
  badgeNumber: string;
  joinDate: string;
  communityServiceHours: number;
  trainingHours: number;
  commendations: number;
  specializations: string[];
  contact: {
    email: string;
    phone: string;
    emergencyContact: string;
  };
}

export default function ProfileScreen() {
  const [explorerProfile] = useState<ExplorerProfile>({
    id: '1',
    name: 'Alex Johnson',
    rank: 'Explorer Lieutenant',
    badgeNumber: 'EX-2024-015',
    joinDate: '2023-03-15',
    communityServiceHours: 127,
    trainingHours: 89,
    commendations: 3,
    specializations: ['Traffic Control', 'Community Outreach', 'Emergency Response'],
    contact: {
      email: 'alex.johnson@dbpoliceexplorers.org',
      phone: '(386) 555-0123',
      emergencyContact: '(386) 555-0456',
    },
  });

  const recentActivities = [
    {
      id: '1',
      type: 'Community Service',
      description: 'Assisted at local food bank',
      hours: 4,
      date: '2024-01-12',
    },
    {
      id: '2',
      type: 'Training',
      description: 'Emergency Response Procedures',
      hours: 3,
      date: '2024-01-10',
    },
    {
      id: '3',
      type: 'Patrol',
      description: 'Downtown area patrol with Officer Martinez',
      hours: 6,
      date: '2024-01-08',
    },
    {
      id: '4',
      type: 'Community Service',
      description: 'School safety presentation',
      hours: 2,
      date: '2024-01-05',
    },
  ];

  const achievements = [
    {
      id: '1',
      title: 'Community Champion',
      description: 'Completed 100+ community service hours',
      icon: 'heart.fill',
      color: colors.success,
      earned: true,
    },
    {
      id: '2',
      title: 'Training Excellence',
      description: 'Completed advanced training modules',
      icon: 'star.fill',
      color: colors.accent,
      earned: true,
    },
    {
      id: '3',
      title: 'Leadership Award',
      description: 'Demonstrated exceptional leadership',
      icon: 'crown.fill',
      color: colors.warning,
      earned: true,
    },
    {
      id: '4',
      title: 'Perfect Attendance',
      description: 'No missed training sessions',
      icon: 'checkmark.circle.fill',
      color: colors.primary,
      earned: false,
    },
  ];

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'explorer major': return '#8B0000'; // Dark red for highest rank
      case 'explorer captain': return '#FF4500'; // Orange red
      case 'explorer lieutenant': return colors.primary; // Blue
      case 'explorer sergeant': return '#32CD32'; // Lime green
      case 'explorer corporal': return '#FFD700'; // Gold
      case 'explorer': return colors.secondary; // Default secondary color
      default: return colors.textSecondary;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'community service': return 'heart.fill';
      case 'training': return 'book.fill';
      case 'patrol': return 'car.fill';
      default: return 'clock.fill';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'community service': return colors.success;
      case 'training': return colors.primary;
      case 'patrol': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const editProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing functionality would be implemented here.',
      [{ text: 'OK', onPress: () => console.log('Edit profile pressed') }]
    );
  };

  const logActivity = () => {
    Alert.alert(
      'Log Activity',
      'Activity logging functionality would be implemented here.',
      [{ text: 'OK', onPress: () => console.log('Log activity pressed') }]
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
        {/* Profile Header */}
        <GlassView style={[
          styles.profileHeader,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <View style={styles.profileImageContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            <View style={[styles.rankBadge, { backgroundColor: getRankColor(explorerProfile.rank) }]}>
              <Text style={styles.rankBadgeText}>{explorerProfile.rank.split(' ')[1] || 'EXP'}</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {explorerProfile.name}
          </Text>
          <Text style={[styles.profileRank, { color: getRankColor(explorerProfile.rank) }]}>
            {explorerProfile.rank}
          </Text>
          <Text style={[styles.badgeNumber, { color: colors.textSecondary }]}>
            Badge #{explorerProfile.badgeNumber}
          </Text>
          <Pressable onPress={editProfile} style={[styles.editButton, { backgroundColor: colors.primary }]}>
            <IconSymbol name="pencil" color="white" size={16} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </GlassView>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="heart.fill" color={colors.success} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {explorerProfile.communityServiceHours}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Service Hours
            </Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="book.fill" color={colors.primary} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {explorerProfile.trainingHours}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Training Hours
            </Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="star.fill" color={colors.accent} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {explorerProfile.commendations}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Commendations
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={[commonStyles.card, styles.infoSection]}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Profile Information
          </Text>
          <View style={styles.infoRow}>
            <IconSymbol name="calendar" color={colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Join Date</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatDate(explorerProfile.joinDate)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="envelope.fill" color={colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {explorerProfile.contact.email}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="phone.fill" color={colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {explorerProfile.contact.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Specializations */}
        <View style={[commonStyles.card, styles.specializationsSection]}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Specializations
          </Text>
          <View style={styles.specializationsList}>
            {explorerProfile.specializations.map((specialization, index) => (
              <View key={index} style={[styles.specializationTag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.specializationText, { color: colors.text }]}>
                  {specialization}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={[commonStyles.card, styles.achievementsSection]}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Achievements
          </Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementItem,
                { opacity: achievement.earned ? 1 : 0.5 }
              ]}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  <IconSymbol 
                    name={achievement.icon as any} 
                    color="white" 
                    size={20} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={[commonStyles.card, styles.activitiesSection]}>
          <View style={styles.activitiesHeader}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              Recent Activities
            </Text>
            <Pressable onPress={logActivity} style={styles.logActivityButton}>
              <IconSymbol name="plus" color={colors.primary} size={16} />
            </Pressable>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: getActivityColor(activity.type) }]}>
                  <IconSymbol 
                    name={getActivityIcon(activity.type) as any} 
                    color="white" 
                    size={16} 
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityType, { color: colors.text }]}>
                    {activity.type}
                  </Text>
                  <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                    {activity.description}
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                    {formatDate(activity.date)} • {activity.hours} hours
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.card,
  },
  rankBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileRank: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  badgeNumber: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  specializationsSection: {
    marginBottom: 24,
  },
  specializationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specializationTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specializationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  activitiesSection: {
    marginBottom: 24,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logActivityButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
  },
});
