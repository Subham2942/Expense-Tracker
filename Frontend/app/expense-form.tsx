import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { SessionExpiredError } from '@/services/api-client';
import { addExpense, updateExpense } from '@/services/expense-api';

export default function ExpenseFormScreen() {
  const params = useLocalSearchParams<{
    externalId?: string;
    amount?: string;
    merchant?: string;
    currency?: string;
  }>();
  const isEditing = Boolean(params.externalId);
  const [amount, setAmount] = useState(params.amount ?? '');
  const [merchant, setMerchant] = useState(params.merchant ?? '');
  const [currency, setCurrency] = useState(params.currency ?? 'INR');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { expireSession } = useAuth();

  async function save() {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const input = {
        amount: numericAmount,
        merchant: merchant.trim() || undefined,
        currency: currency.trim().toUpperCase() || 'INR',
      };

      if (isEditing && params.externalId) {
        await updateExpense({ ...input, external_id: params.externalId });
      } else {
        await addExpense(input);
      }
      router.back();
    } catch (requestError) {
      if (requestError instanceof SessionExpiredError) {
        await expireSession();
        return;
      }
      setError(requestError instanceof Error ? requestError.message : 'Unable to save expense.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
              <Ionicons color="#263A31" name="arrow-back" size={22} />
            </Pressable>
            <Text style={styles.title}>{isEditing ? 'Update expense' : 'Add expense'}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              autoFocus
              keyboardType="decimal-pad"
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#98A29D"
              style={styles.input}
              value={amount}
            />

            <Text style={styles.label}>Merchant</Text>
            <TextInput
              onChangeText={setMerchant}
              placeholder="Optional"
              placeholderTextColor="#98A29D"
              style={styles.input}
              value={merchant}
            />

            <Text style={styles.label}>Currency</Text>
            <TextInput
              autoCapitalize="characters"
              maxLength={3}
              onChangeText={setCurrency}
              placeholder="INR"
              placeholderTextColor="#98A29D"
              style={styles.input}
              value={currency}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable disabled={isSaving} onPress={save} style={styles.saveButton}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>{isEditing ? 'Update expense' : 'Add expense'}</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F6', flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 24 },
  backButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, height: 44, justifyContent: 'center', width: 44 },
  title: { color: '#14251E', fontSize: 26, fontWeight: '800', letterSpacing: -0.6 },
  form: { backgroundColor: '#FFFFFF', borderColor: '#E7ECE8', borderRadius: 22, borderWidth: 1, padding: 20 },
  label: { color: '#34473F', fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 14 },
  input: { backgroundColor: '#F9FBF9', borderColor: '#DCE4DF', borderRadius: 12, borderWidth: 1, color: '#14251E', fontSize: 16, minHeight: 50, paddingHorizontal: 14 },
  error: { color: '#B54747', fontSize: 13, lineHeight: 18, marginTop: 16 },
  saveButton: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 13, justifyContent: 'center', marginTop: 24, minHeight: 52 },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
