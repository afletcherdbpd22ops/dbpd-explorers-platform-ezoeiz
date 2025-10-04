
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert, Modal, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface Event {
  id: string;
  title: string;
  time: string;
  endTime?: string;
  description: string;
  type: 'training' | 'meeting' | 'community' | 'patrol' | 'emergency' | 'ceremony';
  priority: 'low' | 'medium' | 'high';
  location?: string;
  attendees?: string[];
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  reminderMinutes?: number;
  createdBy: string;
  createdAt: string;
}

interface CalendarView {
  type: 'month' | 'week' | 'agenda';
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<Event | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarView['type']>('month');
  const [filterType, setFilterType] = useState<Event['type'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for adding events
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    time: '09:00',
    endTime: '10:00',
    description: '',
    type: 'meeting',
    priority: 'medium',
    location: '',
    reminderMinutes: 15,
    isRecurring: false,
    recurringType: 'weekly',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('explorer_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Initialize with sample data
        const sampleEvents = {
          '2024-01-15': [
            {
              id: '1',
              title: 'Morning Training Session',
              time: '08:00',
              endTime: '10:00',
              description: 'Physical fitness and tactical training with Officer Martinez',
              type: 'training' as const,
              priority: 'high' as const,
              location: 'Training Facility',
              attendees: ['All Explorers'],
              createdBy: 'Officer Martinez',
              createdAt: new Date().toISOString(),
              reminderMinutes: 30,
            },
            {
              id: '2',
              title: 'Community Patrol',
              time: '14:00',
              endTime: '18:00',
              description: 'Downtown area patrol and community engagement',
              type: 'patrol' as const,
              priority: 'medium' as const,
              location: 'Downtown District',
              createdBy: 'Officer Johnson',
              createdAt: new Date().toISOString(),
              reminderMinutes: 15,
            },
          ],
          '2024-01-16': [
            {
              id: '3',
              title: 'Monthly Explorer Meeting',
              time: '19:00',
              endTime: '21:00',
              description: 'Monthly briefing, updates, and planning session',
              type: 'meeting' as const,
              priority: 'high' as const,
              location: 'Conference Room A',
              isRecurring: true,
              recurringType: 'monthly' as const,
              createdBy: 'Commander Smith',
              createdAt: new Date().toISOString(),
              reminderMinutes: 60,
            },
          ],
          '2024-01-18': [
            {
              id: '4',
              title: 'School Safety Demonstration',
              time: '10:00',
              endTime: '12:00',
              description: 'Safety presentation at Daytona Elementary School',
              type: 'community' as const,
              priority: 'medium' as const,
              location: 'Daytona Elementary School',
              createdBy: 'Officer Davis',
              createdAt: new Date().toISOString(),
              reminderMinutes: 30,
            },
          ],
          '2024-01-20': [
            {
              id: '5',
              title: 'Awards Ceremony',
              time: '18:00',
              endTime: '20:00',
              description: 'Annual Explorer recognition and awards ceremony',
              type: 'ceremony' as const,
              priority: 'high' as const,
              location: 'City Hall Auditorium',
              createdBy: 'Chief Williams',
              createdAt: new Date().toISOString(),
              reminderMinutes: 120,
            },
          ],
        };
        setEvents(sampleEvents);
        await AsyncStorage.setItem('explorer_events', JSON.stringify(sampleEvents));
      }
    } catch (error) {
      console.log('Error loading events:', error);
    }
  };

  const saveEvents = async (updatedEvents: { [key: string]: Event[] }) => {
    try {
      await AsyncStorage.setItem('explorer_events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.log('Error saving events:', error);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    
    Object.keys(events).forEach(date => {
      const dayEvents = events[date];
      if (dayEvents && dayEvents.length > 0) {
        const filteredEvents = filterType === 'all' 
          ? dayEvents 
          : dayEvents.filter(event => event.type === filterType);
        
        if (filteredEvents.length > 0) {
          const highPriorityEvent = filteredEvents.find(e => e.priority === 'high');
          const mediumPriorityEvent = filteredEvents.find(e => e.priority === 'medium');
          
          marked[date] = {
            marked: true,
            dotColor: highPriorityEvent 
              ? colors.error 
              : mediumPriorityEvent 
                ? colors.warning 
                : colors.primary,
            selectedColor: date === selectedDate ? colors.primary : undefined,
            selected: date === selectedDate,
          };
        }
      }
    });

    // Mark selected date even if no events
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'training': return colors.primary;
      case 'meeting': return colors.accent;
      case 'community': return colors.success;
      case 'patrol': return colors.warning;
      case 'emergency': return colors.error;
      case 'ceremony': return '#8B5CF6';
      default: return colors.textSecondary;
    }
  };

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'training': return 'figure.run';
      case 'meeting': return 'person.3.fill';
      case 'community': return 'heart.fill';
      case 'patrol': return 'car.fill';
      case 'emergency': return 'exclamationmark.triangle.fill';
      case 'ceremony': return 'star.fill';
      default: return 'calendar';
    }
  };

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const onDayPress = (day: DateData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(day.dateString);
  };

  const addEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddModal(true);
  };

  const saveNewEvent = async () => {
    if (!newEvent.title || !newEvent.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const eventId = Date.now().toString();
    const event: Event = {
      id: eventId,
      title: newEvent.title!,
      time: newEvent.time!,
      endTime: newEvent.endTime,
      description: newEvent.description || '',
      type: newEvent.type!,
      priority: newEvent.priority!,
      location: newEvent.location,
      reminderMinutes: newEvent.reminderMinutes,
      isRecurring: newEvent.isRecurring,
      recurringType: newEvent.recurringType,
      createdBy: 'Current User', // In real app, get from auth
      createdAt: new Date().toISOString(),
    };

    const updatedEvents = { ...events };
    if (!updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = [];
    }
    updatedEvents[selectedDate].push(event);

    await saveEvents(updatedEvents);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      time: '09:00',
      endTime: '10:00',
      description: '',
      type: 'meeting',
      priority: 'medium',
      location: '',
      reminderMinutes: 15,
      isRecurring: false,
      recurringType: 'weekly',
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const deleteEvent = async (eventId: string) => {
    const updatedEvents = { ...events };
    if (updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = updatedEvents[selectedDate].filter(e => e.id !== eventId);
      if (updatedEvents[selectedDate].length === 0) {
        delete updatedEvents[selectedDate];
      }
    }
    await saveEvents(updatedEvents);
    setShowEventDetails(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getFilteredEvents = () => {
    const dayEvents = events[selectedDate] || [];
    let filtered = filterType === 'all' ? dayEvents : dayEvents.filter(event => event.type === filterType);
    
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => a.time.localeCompare(b.time));
  };

  const eventTypes: Event['type'][] = ['training', 'meeting', 'community', 'patrol', 'emergency', 'ceremony'];

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
          <View>
            <Text style={[commonStyles.title, { color: colors.text }]}>
              Explorer Calendar
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={addEvent} style={[commonStyles.headerButton, styles.addButton]}>
              <IconSymbol name="plus" color={colors.primary} size={20} />
            </Pressable>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={16} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search events..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <Pressable
              onPress={() => setFilterType('all')}
              style={[
                styles.filterChip,
                filterType === 'all' && styles.filterChipActive
              ]}
            >
              <Text style={[
                styles.filterChipText,
                { color: filterType === 'all' ? 'white' : colors.text }
              ]}>
                All
              </Text>
            </Pressable>
            {eventTypes.map(type => (
              <Pressable
                key={type}
                onPress={() => setFilterType(type)}
                style={[
                  styles.filterChip,
                  filterType === type && styles.filterChipActive,
                  filterType === type && { backgroundColor: getEventTypeColor(type) }
                ]}
              >
                <IconSymbol 
                  name={getEventTypeIcon(type) as any} 
                  color={filterType === type ? 'white' : colors.textSecondary} 
                  size={14} 
                />
                <Text style={[
                  styles.filterChipText,
                  { color: filterType === type ? 'white' : colors.text }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Calendar */}
        <GlassView style={[
          styles.calendarContainer,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <Calendar
            onDayPress={onDayPress}
            markedDates={getMarkedDates()}
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
          <View style={styles.eventsSectionHeader}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={[styles.eventCount, { color: colors.textSecondary }]}>
              {getFilteredEvents().length} event{getFilteredEvents().length !== 1 ? 's' : ''}
            </Text>
          </View>

          {getFilteredEvents().length === 0 ? (
            <View style={[commonStyles.card, styles.noEventsCard]}>
              <IconSymbol name="calendar" color={colors.textSecondary} size={48} />
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 12 }]}>
                {searchQuery || filterType !== 'all' 
                  ? 'No matching events found' 
                  : 'No events scheduled for this date'
                }
              </Text>
              <Pressable onPress={addEvent} style={styles.addEventButton}>
                <Text style={[styles.addEventButtonText, { color: colors.primary }]}>
                  Add Event
                </Text>
              </Pressable>
            </View>
          ) : (
            getFilteredEvents().map((event) => (
              <Pressable
                key={event.id}
                onPress={() => setShowEventDetails(event)}
                style={[commonStyles.card, styles.eventCard]}
              >
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
                      <View style={styles.eventTitleRow}>
                        <Text style={[styles.eventTitle, { color: colors.text }]}>
                          {event.title}
                        </Text>
                        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(event.priority) }]} />
                      </View>
                      <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                        {event.time}{event.endTime && ` - ${event.endTime}`}
                      </Text>
                      {event.location && (
                        <View style={styles.locationRow}>
                          <IconSymbol name="location.fill" color={colors.textSecondary} size={12} />
                          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                            {event.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.eventBadges}>
                    <View style={[styles.eventTypeBadge, { backgroundColor: getEventTypeColor(event.type) }]}>
                      <Text style={styles.eventTypeText}>
                        {event.type.toUpperCase()}
                      </Text>
                    </View>
                    {event.isRecurring && (
                      <View style={styles.recurringBadge}>
                        <IconSymbol name="repeat" color={colors.textSecondary} size={12} />
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                  {event.description}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowAddModal(false)}>
              <Text style={[styles.modalButton, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Event</Text>
            <Pressable onPress={saveNewEvent}>
              <Text style={[styles.modalButton, { color: colors.primary }]}>Save</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Title *</Text>
              <TextInput
                style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                placeholder="Event title"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Start Time *</Text>
                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
                  value={newEvent.time}
                  onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
                  placeholder="09:00"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.formLabel, { color: colors.text }]}>End Time</Text>
                <TextInput
                  style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
                  value={newEvent.endTime}
                  onChangeText={(text) => setNewEvent({ ...newEvent, endTime: text })}
                  placeholder="10:00"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {eventTypes.map(type => (
                  <Pressable
                    key={type}
                    onPress={() => setNewEvent({ ...newEvent, type })}
                    style={[
                      styles.typeChip,
                      newEvent.type === type && { backgroundColor: getEventTypeColor(type) }
                    ]}
                  >
                    <IconSymbol 
                      name={getEventTypeIcon(type) as any} 
                      color={newEvent.type === type ? 'white' : colors.textSecondary} 
                      size={16} 
                    />
                    <Text style={[
                      styles.typeChipText,
                      { color: newEvent.type === type ? 'white' : colors.text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Priority</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as const).map(priority => (
                  <Pressable
                    key={priority}
                    onPress={() => setNewEvent({ ...newEvent, priority })}
                    style={[
                      styles.priorityChip,
                      newEvent.priority === priority && { backgroundColor: getPriorityColor(priority) }
                    ]}
                  >
                    <Text style={[
                      styles.priorityChipText,
                      { color: newEvent.priority === priority ? 'white' : colors.text }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Location</Text>
              <TextInput
                style={[styles.formInput, { color: colors.text, borderColor: colors.border }]}
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                placeholder="Event location"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.formTextArea, { color: colors.text, borderColor: colors.border }]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                placeholder="Event description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={[styles.formLabel, { color: colors.text }]}>Recurring Event</Text>
                <Switch
                  value={newEvent.isRecurring}
                  onValueChange={(value) => setNewEvent({ ...newEvent, isRecurring: value })}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.card}
                />
              </View>
              {newEvent.isRecurring && (
                <View style={styles.recurringOptions}>
                  {(['daily', 'weekly', 'monthly'] as const).map(type => (
                    <Pressable
                      key={type}
                      onPress={() => setNewEvent({ ...newEvent, recurringType: type })}
                      style={[
                        styles.recurringChip,
                        newEvent.recurringType === type && { backgroundColor: colors.primary }
                      ]}
                    >
                      <Text style={[
                        styles.recurringChipText,
                        { color: newEvent.recurringType === type ? 'white' : colors.text }
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        visible={!!showEventDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {showEventDetails && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowEventDetails(null)}>
                <Text style={[styles.modalButton, { color: colors.textSecondary }]}>Close</Text>
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Event Details</Text>
              <Pressable onPress={() => {
                Alert.alert(
                  'Delete Event',
                  'Are you sure you want to delete this event?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(showEventDetails.id) }
                  ]
                );
              }}>
                <Text style={[styles.modalButton, { color: colors.error }]}>Delete</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.eventDetailHeader}>
                <View style={[styles.eventDetailIcon, { backgroundColor: getEventTypeColor(showEventDetails.type) }]}>
                  <IconSymbol 
                    name={getEventTypeIcon(showEventDetails.type) as any} 
                    color="white" 
                    size={32} 
                  />
                </View>
                <View style={styles.eventDetailInfo}>
                  <Text style={[styles.eventDetailTitle, { color: colors.text }]}>
                    {showEventDetails.title}
                  </Text>
                  <View style={styles.eventDetailBadges}>
                    <View style={[styles.eventTypeBadge, { backgroundColor: getEventTypeColor(showEventDetails.type) }]}>
                      <Text style={styles.eventTypeText}>
                        {showEventDetails.type.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(showEventDetails.priority) }]}>
                      <Text style={styles.priorityBadgeText}>
                        {showEventDetails.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.eventDetailSection}>
                <View style={styles.detailRow}>
                  <IconSymbol name="clock.fill" color={colors.textSecondary} size={20} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {showEventDetails.time}{showEventDetails.endTime && ` - ${showEventDetails.endTime}`}
                  </Text>
                </View>

                {showEventDetails.location && (
                  <View style={styles.detailRow}>
                    <IconSymbol name="location.fill" color={colors.textSecondary} size={20} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {showEventDetails.location}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <IconSymbol name="person.fill" color={colors.textSecondary} size={20} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Created by {showEventDetails.createdBy}
                  </Text>
                </View>

                {showEventDetails.isRecurring && (
                  <View style={styles.detailRow}>
                    <IconSymbol name="repeat" color={colors.textSecondary} size={20} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      Repeats {showEventDetails.recurringType}
                    </Text>
                  </View>
                )}
              </View>

              {showEventDetails.description && (
                <View style={styles.eventDetailSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                  <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                    {showEventDetails.description}
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eventsSection: {
    flex: 1,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  noEventsCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  addEventButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addEventButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventBadges: {
    alignItems: 'flex-end',
    gap: 4,
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
  recurringBadge: {
    backgroundColor: colors.card,
    padding: 4,
    borderRadius: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  formTextArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 4,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recurringOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  recurringChip: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  recurringChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  eventDetailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetailInfo: {
    flex: 1,
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  eventDetailBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  eventDetailSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
