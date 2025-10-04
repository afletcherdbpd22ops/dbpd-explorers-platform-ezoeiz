
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Event {
  id: string;
  title: string;
  time: string;
  description: string;
  type: 'training' | 'meeting' | 'community' | 'patrol';
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Sample events data
  const events: { [key: string]: Event[] } = {
    '2024-01-15': [
      {
        id: '1',
        title: 'Morning Training',
        time: '08:00',
        description: 'Physical fitness and tactical training',
        type: 'training',
      },
      {
        id: '2',
        title: 'Community Patrol',
        time: '14:00',
        description: 'Downtown area patrol with Officer Johnson',
        type: 'patrol',
      },
    ],
    '2024-01-16': [
      {
        id: '3',
        title: 'Explorer Meeting',
        time: '19:00',
        description: 'Monthly explorer meeting and briefing',
        type: 'meeting',
      },
    ],
    '2024-01-18': [
      {
        id: '4',
        title: 'Community Event',
        time: '10:00',
        description: 'Safety demonstration at local school',
        type: 'community',
      },
    ],
  };

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: colors.primary,
      selectedColor: date === selectedDate ? colors.primary : undefined,
      selected: date === selectedDate,
    };
    return acc;
  }, {} as any);

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'training': return colors.primary;
      case 'meeting': return colors.accent;
      case 'community': return colors.success;
      case 'patrol': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'training': return 'figure.run';
      case 'meeting': return 'person.3.fill';
      case 'community': return 'heart.fill';
      case 'patrol': return 'car.fill';
      default: return 'calendar';
    }
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const addEvent = () => {
    Alert.alert(
      'Add Event',
      'Event creation functionality would be implemented here with a form modal.',
      [{ text: 'OK', onPress: () => console.log('Add event pressed') }]
    );
  };

  const selectedEvents = events[selectedDate] || [];

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
            Explorer Calendar
          </Text>
          <Pressable onPress={addEvent} style={[commonStyles.headerButton, styles.addButton]}>
            <IconSymbol name="plus" color={colors.primary} size={20} />
          </Pressable>
        </View>

        {/* Calendar */}
        <GlassView style={[
          styles.calendarContainer,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.card,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textSecondary,
              dotColor: colors.primary,
              selectedDotColor: colors.card,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontWeight: '500',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </GlassView>

        {/* Selected Date Events */}
        <View style={styles.eventsSection}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 16 }]}>
            Events for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>

          {selectedEvents.length === 0 ? (
            <View style={[commonStyles.card, styles.noEventsCard]}>
              <IconSymbol name="calendar" color={colors.textSecondary} size={48} />
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 12 }]}>
                No events scheduled for this date
              </Text>
            </View>
          ) : (
            selectedEvents.map((event) => (
              <View key={event.id} style={[commonStyles.card, styles.eventCard]}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventIconContainer}>
                    <View style={[styles.eventIcon, { backgroundColor: getEventTypeColor(event.type) }]}>
                      <IconSymbol 
                        name={getEventTypeIcon(event.type) as any} 
                        color="white" 
                        size={20} 
                      />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, { color: colors.text }]}>
                        {event.title}
                      </Text>
                      <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                        {event.time}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.eventTypeBadge, { backgroundColor: getEventTypeColor(event.type) }]}>
                    <Text style={styles.eventTypeText}>
                      {event.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                  {event.description}
                </Text>
              </View>
            ))
          )}
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
  calendarContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eventsSection: {
    flex: 1,
  },
  noEventsCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
