
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';

interface Explorer {
  id: string;
  name: string;
  rank: string;
  badgeNumber: string;
  status: 'active' | 'probationary' | 'inactive';
  joinDate: string;
  communityServiceHours: number;
  phone: string;
  email: string;
  specializations: string[];
}

export default function RosterScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'probationary' | 'inactive'>('all');
  const router = useRouter();

  const explorers: Explorer[] = [
    {
      id: '1',
      name: 'Officer Sarah Martinez',
      rank: 'Advisor',
      badgeNumber: 'DBPD-2019-045',
      status: 'active',
      joinDate: '2019-06-15',
      communityServiceHours: 0, // Advisors don't track community service hours
      phone: '(386) 671-5100',
      email: 'smartinez@daytonabeach.org',
      specializations: ['Program Leadership', 'Training Coordination', 'Youth Development'],
    },
    {
      id: '2',
      name: 'Officer Michael Rodriguez',
      rank: 'Advisor',
      badgeNumber: 'DBPD-2021-032',
      status: 'active',
      joinDate: '2021-03-22',
      communityServiceHours: 0,
      phone: '(386) 671-5101',
      email: 'mrodriguez@daytonabeach.org',
      specializations: ['Emergency Response Training', 'Community Relations'],
    },
    {
      id: '3',
      name: 'Alex Johnson',
      rank: 'Explorer Lieutenant',
      badgeNumber: 'EX-2024-015',
      status: 'active',
      joinDate: '2023-03-15',
      communityServiceHours: 127,
      phone: '(386) 555-0123',
      email: 'alex.johnson@dbpoliceexplorers.org',
      specializations: ['Traffic Control', 'Community Outreach'],
    },
    {
      id: '4',
      name: 'Sarah Martinez',
      rank: 'Explorer Major',
      badgeNumber: 'EX-2022-003',
      status: 'active',
      joinDate: '2022-01-10',
      communityServiceHours: 245,
      phone: '(386) 555-0124',
      email: 'sarah.martinez@dbpoliceexplorers.org',
      specializations: ['Emergency Response', 'Leadership', 'Training'],
    },
    {
      id: '5',
      name: 'Michael Chen',
      rank: 'Explorer Captain',
      badgeNumber: 'EX-2022-007',
      status: 'active',
      joinDate: '2022-08-22',
      communityServiceHours: 198,
      phone: '(386) 555-0125',
      email: 'michael.chen@dbpoliceexplorers.org',
      specializations: ['Traffic Control', 'Emergency Response'],
    },
    {
      id: '6',
      name: 'Emma Thompson',
      rank: 'Explorer Sergeant',
      badgeNumber: 'EX-2023-012',
      status: 'active',
      joinDate: '2023-05-18',
      communityServiceHours: 89,
      phone: '(386) 555-0126',
      email: 'emma.thompson@dbpoliceexplorers.org',
      specializations: ['Community Outreach'],
    },
    {
      id: '7',
      name: 'David Rodriguez',
      rank: 'Explorer Corporal',
      badgeNumber: 'EX-2023-018',
      status: 'active',
      joinDate: '2023-09-12',
      communityServiceHours: 67,
      phone: '(386) 555-0127',
      email: 'david.rodriguez@dbpoliceexplorers.org',
      specializations: ['Traffic Control'],
    },
    {
      id: '8',
      name: 'Jessica Williams',
      rank: 'Explorer',
      badgeNumber: 'EX-2024-021',
      status: 'probationary',
      joinDate: '2024-01-08',
      communityServiceHours: 23,
      phone: '(386) 555-0128',
      email: 'jessica.williams@dbpoliceexplorers.org',
      specializations: [],
    },
    {
      id: '9',
      name: 'Ryan Davis',
      rank: 'Explorer',
      badgeNumber: 'EX-2024-025',
      status: 'probationary',
      joinDate: '2024-02-14',
      communityServiceHours: 15,
      phone: '(386) 555-0129',
      email: 'ryan.davis@dbpoliceexplorers.org',
      specializations: [],
    },
    {
      id: '10',
      name: 'Ashley Brown',
      rank: 'Explorer Corporal',
      badgeNumber: 'EX-2021-005',
      status: 'inactive',
      joinDate: '2021-06-30',
      communityServiceHours: 156,
      phone: '(386) 555-0130',
      email: 'ashley.brown@dbpoliceexplorers.org',
      specializations: ['Community Outreach', 'Training'],
    },
    {
      id: '11',
      name: 'James Wilson',
      rank: 'Explorer',
      badgeNumber: 'EX-2023-008',
      status: 'inactive',
      joinDate: '2023-02-28',
      communityServiceHours: 45,
      phone: '(386) 555-0131',
      email: 'james.wilson@dbpoliceexplorers.org',
      specializations: ['Traffic Control'],
    },
  ];

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'advisor': return '#000080'; // Navy blue for advisors (police officers)
      case 'explorer major': return '#8B0000'; // Dark red for highest explorer rank
      case 'explorer captain': return '#FF4500'; // Orange red
      case 'explorer lieutenant': return colors.primary; // Blue
      case 'explorer sergeant': return '#32CD32'; // Lime green
      case 'explorer corporal': return '#FFD700'; // Gold
      case 'explorer': return colors.secondary; // Default secondary color
      default: return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return colors.success;
      case 'probationary': return colors.warning;
      case 'inactive': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'checkmark.circle.fill';
      case 'probationary': return 'clock.fill';
      case 'inactive': return 'xmark.circle.fill';
      default: return 'questionmark.circle.fill';
    }
  };

  const filteredExplorers = explorers.filter(explorer => {
    const matchesSearch = explorer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         explorer.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         explorer.rank.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || explorer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getExplorersByStatus = (status: 'active' | 'probationary' | 'inactive') => {
    return filteredExplorers.filter(explorer => explorer.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const startDirectMessage = (explorer: Explorer) => {
    Alert.alert(
      'Direct Message',
      `Start a conversation with ${explorer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Message', 
          onPress: () => {
            console.log(`Starting direct message with ${explorer.name}`);
            // In a real app, this would navigate to the messages screen with a new conversation
            router.push('/(tabs)/messages');
          }
        }
      ]
    );
  };

  const callExplorer = (explorer: Explorer) => {
    Alert.alert(
      'Call Explorer',
      `Call ${explorer.name} at ${explorer.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => console.log(`Calling ${explorer.name} at ${explorer.phone}`)
        }
      ]
    );
  };

  const renderExplorer = (explorer: Explorer) => (
    <View key={explorer.id} style={[commonStyles.card, styles.explorerCard]}>
      <View style={styles.explorerHeader}>
        <View style={styles.explorerInfo}>
          <View style={styles.explorerNameRow}>
            <Text style={[styles.explorerName, { color: colors.text }]}>
              {explorer.name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(explorer.status) }]}>
              <IconSymbol 
                name={getStatusIcon(explorer.status) as any} 
                color="white" 
                size={12} 
              />
              <Text style={styles.statusText}>{explorer.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.explorerRank, { color: getRankColor(explorer.rank) }]}>
            {explorer.rank}
            {explorer.rank === 'Advisor' && (
              <Text style={[styles.advisorNote, { color: colors.textSecondary }]}>
                {' '}(Police Officer)
              </Text>
            )}
          </Text>
          <Text style={[styles.badgeNumber, { color: colors.textSecondary }]}>
            Badge #{explorer.badgeNumber}
          </Text>
        </View>
      </View>
      
      <View style={styles.explorerDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="calendar" color={colors.textSecondary} size={16} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Joined: {formatDate(explorer.joinDate)}
          </Text>
        </View>
        
        {explorer.rank !== 'Advisor' && (
          <View style={styles.detailRow}>
            <IconSymbol name="heart.fill" color={colors.success} size={16} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              Service Hours: {explorer.communityServiceHours}
            </Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <IconSymbol name="phone.fill" color={colors.textSecondary} size={16} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {explorer.phone}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <IconSymbol name="envelope.fill" color={colors.textSecondary} size={16} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
            {explorer.email}
          </Text>
        </View>
        
        {explorer.specializations.length > 0 && (
          <View style={styles.specializationsContainer}>
            <Text style={[styles.specializationsLabel, { color: colors.textSecondary }]}>
              Specializations:
            </Text>
            <View style={styles.specializationsList}>
              {explorer.specializations.map((spec, index) => (
                <View key={index} style={[styles.specializationTag, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.specializationText, { color: colors.text }]}>
                    {spec}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            onPress={() => startDirectMessage(explorer)}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <IconSymbol name="message.fill" color="white" size={16} />
            <Text style={styles.actionButtonText}>Message</Text>
          </Pressable>
          
          <Pressable
            onPress={() => callExplorer(explorer)}
            style={[styles.actionButton, { backgroundColor: colors.success }]}
          >
            <IconSymbol name="phone.fill" color="white" size={16} />
            <Text style={styles.actionButtonText}>Call</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderStatusSection = (status: 'active' | 'probationary' | 'inactive', title: string) => {
    const statusExplorers = getExplorersByStatus(status);
    
    if (statusExplorers.length === 0 && selectedStatus !== 'all') return null;
    
    return (
      <View style={styles.statusSection}>
        <View style={styles.statusHeader}>
          <IconSymbol 
            name={getStatusIcon(status) as any} 
            color={getStatusColor(status)} 
            size={24} 
          />
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            {title} ({statusExplorers.length})
          </Text>
        </View>
        {statusExplorers.map(renderExplorer)}
      </View>
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
            Explorer Roster
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            All Daytona Beach Police Explorers serving as professional public servants
          </Text>
        </View>

        {/* Search and Filter */}
        <View style={[commonStyles.card, styles.searchContainer]}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search explorers..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            {(['all', 'active', 'probationary', 'inactive'] as const).map((status) => (
              <Pressable
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedStatus === status ? colors.primary : colors.secondary,
                  }
                ]}
              >
                <Text style={[
                  styles.filterButtonText,
                  {
                    color: selectedStatus === status ? 'white' : colors.text,
                  }
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info Banner */}
        <View style={[commonStyles.card, styles.infoBanner]}>
          <IconSymbol name="info.circle.fill" color={colors.primary} size={20} />
          <Text style={[styles.infoBannerText, { color: colors.text }]}>
            Tap "Message" next to any explorer to start a direct conversation. 
            All explorers are automatically added to the main Explorer Group Chat.
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="checkmark.circle.fill" color={colors.success} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {getExplorersByStatus('active').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Active
            </Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="clock.fill" color={colors.warning} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {getExplorersByStatus('probationary').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Probationary
            </Text>
          </View>
          <View style={[commonStyles.card, styles.statCard]}>
            <IconSymbol name="xmark.circle.fill" color={colors.error} size={32} />
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {getExplorersByStatus('inactive').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Inactive
            </Text>
          </View>
        </View>

        {/* Explorer Lists */}
        {selectedStatus === 'all' ? (
          <>
            {renderStatusSection('active', 'Active Explorers')}
            {renderStatusSection('probationary', 'Probationary Explorers')}
            {renderStatusSection('inactive', 'Inactive Explorers')}
          </>
        ) : (
          <View style={styles.statusSection}>
            {filteredExplorers.map(renderExplorer)}
          </View>
        )}

        {filteredExplorers.length === 0 && (
          <View style={[commonStyles.card, styles.emptyState]}>
            <IconSymbol name="person.slash" color={colors.textSecondary} size={48} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No explorers found matching your search criteria
            </Text>
          </View>
        )}
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
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
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
  statusSection: {
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  explorerCard: {
    marginBottom: 16,
  },
  explorerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  explorerInfo: {
    flex: 1,
  },
  explorerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  explorerName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  explorerRank: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  advisorNote: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  badgeNumber: {
    fontSize: 14,
    marginBottom: 8,
  },
  explorerDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  specializationsContainer: {
    marginTop: 8,
  },
  specializationsLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  specializationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specializationTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specializationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
