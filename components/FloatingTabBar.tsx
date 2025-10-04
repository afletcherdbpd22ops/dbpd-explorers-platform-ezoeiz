
import { BlurView } from 'expo-blur';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const activeIndex = useSharedValue(0);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  // Find current active tab index
  React.useEffect(() => {
    const currentIndex = tabs.findIndex(tab => {
      if (pathname === '/' || pathname === '') {
        return tab.route === '/(tabs)/(home)/';
      }
      return pathname.includes(tab.name);
    });
    if (currentIndex !== -1) {
      activeIndex.value = withSpring(currentIndex);
    }
  }, [pathname, tabs]);

  const handleTabPress = (route: string, index: number) => {
    activeIndex.value = withSpring(index);
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    const translateX = interpolate(
      activeIndex.value,
      tabs.map((_, i) => i),
      tabs.map((_, i) => i * tabWidth)
    );

    return {
      transform: [{ translateX }],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView style={[styles.safeArea, { bottom: bottomMargin }]} edges={['bottom']}>
      <View style={[styles.container, { width: containerWidth, borderRadius }]}>
        <BlurView intensity={80} style={[styles.blurContainer, { borderRadius }]}>
          {/* Active tab indicator */}
          <Animated.View
            style={[
              styles.activeIndicator,
              animatedStyle,
              { 
                backgroundColor: colors.primary,
                borderRadius: borderRadius - 8,
              }
            ]}
          />
          
          {/* Tab buttons */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.name) || 
                (pathname === '/' && tab.route === '/(tabs)/(home)/');
              
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route, index)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon as any}
                    size={24}
                    color={isActive ? colors.card : colors.text}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isActive ? colors.card : colors.text,
                        fontWeight: isActive ? '600' : '400',
                      }
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  container: {
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.9)',
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    marginHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
