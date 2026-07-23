import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons color="#176B4D" name="person-outline" size={38} />
          </View>
          <Text style={styles.emptyTitle}>No profile details yet</Text>
          <Text style={styles.emptyMessage}>
            Profile information and a photo can be added when the user API is connected.
          </Text>
        </View>

        <Pressable
          disabled={isLoggingOut}
          onPress={handleLogout}
          style={styles.logoutButton}>
          {isLoggingOut ? (
            <ActivityIndicator color="#B54747" />
          ) : (
            <>
              <Ionicons color="#B54747" name="log-out-outline" size={20} />
              <Text style={styles.logoutText}>Log out</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F6F8F6',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#14251E',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 22,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7ECE8',
    borderRadius: 24,
    borderWidth: 1,
    padding: 30,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#D9ECE3',
    borderRadius: 48,
    height: 94,
    justifyContent: 'center',
    width: 94,
  },
  emptyTitle: {
    color: '#263A31',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 18,
  },
  emptyMessage: {
    color: '#89948F',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 280,
    textAlign: 'center',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FDEEEE',
    borderRadius: 15,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
  },
  logoutText: {
    color: '#B54747',
    fontSize: 14,
    fontWeight: '800',
  },
});
