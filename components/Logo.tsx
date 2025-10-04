
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface LogoProps {
  size?: number;
  color?: string;
}

export default function Logo({ size = 24, color = colors.primary }: LogoProps) {
  return (
    <View style={[styles.logoContainer, { width: size, height: size }]}>
      <IconSymbol 
        name="shield.fill" 
        size={size} 
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
