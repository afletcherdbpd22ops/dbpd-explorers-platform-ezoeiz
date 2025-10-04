
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Channel {
  id: string;
  name: string;
  frequency: string;
  isActive: boolean;
  users: number;
}

export default function WalkieTalkieScreen() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('1');
  const [isListening, setIsListening] = useState(true);
  const [volume, setVolume] = useState(75);

  const channels: Channel[] = [
    { id: '1', name: 'Main Dispatch', frequency: '154.755', isActive: true, users: 8 },
    { id: '2', name: 'Patrol Alpha', frequency: '154.785', isActive: false, users: 4 },
    { id: '3', name: 'Patrol Bravo', frequency: '154.815', isActive: false, users: 3 },
    { id: '4', name: 'Training', frequency: '154.845', isActive: false, users: 12 },
    { id: '5', name: 'Emergency', frequency: '154.875', isActive: true, users: 2 },
  ];

  const [recentTransmissions, setRecentTransmissions] = useState([
    {
      id: '1',
      channel: 'Main Dispatch',
      user: 'Unit 205',
      message: 'Patrol complete, returning to station',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: '2',
      channel: 'Patrol Alpha',
      user: 'Explorer Mike',
      message: 'Traffic stop completed, all clear',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '3',
      channel: 'Main Dispatch',
      user: 'Dispatch',
      message: 'All units, weather advisory in effect',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
    },
  ]);

  useEffect(() => {
    // Simulate receiving transmissions
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        const messages = [
          'Unit checking in',
          'Patrol status update',
          'All clear on sector 7',
          'Requesting backup',
          'Traffic situation resolved',
        ];
        const users = ['Unit 201', 'Unit 203', 'Explorer Sarah', 'Officer Johnson', 'Dispatch'];
        
        const newTransmission = {
          id: Date.now().toString(),
          channel: channels.find(c => c.id === selectedChannel)?.name || 'Main Dispatch',
          user: users[Math.floor(Math.random() * users.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
        };

        setRecentTransmissions(prev => [newTransmission, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedChannel]);

  const startTransmission = () => {
    if (!isListening) {
      Alert.alert('Radio Off', 'Please turn on the radio first');
      return;
    }
    setIsTransmitting(true);
    console.log('Started transmission on channel:', selectedChannel);
  };

  const stopTransmission = () => {
    setIsTransmitting(false);
    console.log('Stopped transmission');
    
    // Simulate sending a message
    Alert.alert(
      'Transmission Sent',
      'Your message has been transmitted to all units on this channel.',
      [{ text: 'OK' }]
    );
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      setIsTransmitting(false);
    }
  };

  const selectChannel = (channelId: string) => {
    if (isTransmitting) {
      Alert.alert('Cannot Change Channel', 'Stop transmission before changing channels');
      return;
    }
    setSelectedChannel(channelId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const currentChannel = channels.find(c => c.id === selectedChannel);

  return (
    <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
      <View
        style={[
          styles.container,
          Platform.OS !== 'ios' && styles.containerWithTabBar
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            Walkie-Talkie
          </Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isListening ? colors.success : colors.error }
            ]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {isListening ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Current Channel Info */}
        <GlassView style={[
          styles.channelInfo,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <View style={styles.channelHeader}>
            <Text style={[styles.channelName, { color: colors.text }]}>
              {currentChannel?.name}
            </Text>
            <Text style={[styles.channelFrequency, { color: colors.textSecondary }]}>
              {currentChannel?.frequency} MHz
            </Text>
          </View>
          <View style={styles.channelStats}>
            <View style={styles.statItem}>
              <IconSymbol name="person.fill" color={colors.primary} size={16} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {currentChannel?.users} users
              </Text>
            </View>
            <View style={[
              styles.activityIndicator,
              { backgroundColor: currentChannel?.isActive ? colors.success : colors.textSecondary }
            ]}>
              <Text style={styles.activityText}>
                {currentChannel?.isActive ? 'ACTIVE' : 'QUIET'}
              </Text>
            </View>
          </View>
        </GlassView>

        {/* Push to Talk Button */}
        <View style={styles.pttContainer}>
          <Pressable
            onPressIn={startTransmission}
            onPressOut={stopTransmission}
            style={[
              styles.pttButton,
              {
                backgroundColor: isTransmitting ? colors.error : colors.primary,
                transform: [{ scale: isTransmitting ? 1.1 : 1 }],
              }
            ]}
            disabled={!isListening}
          >
            <IconSymbol 
              name={isTransmitting ? "mic.fill" : "mic"} 
              color="white" 
              size={48} 
            />
          </Pressable>
          <Text style={[styles.pttLabel, { color: colors.text }]}>
            {isTransmitting ? 'TRANSMITTING' : 'PUSH TO TALK'}
          </Text>
          <Text style={[styles.pttInstructions, { color: colors.textSecondary }]}>
            Hold to transmit, release to listen
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={toggleListening}
            style={[
              styles.controlButton,
              { backgroundColor: isListening ? colors.success : colors.error }
            ]}
          >
            <IconSymbol 
              name={isListening ? "speaker.wave.2.fill" : "speaker.slash.fill"} 
              color="white" 
              size={24} 
            />
            <Text style={styles.controlButtonText}>
              {isListening ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert('Volume', 'Volume control would be implemented here')}
            style={[styles.controlButton, { backgroundColor: colors.primary }]}
          >
            <IconSymbol name="speaker.wave.3.fill" color="white" size={24} />
            <Text style={styles.controlButtonText}>
              {volume}%
            </Text>
          </Pressable>
        </View>

        {/* Channel Selection */}
        <View style={styles.channelsSection}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 12 }]}>
            Channels
          </Text>
          <View style={styles.channelsList}>
            {channels.map((channel) => (
              <Pressable
                key={channel.id}
                onPress={() => selectChannel(channel.id)}
                style={[
                  styles.channelItem,
                  {
                    backgroundColor: channel.id === selectedChannel ? colors.primary : colors.card,
                    borderColor: channel.id === selectedChannel ? colors.primary : colors.border,
                  }
                ]}
              >
                <View style={styles.channelItemInfo}>
                  <Text style={[
                    styles.channelItemName,
                    { color: channel.id === selectedChannel ? 'white' : colors.text }
                  ]}>
                    {channel.name}
                  </Text>
                  <Text style={[
                    styles.channelItemFreq,
                    { color: channel.id === selectedChannel ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                  ]}>
                    {channel.frequency} MHz
                  </Text>
                </View>
                <View style={styles.channelItemStatus}>
                  {channel.isActive && (
                    <View style={[
                      styles.activityDot,
                      { backgroundColor: channel.id === selectedChannel ? 'white' : colors.success }
                    ]} />
                  )}
                  <Text style={[
                    styles.channelItemUsers,
                    { color: channel.id === selectedChannel ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                  ]}>
                    {channel.users}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Transmissions */}
        <View style={styles.transmissionsSection}>
          <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 12 }]}>
            Recent Transmissions
          </Text>
          <View style={styles.transmissionsList}>
            {recentTransmissions.slice(0, 3).map((transmission) => (
              <View key={transmission.id} style={[commonStyles.card, styles.transmissionItem]}>
                <View style={styles.transmissionHeader}>
                  <Text style={[styles.transmissionUser, { color: colors.text }]}>
                    {transmission.user}
                  </Text>
                  <Text style={[styles.transmissionTime, { color: colors.textSecondary }]}>
                    {formatTime(transmission.timestamp)}
                  </Text>
                </View>
                <Text style={[styles.transmissionChannel, { color: colors.textSecondary }]}>
                  {transmission.channel}
                </Text>
                <Text style={[styles.transmissionMessage, { color: colors.textSecondary }]}>
                  {transmission.message}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  containerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  channelInfo: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  channelHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  channelName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  channelFrequency: {
    fontSize: 16,
    fontWeight: '500',
  },
  channelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
  },
  activityIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  pttContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pttButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pttLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  pttInstructions: {
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  channelsSection: {
    marginBottom: 24,
  },
  channelsList: {
    gap: 8,
  },
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  channelItemInfo: {
    flex: 1,
  },
  channelItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  channelItemFreq: {
    fontSize: 12,
  },
  channelItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  channelItemUsers: {
    fontSize: 12,
    fontWeight: '500',
  },
  transmissionsSection: {
    flex: 1,
  },
  transmissionsList: {
    gap: 8,
  },
  transmissionItem: {
    padding: 12,
  },
  transmissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transmissionUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  transmissionTime: {
    fontSize: 12,
  },
  transmissionChannel: {
    fontSize: 12,
    marginBottom: 4,
  },
  transmissionMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
});
