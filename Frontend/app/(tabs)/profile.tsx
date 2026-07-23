import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';

const menuItems = [
  { icon: 'person-outline', title: 'Personal information', subtitle: 'Name, email and phone' },
  { icon: 'card-outline', title: 'Payment methods', subtitle: 'Manage your cards and accounts' },
  { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Budgets, bills and reminders' },
  { icon: 'shield-checkmark-outline', title: 'Privacy & security', subtitle: 'Password and account security' },
] as const;

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: endSession } = useAuth();

  async function logout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await endSession();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}><Text style={styles.initials}>AM</Text></View>
            <Pressable accessibilityLabel="Add profile picture" style={styles.cameraButton}>
              <Ionicons color="#FFFFFF" name="camera" size={15} />
            </Pressable>
          </View>
          <Text style={styles.name}>Alex Morgan</Text>
          <Text style={styles.email}>alex@example.com</Text>
          <Pressable style={styles.editButton}>
            <Ionicons color="#176B4D" name="pencil-outline" size={15} />
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable key={item.title} style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
              <View style={styles.menuIcon}>
                <Ionicons color="#176B4D" name={item.icon} size={21} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons color="#A0AAA5" name="chevron-forward" size={19} />
              {index < menuItems.length - 1 && <View style={styles.menuSeparator} />}
            </Pressable>
          ))}
        </View>

        <Pressable disabled={isLoggingOut} onPress={logout} style={styles.logoutButton}>
          {isLoggingOut ? (
            <ActivityIndicator color="#B54747" />
          ) : (
            <>
              <Ionicons color="#B54747" name="log-out-outline" size={20} />
              <Text style={styles.logoutText}>Log out</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.version}>Pennywise · Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F6', flex: 1 },
  content: { padding: 20, paddingBottom: 45 },
  heading: { color: '#14251E', fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginBottom: 22 },
  profileCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E7ECE8', borderRadius: 24, borderWidth: 1, padding: 25 },
  avatarWrap: { marginBottom: 14 },
  avatar: { alignItems: 'center', backgroundColor: '#D9ECE3', borderRadius: 48, height: 94, justifyContent: 'center', width: 94 },
  initials: { color: '#176B4D', fontSize: 29, fontWeight: '800' },
  cameraButton: { alignItems: 'center', backgroundColor: '#176B4D', borderColor: '#FFFFFF', borderRadius: 17, borderWidth: 3, bottom: -1, height: 34, justifyContent: 'center', position: 'absolute', right: -1, width: 34 },
  name: { color: '#1B3027', fontSize: 21, fontWeight: '800' },
  email: { color: '#89948F', fontSize: 13, marginTop: 5 },
  editButton: { alignItems: 'center', backgroundColor: '#EDF6F1', borderRadius: 18, flexDirection: 'row', gap: 6, marginTop: 17, paddingHorizontal: 15, paddingVertical: 9 },
  editText: { color: '#176B4D', fontSize: 13, fontWeight: '800' },
  sectionLabel: { color: '#89948F', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginLeft: 3, marginTop: 28 },
  menuCard: { backgroundColor: '#FFFFFF', borderColor: '#E7ECE8', borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  menuItem: { alignItems: 'center', flexDirection: 'row', minHeight: 73, paddingHorizontal: 16 },
  pressed: { backgroundColor: '#F5F8F6' },
  menuIcon: { alignItems: 'center', backgroundColor: '#EDF6F1', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
  menuText: { flex: 1, marginHorizontal: 13 },
  menuTitle: { color: '#283B33', fontSize: 14, fontWeight: '700' },
  menuSubtitle: { color: '#929C97', fontSize: 11, marginTop: 4 },
  menuSeparator: { backgroundColor: '#EBEFEC', bottom: 0, height: StyleSheet.hairlineWidth, left: 69, position: 'absolute', right: 0 },
  logoutButton: { alignItems: 'center', backgroundColor: '#FDEEEE', borderRadius: 15, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 22, paddingVertical: 15 },
  logoutText: { color: '#B54747', fontSize: 14, fontWeight: '800' },
  version: { color: '#A0AAA5', fontSize: 11, marginTop: 18, textAlign: 'center' },
});
