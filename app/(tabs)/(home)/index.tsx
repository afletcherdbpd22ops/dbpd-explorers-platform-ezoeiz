
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";

export default function HomeScreen() {
  const theme = useTheme();

  const quickActions = [
    {
      title: "Check In",
      description: "Mark your attendance",
      icon: "checkmark.circle.fill",
      color: colors.success,
      action: () => console.log("Check in pressed"),
    },
    {
      title: "Emergency Alert",
      description: "Send emergency notification",
      icon: "exclamationmark.triangle.fill",
      color: colors.error,
      action: () => console.log("Emergency alert pressed"),
    },
    {
      title: "Quick Message",
      description: "Send a quick message",
      icon: "message.fill",
      color: colors.primary,
      action: () => console.log("Quick message pressed"),
    },
    {
      title: "View Schedule",
      description: "Check today's schedule",
      icon: "calendar",
      color: colors.accent,
      action: () => console.log("View schedule pressed"),
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Training Session Tomorrow",
      content: "Mandatory training session at 0800 hours. Bring your uniform and notebook.",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      title: "Community Event This Weekend",
      content: "Volunteer opportunity at the local community center. Sign up required.",
      time: "5 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      title: "Equipment Check",
      content: "All explorers must complete equipment check by Friday.",
      time: "1 day ago",
      priority: "low",
    },
  ];

  const renderQuickAction = (action: typeof quickActions[0], index: number) => (
    <Pressable key={index} onPress={action.action} style={styles.quickActionButton}>
      <GlassView style={[
        styles.quickAction,
        Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
      ]} glassEffectStyle="regular">
        <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
          <IconSymbol name={action.icon as any} color="white" size={24} />
        </View>
        <Text style={[styles.quickActionTitle, { color: colors.text }]}>{action.title}</Text>
        <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
          {action.description}
        </Text>
      </GlassView>
    </Pressable>
  );

  const renderAnnouncement = (announcement: typeof recentAnnouncements[0]) => (
    <View key={announcement.id} style={[commonStyles.card, styles.announcementCard]}>
      <View style={styles.announcementHeader}>
        <Text style={[styles.announcementTitle, { color: colors.text }]}>
          {announcement.title}
        </Text>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: announcement.priority === 'high' ? colors.error : 
                            announcement.priority === 'medium' ? colors.warning : colors.success }
        ]}>
          <Text style={styles.priorityText}>{announcement.priority.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={[styles.announcementContent, { color: colors.textSecondary }]}>
        {announcement.content}
      </Text>
      <Text style={[styles.announcementTime, { color: colors.textSecondary }]}>
        {announcement.time}
      </Text>
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log("Notifications pressed")}
      style={[commonStyles.headerButton, { backgroundColor: colors.card }]}
    >
      <IconSymbol name="bell.fill" color={colors.primary} size={20} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => console.log("Menu pressed")}
      style={[commonStyles.headerButton, { backgroundColor: colors.card }]}
    >
      <IconSymbol name="line.horizontal.3" color={colors.primary} size={20} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Daytona Beach Police Explorers",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section with Logo */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/c794ccc5-d3ca-4b99-a5c4-5d9a81f3722f.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[commonStyles.title, { color: colors.text, marginTop: 16 }]}>
            Daytona Beach Police Explorers
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            Ready to serve and protect our community
          </Text>
          <Text style={[styles.missionStatement, { color: colors.textSecondary, textAlign: 'center', marginTop: 12 }]}>
            Professional Public Servant
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Recent Announcements */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Recent Announcements
          </Text>
          {recentAnnouncements.map(renderAnnouncement)}
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
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  missionStatement: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 12,
  },
  quickAction: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  announcementCard: {
    marginBottom: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
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
  announcementContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
