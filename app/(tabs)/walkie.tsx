
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Alert, ScrollView, Modal, TextInput, Animated, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface Channel {
  id: string;
  name: string;
  frequency: string;
  isActive: boolean;
  users: number;
  isEmergency?: boolean;
  isCustom?: boolean;
  password?: string;
  signalStrength: number;
}

interface Transmission {
  id: string;
  channel: string;
  user: string;
  message: string;
  timestamp: Date;
  isEmergency?: boolean;
  signalStrength: number;
}

interface Recording {
  id: string;
  channel: string;
  duration: number;
  timestamp: Date;
  title: string;
}

export default function WalkieTalkieScreen() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('1');
  const [isListening, setIsListening] = useState(true);
  const [volume, setVolume] = useState(75);
  const [isScanning, setIsScanning] = useState(false);
  const [showChannelManager, setShowChannelManager] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [signalStrength, setSignalStrength] = useState(85);
  const [voiceModulation, setVoiceModulation] = useState('normal');
  const [pttButtonSize, setPttButtonSize] = useState(120);
  const [staticLevel, setStaticLevel] = useState(0.3);
  
  // Animation values
  const transmissionPulse = useRef(new Animated.Value(1)).current;
  const signalAnimation = useRef(new Animated.Value(0)).current;
  const scanAnimation = useRef(new Animated.Value(0)).current;

  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'Main Dispatch', frequency: '154.755', isActive: true, users: 8, signalStrength: 95 },
    { id: '2', name: 'Patrol Alpha', frequency: '154.785', isActive: false, users: 4, signalStrength: 78 },
    { id: '3', name: 'Patrol Bravo', frequency: '154.815', isActive: false, users: 3, signalStrength: 82 },
    { id: '4', name: 'Training', frequency: '154.845', isActive: false, users: 12, signalStrength: 90 },
    { id: '5', name: 'Emergency', frequency: '154.875', isActive: true, users: 2, isEmergency: true, signalStrength: 100 },
    { id: '6', name: 'Tactical', frequency: '154.905', isActive: false, users: 6, signalStrength: 65 },
  ]);

  const [recentTransmissions, setRecentTransmissions] = useState<Transmission[]>([
    {
      id: '1',
      channel: 'Main Dispatch',
      user: 'Unit 205',
      message: 'Patrol complete, returning to station',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      signalStrength: 95,
    },
    {
      id: '2',
      channel: 'Patrol Alpha',
      user: 'Explorer Mike',
      message: 'Traffic stop completed, all clear',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      signalStrength: 78,
    },
    {
      id: '3',
      channel: 'Emergency',
      user: 'Unit 301',
      message: 'Code 3 response required, officer needs assistance',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isEmergency: true,
      signalStrength: 100,
    },
  ]);

  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      channel: 'Main Dispatch',
      duration: 45,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      title: 'Morning Briefing',
    },
    {
      id: '2',
      channel: 'Training',
      duration: 120,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      title: 'Radio Protocol Training',
    },
  ]);

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Signal strength animation
  useEffect(() => {
    const animateSignal = () => {
      Animated.sequence([
        Animated.timing(signalAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(signalAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => animateSignal());
    };
    animateSignal();
  }, []);

  // Transmission pulse animation
  useEffect(() => {
    if (isTransmitting) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(transmissionPulse, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(transmissionPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isTransmitting) pulse();
        });
      };
      pulse();
    } else {
      transmissionPulse.setValue(1);
    }
  }, [isTransmitting]);

  // Channel scanning animation
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    } else {
      scanAnimation.setValue(0);
    }
  }, [isScanning]);

  // Simulate receiving transmissions
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 3 seconds
        simulateIncomingTransmission();
      }
      
      // Update signal strength randomly
      setSignalStrength(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(20, Math.min(100, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedChannel]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('walkieSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setVolume(settings.volume || 75);
        setPttButtonSize(settings.pttButtonSize || 120);
        setVoiceModulation(settings.voiceModulation || 'normal');
        setStaticLevel(settings.staticLevel || 0.3);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        volume,
        pttButtonSize,
        voiceModulation,
        staticLevel,
      };
      await AsyncStorage.setItem('walkieSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const simulateIncomingTransmission = () => {
    const messages = [
      'Unit checking in, all clear',
      'Patrol status update - sector 7 complete',
      'Traffic situation resolved, resuming patrol',
      'Requesting permission to return to station',
      'Community service event completed',
      'Training exercise in progress',
    ];
    
    const users = ['Unit 201', 'Unit 203', 'Explorer Sarah', 'Explorer Mike', 'Officer Johnson', 'Dispatch', 'Unit 305'];
    
    const currentChannel = channels.find(c => c.id === selectedChannel);
    if (!currentChannel) return;

    const newTransmission: Transmission = {
      id: Date.now().toString(),
      channel: currentChannel.name,
      user: users[Math.floor(Math.random() * users.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date(),
      signalStrength: currentChannel.signalStrength + (Math.random() - 0.5) * 20,
    };

    setRecentTransmissions(prev => [newTransmission, ...prev.slice(0, 9)]);
    
    // Play roger beep sound simulation
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const startTransmission = () => {
    if (!isListening) {
      Alert.alert('Radio Off', 'Please turn on the radio first');
      return;
    }
    
    setIsTransmitting(true);
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(50);
    }
    
    console.log('Started transmission on channel:', selectedChannel);
  };

  const stopTransmission = () => {
    setIsTransmitting(false);
    
    // Roger beep simulation
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    console.log('Stopped transmission');
    
    // Simulate sending a message
    const currentChannel = channels.find(c => c.id === selectedChannel);
    const newTransmission: Transmission = {
      id: Date.now().toString(),
      channel: currentChannel?.name || 'Unknown',
      user: 'You',
      message: 'Transmission sent',
      timestamp: new Date(),
      signalStrength: signalStrength,
    };
    
    setRecentTransmissions(prev => [newTransmission, ...prev.slice(0, 9)]);
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
    
    const channel = channels.find(c => c.id === channelId);
    if (channel?.password) {
      Alert.prompt(
        'Channel Password',
        `Enter password for ${channel.name}:`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'OK', 
            onPress: (password) => {
              if (password === channel.password) {
                setSelectedChannel(channelId);
              } else {
                Alert.alert('Access Denied', 'Incorrect password');
              }
            }
          }
        ],
        'secure-text'
      );
    } else {
      setSelectedChannel(channelId);
    }
  };

  const startChannelScan = () => {
    if (isTransmitting) {
      Alert.alert('Cannot Scan', 'Stop transmission before scanning');
      return;
    }
    
    setIsScanning(!isScanning);
    
    if (!isScanning) {
      // Simulate channel scanning
      let currentIndex = 0;
      const scanInterval = setInterval(() => {
        const activeChannels = channels.filter(c => c.isActive);
        if (activeChannels.length > 0) {
          setSelectedChannel(activeChannels[currentIndex % activeChannels.length].id);
          currentIndex++;
        }
      }, 2000);
      
      // Stop scanning after 30 seconds
      setTimeout(() => {
        setIsScanning(false);
        clearInterval(scanInterval);
      }, 30000);
    }
  };

  const emergencyAlert = () => {
    const emergencyChannel = channels.find(c => c.isEmergency);
    if (emergencyChannel) {
      setSelectedChannel(emergencyChannel.id);
      Alert.alert(
        'EMERGENCY CHANNEL',
        'You are now on the emergency channel. All transmissions are monitored.',
        [{ text: 'Understood', style: 'default' }]
      );
      
      // Vibrate for emergency
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 500, 200, 500]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Started recording');
      // Simulate recording start
      setTimeout(() => {
        const newRecording: Recording = {
          id: Date.now().toString(),
          channel: channels.find(c => c.id === selectedChannel)?.name || 'Unknown',
          duration: Math.floor(Math.random() * 180) + 30,
          timestamp: new Date(),
          title: `Recording ${recordings.length + 1}`,
        };
        setRecordings(prev => [newRecording, ...prev]);
        setIsRecording(false);
      }, 5000);
    }
  };

  const addCustomChannel = () => {
    Alert.prompt(
      'Add Custom Channel',
      'Enter channel name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (name) => {
            if (name) {
              const newChannel: Channel = {
                id: Date.now().toString(),
                name: name,
                frequency: `${(154.0 + Math.random() * 2).toFixed(3)}`,
                isActive: false,
                users: 0,
                isCustom: true,
                signalStrength: Math.floor(Math.random() * 40) + 60,
              };
              setChannels(prev => [...prev, newChannel]);
            }
          }
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Math.max(1, Math.min(4, bars));
  };

  const currentChannel = channels.find(c => c.id === selectedChannel);

  return (
    <SafeAreaView style={[commonStyles.wrapper]} edges={['top']}>
      <ScrollView
        style={[
          styles.container,
          Platform.OS !== 'ios' && styles.containerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            Walkie-Talkie Pro
          </Text>
          <View style={styles.headerControls}>
            <Pressable
              onPress={() => setShowRecordings(true)}
              style={[styles.headerButton, { backgroundColor: isRecording ? colors.error : colors.card }]}
            >
              <IconSymbol 
                name={isRecording ? "record.circle.fill" : "waveform"} 
                color={isRecording ? 'white' : colors.text} 
                size={20} 
              />
            </Pressable>
            <Pressable
              onPress={() => setShowChannelManager(true)}
              style={[styles.headerButton, { backgroundColor: colors.card }]}
            >
              <IconSymbol name="slider.horizontal.3" color={colors.text} size={20} />
            </Pressable>
          </View>
        </View>

        {/* Status Bar */}
        <GlassView style={[
          styles.statusBar,
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <View style={styles.statusItem}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isListening ? colors.success : colors.error }
            ]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {isListening ? 'Online' : 'Offline'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={styles.signalBars}>
              {[1, 2, 3, 4].map((bar) => (
                <Animated.View
                  key={bar}
                  style={[
                    styles.signalBar,
                    {
                      height: bar * 4 + 8,
                      backgroundColor: bar <= getSignalBars(signalStrength) 
                        ? colors.success 
                        : colors.border,
                      opacity: signalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {signalStrength}%
            </Text>
          </View>

          <View style={styles.statusItem}>
            <IconSymbol name="speaker.wave.2.fill" color={colors.textSecondary} size={16} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {volume}%
            </Text>
          </View>
        </GlassView>

        {/* Current Channel Info */}
        <GlassView style={[
          styles.channelInfo,
          currentChannel?.isEmergency && { borderColor: colors.error, borderWidth: 2 },
          Platform.OS !== 'ios' && { backgroundColor: 'rgba(255,255,255,0.9)' }
        ]} glassEffectStyle="regular">
          <View style={styles.channelHeader}>
            <Text style={[
              styles.channelName, 
              { 
                color: currentChannel?.isEmergency ? colors.error : colors.text 
              }
            ]}>
              {currentChannel?.name}
              {currentChannel?.isEmergency && ' 🚨'}
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
            
            <View style={styles.statItem}>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                Static: {Math.floor(staticLevel * 100)}%
              </Text>
            </View>
            
            <View style={[
              styles.activityIndicator,
              { backgroundColor: currentChannel?.isActive ? colors.success : colors.textSecondary }
            ]}>
              <Text style={styles.activityText}>
                {isScanning ? 'SCANNING' : currentChannel?.isActive ? 'ACTIVE' : 'QUIET'}
              </Text>
            </View>
          </View>
        </GlassView>

        {/* Push to Talk Button */}
        <View style={styles.pttContainer}>
          <Animated.View style={{ transform: [{ scale: transmissionPulse }] }}>
            <Pressable
              onPressIn={startTransmission}
              onPressOut={stopTransmission}
              style={[
                styles.pttButton,
                {
                  backgroundColor: isTransmitting ? colors.error : colors.primary,
                  width: pttButtonSize,
                  height: pttButtonSize,
                  borderRadius: pttButtonSize / 2,
                  opacity: !isListening ? 0.5 : 1,
                }
              ]}
              disabled={!isListening}
            >
              <IconSymbol 
                name={isTransmitting ? "mic.fill" : "mic"} 
                color="white" 
                size={pttButtonSize * 0.4} 
              />
              {isTransmitting && (
                <View style={styles.transmissionRing}>
                  <Animated.View style={[
                    styles.transmissionRingInner,
                    {
                      transform: [{ scale: transmissionPulse }],
                    }
                  ]} />
                </View>
              )}
            </Pressable>
          </Animated.View>
          
          <Text style={[styles.pttLabel, { color: colors.text }]}>
            {isTransmitting ? 'TRANSMITTING' : 'PUSH TO TALK'}
          </Text>
          <Text style={[styles.pttInstructions, { color: colors.textSecondary }]}>
            Hold to transmit • Voice: {voiceModulation}
          </Text>
        </View>

        {/* Quick Controls */}
        <View style={styles.quickControls}>
          <Pressable
            onPress={toggleListening}
            style={[
              styles.quickControlButton,
              { backgroundColor: isListening ? colors.success : colors.error }
            ]}
          >
            <IconSymbol 
              name={isListening ? "speaker.wave.2.fill" : "speaker.slash.fill"} 
              color="white" 
              size={20} 
            />
            <Text style={styles.quickControlText}>
              {isListening ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          <Pressable
            onPress={startChannelScan}
            style={[
              styles.quickControlButton, 
              { backgroundColor: isScanning ? colors.warning : colors.primary }
            ]}
          >
            <Animated.View style={{
              transform: [{
                rotate: scanAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }]
            }}>
              <IconSymbol name="arrow.clockwise" color="white" size={20} />
            </Animated.View>
            <Text style={styles.quickControlText}>
              {isScanning ? 'SCANNING' : 'SCAN'}
            </Text>
          </Pressable>

          <Pressable
            onPress={emergencyAlert}
            style={[styles.quickControlButton, { backgroundColor: colors.error }]}
          >
            <IconSymbol name="exclamationmark.triangle.fill" color="white" size={20} />
            <Text style={styles.quickControlText}>
              EMERGENCY
            </Text>
          </Pressable>

          <Pressable
            onPress={startRecording}
            style={[
              styles.quickControlButton, 
              { backgroundColor: isRecording ? colors.error : colors.secondary }
            ]}
          >
            <IconSymbol 
              name={isRecording ? "stop.circle.fill" : "record.circle"} 
              color="white" 
              size={20} 
            />
            <Text style={styles.quickControlText}>
              {isRecording ? 'STOP' : 'REC'}
            </Text>
          </Pressable>
        </View>

        {/* Channel Selection */}
        <View style={styles.channelsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              Channels
            </Text>
            <Pressable onPress={addCustomChannel} style={styles.addButton}>
              <IconSymbol name="plus" color={colors.primary} size={20} />
            </Pressable>
          </View>
          
          <View style={styles.channelsList}>
            {channels.map((channel) => (
              <Pressable
                key={channel.id}
                onPress={() => selectChannel(channel.id)}
                style={[
                  styles.channelItem,
                  {
                    backgroundColor: channel.id === selectedChannel ? colors.primary : colors.card,
                    borderColor: channel.isEmergency 
                      ? colors.error 
                      : channel.id === selectedChannel 
                        ? colors.primary 
                        : colors.border,
                    borderWidth: channel.isEmergency ? 2 : 1,
                  }
                ]}
              >
                <View style={styles.channelItemInfo}>
                  <View style={styles.channelItemHeader}>
                    <Text style={[
                      styles.channelItemName,
                      { color: channel.id === selectedChannel ? 'white' : colors.text }
                    ]}>
                      {channel.name}
                      {channel.isEmergency && ' 🚨'}
                      {channel.password && ' 🔒'}
                    </Text>
                    {channel.isCustom && (
                      <Text style={[
                        styles.customBadge,
                        { color: channel.id === selectedChannel ? 'white' : colors.primary }
                      ]}>
                        CUSTOM
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.channelItemFreq,
                    { color: channel.id === selectedChannel ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                  ]}>
                    {channel.frequency} MHz • Signal: {channel.signalStrength}%
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
            {recentTransmissions.slice(0, 5).map((transmission) => (
              <View 
                key={transmission.id} 
                style={[
                  commonStyles.card, 
                  styles.transmissionItem,
                  transmission.isEmergency && { borderLeftColor: colors.error, borderLeftWidth: 4 }
                ]}
              >
                <View style={styles.transmissionHeader}>
                  <Text style={[
                    styles.transmissionUser, 
                    { 
                      color: transmission.isEmergency ? colors.error : colors.text,
                      fontWeight: transmission.isEmergency ? '700' : '600'
                    }
                  ]}>
                    {transmission.user}
                    {transmission.isEmergency && ' 🚨'}
                  </Text>
                  <View style={styles.transmissionMeta}>
                    <View style={styles.signalIndicator}>
                      {[1, 2, 3].map((bar) => (
                        <View
                          key={bar}
                          style={[
                            styles.miniSignalBar,
                            {
                              backgroundColor: bar <= Math.ceil(transmission.signalStrength / 33) 
                                ? colors.success 
                                : colors.border,
                            }
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[styles.transmissionTime, { color: colors.textSecondary }]}>
                      {formatTime(transmission.timestamp)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.transmissionChannel, { color: colors.textSecondary }]}>
                  {transmission.channel}
                </Text>
                <Text style={[
                  styles.transmissionMessage, 
                  { 
                    color: transmission.isEmergency ? colors.error : colors.textSecondary,
                    fontWeight: transmission.isEmergency ? '500' : '400'
                  }
                ]}>
                  {transmission.message}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Channel Manager Modal */}
        <Modal
          visible={showChannelManager}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[commonStyles.title, { color: colors.text }]}>
                Channel Manager
              </Text>
              <Pressable
                onPress={() => setShowChannelManager(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" color={colors.text} size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.settingsSection}>
                <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                  Audio Settings
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Volume: {volume}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    {[25, 50, 75, 100].map((val) => (
                      <Pressable
                        key={val}
                        onPress={() => setVolume(val)}
                        style={[
                          styles.sliderButton,
                          { backgroundColor: volume >= val ? colors.primary : colors.border }
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Static Level: {Math.floor(staticLevel * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    {[0.1, 0.3, 0.5, 0.7].map((val) => (
                      <Pressable
                        key={val}
                        onPress={() => setStaticLevel(val)}
                        style={[
                          styles.sliderButton,
                          { backgroundColor: staticLevel >= val ? colors.warning : colors.border }
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Voice Modulation
                  </Text>
                  <View style={styles.modificationButtons}>
                    {['normal', 'deep', 'high', 'robotic'].map((mod) => (
                      <Pressable
                        key={mod}
                        onPress={() => setVoiceModulation(mod)}
                        style={[
                          styles.modButton,
                          { 
                            backgroundColor: voiceModulation === mod ? colors.primary : colors.card,
                            borderColor: colors.border,
                          }
                        ]}
                      >
                        <Text style={[
                          styles.modButtonText,
                          { color: voiceModulation === mod ? 'white' : colors.text }
                        ]}>
                          {mod.toUpperCase()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    PTT Button Size: {pttButtonSize}px
                  </Text>
                  <View style={styles.sliderContainer}>
                    {[100, 120, 140, 160].map((size) => (
                      <Pressable
                        key={size}
                        onPress={() => setPttButtonSize(size)}
                        style={[
                          styles.sliderButton,
                          { backgroundColor: pttButtonSize >= size ? colors.accent : colors.border }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  saveSettings();
                  setShowChannelManager(false);
                }}
                style={[commonStyles.card, { backgroundColor: colors.primary, marginTop: 20 }]}
              >
                <Text style={[commonStyles.text, { color: 'white', textAlign: 'center' }]}>
                  Save Settings
                </Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Recordings Modal */}
        <Modal
          visible={showRecordings}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[commonStyles.title, { color: colors.text }]}>
                Recordings
              </Text>
              <Pressable
                onPress={() => setShowRecordings(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" color={colors.text} size={24} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {recordings.map((recording) => (
                <View key={recording.id} style={[commonStyles.card, styles.recordingItem]}>
                  <View style={styles.recordingHeader}>
                    <Text style={[styles.recordingTitle, { color: colors.text }]}>
                      {recording.title}
                    </Text>
                    <Text style={[styles.recordingDuration, { color: colors.textSecondary }]}>
                      {formatDuration(recording.duration)}
                    </Text>
                  </View>
                  <Text style={[styles.recordingChannel, { color: colors.textSecondary }]}>
                    {recording.channel} • {formatTime(recording.timestamp)}
                  </Text>
                  <View style={styles.recordingControls}>
                    <Pressable
                      onPress={() => Alert.alert('Play', 'Would play recording')}
                      style={[styles.recordingButton, { backgroundColor: colors.primary }]}
                    >
                      <IconSymbol name="play.fill" color="white" size={16} />
                    </Pressable>
                    <Pressable
                      onPress={() => Alert.alert('Share', 'Would share recording')}
                      style={[styles.recordingButton, { backgroundColor: colors.secondary }]}
                    >
                      <IconSymbol name="square.and.arrow.up" color="white" size={16} />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setRecordings(prev => prev.filter(r => r.id !== recording.id));
                      }}
                      style={[styles.recordingButton, { backgroundColor: colors.error }]}
                    >
                      <IconSymbol name="trash" color="white" size={16} />
                    </Pressable>
                  </View>
                </View>
              ))}
              
              {recordings.length === 0 && (
                <View style={styles.emptyState}>
                  <IconSymbol name="waveform" color={colors.textSecondary} size={48} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No recordings yet
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </ScrollView>
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
    marginBottom: 16,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: 6,
  },
  signalBar: {
    width: 3,
    backgroundColor: colors.success,
    borderRadius: 1,
  },
  channelInfo: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  channelHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  channelName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
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
    fontSize: 12,
  },
  activityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  pttContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pttButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  transmissionRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: colors.error,
  },
  transmissionRingInner: {
    flex: 1,
    borderRadius: 1000,
    backgroundColor: 'transparent',
  },
  pttLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  pttInstructions: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  quickControlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  quickControlText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  channelsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    padding: 4,
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
  channelItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  channelItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  customBadge: {
    fontSize: 10,
    fontWeight: '700',
  },
  channelItemFreq: {
    fontSize: 11,
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
    marginBottom: 20,
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
  transmissionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  miniSignalBar: {
    width: 2,
    height: 8,
    borderRadius: 1,
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    gap: 20,
  },
  settingItem: {
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderButton: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  modificationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  modButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordingItem: {
    marginBottom: 12,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordingDuration: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordingChannel: {
    fontSize: 12,
    marginBottom: 12,
  },
  recordingControls: {
    flexDirection: 'row',
    gap: 8,
  },
  recordingButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
