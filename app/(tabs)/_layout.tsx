
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'calendar',
      route: '/(tabs)/calendar',
      icon: 'calendar',
      label: 'Calendar',
    },
    {
      name: 'roster',
      route: '/(tabs)/roster',
      icon: 'person.2.fill',
      label: 'Roster',
    },
    {
      name: 'announcements',
      route: '/(tabs)/announcements',
      icon: 'bell.fill',
      label: 'Announcements',
    },
    {
      name: 'messages',
      route: '/(tabs)/messages',
      icon: 'message.fill',
      label: 'Messages',
    },
    {
      name: 'walkie',
      route: '/(tabs)/walkie',
      icon: 'antenna.radiowaves.left.and.right',
      label: 'Walkie',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.circle.fill',
      label: 'Profile',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="calendar">
          <Icon sf="calendar" drawable="ic_calendar" />
          <Label>Calendar</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="roster">
          <Icon sf="person.2.fill" drawable="ic_roster" />
          <Label>Roster</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="announcements">
          <Icon sf="bell.fill" drawable="ic_announcements" />
          <Label>Announcements</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="messages">
          <Icon sf="message.fill" drawable="ic_messages" />
          <Label>Messages</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="walkie">
          <Icon sf="antenna.radiowaves.left.and.right" drawable="ic_walkie" />
          <Label>Walkie</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.circle.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="roster" />
        <Stack.Screen name="announcements" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="walkie" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
