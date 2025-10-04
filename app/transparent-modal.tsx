
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { GlassView } from 'expo-glass-effect';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function TransparentModal() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <GlassView style={styles.modal} glassEffectStyle="regular">
        <Text style={[commonStyles.title, { color: colors.text, marginBottom: 20 }]}>
          Transparent Modal
        </Text>
        <Text style={[commonStyles.text, { color: colors.textSecondary, textAlign: 'center', marginBottom: 30 }]}>
          This is a transparent modal that allows the background to show through with a blur effect.
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Close</Text>
        </Pressable>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
