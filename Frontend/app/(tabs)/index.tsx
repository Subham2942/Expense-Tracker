import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { SessionExpiredError } from '@/services/api-client';
import { Expense, getExpenses } from '@/services/expense-api';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { expireSession } = useAuth();

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses]
  );

  const loadExpenses = useCallback(async () => {
    try {
      setError(null);
      const result = await getExpenses();
      setExpenses(result);
    } catch (requestError) {
      if (requestError instanceof SessionExpiredError) {
        await expireSession();
        return;
      }
      setError(requestError instanceof Error ? requestError.message : 'Unable to load expenses.');
    } finally {
      setIsLoading(false);
    }
  }, [expireSession]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadExpenses();
    }, [loadExpenses])
  );

  function openExpenseForm(expense?: Expense) {
    router.push({
      pathname: '/expense-form',
      params: expense
        ? {
            externalId: expense.external_id,
            amount: String(expense.amount),
            merchant: expense.merchant ?? '',
            currency: expense.currency,
          }
        : {},
    });
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={expenses}
        keyExtractor={(item) => item.external_id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Expenses</Text>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
              <Text style={styles.totalValue}>{currency.format(total)}</Text>
            </View>
            <Text style={styles.sectionTitle}>Recent expenses</Text>
            {error && (
              <Pressable onPress={loadExpenses} style={styles.errorBox}>
                <Text style={styles.errorText}>{error} Tap to retry.</Text>
              </Pressable>
            )}
            {isLoading && (
              <ActivityIndicator color="#176B4D" size="large" style={styles.loader} />
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading && !error ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons color="#176B4D" name="receipt-outline" size={32} />
              </View>
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptyMessage}>
                Your expenses will appear here after you add the first one.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openExpenseForm(item)} style={styles.expenseRow}>
            <View style={styles.expenseIcon}>
              <Ionicons color="#176B4D" name="receipt-outline" size={21} />
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.merchant}>{item.merchant || 'Expense'}</Text>
              <Text style={styles.expenseDate}>{formatDate(item.created_at)}</Text>
            </View>
            <Text style={styles.amount}>−{currency.format(Number(item.amount))}</Text>
            <Ionicons color="#98A29D" name="chevron-forward" size={18} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityLabel="Add expense"
        onPress={() => openExpenseForm()}
        style={styles.addButton}>
        <Ionicons color="#FFFFFF" name="add" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F6', flex: 1 },
  content: { padding: 20, paddingBottom: 110 },
  title: { color: '#14251E', fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginBottom: 22 },
  totalCard: { backgroundColor: '#176B4D', borderRadius: 24, padding: 24 },
  totalLabel: { color: '#BDE2D1', fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  totalValue: { color: '#FFFFFF', fontSize: 38, fontWeight: '800', letterSpacing: -1.2, marginTop: 10 },
  sectionTitle: { color: '#14251E', fontSize: 20, fontWeight: '800', marginBottom: 10, marginTop: 30 },
  loader: { marginTop: 35 },
  errorBox: { backgroundColor: '#FDEEEE', borderRadius: 12, marginTop: 4, padding: 13 },
  errorText: { color: '#9E3F3F', fontSize: 13, lineHeight: 18 },
  emptyState: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E7ECE8', borderRadius: 20, borderWidth: 1, marginTop: 2, padding: 32 },
  emptyIcon: { alignItems: 'center', backgroundColor: '#EDF6F1', borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  emptyTitle: { color: '#263A31', fontSize: 17, fontWeight: '800', marginTop: 16 },
  emptyMessage: { color: '#89948F', fontSize: 13, lineHeight: 20, marginTop: 7, maxWidth: 270, textAlign: 'center' },
  expenseRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 13 },
  expenseIcon: { alignItems: 'center', backgroundColor: '#EDF6F1', borderRadius: 13, height: 44, justifyContent: 'center', width: 44 },
  expenseDetails: { flex: 1, marginHorizontal: 12 },
  merchant: { color: '#263A31', fontSize: 15, fontWeight: '700' },
  expenseDate: { color: '#89948F', fontSize: 12, marginTop: 4 },
  amount: { color: '#263A31', fontSize: 14, fontWeight: '800', marginRight: 6 },
  separator: { backgroundColor: '#E7ECE8', height: StyleSheet.hairlineWidth, marginLeft: 56 },
  addButton: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 29, bottom: 22, height: 58, justifyContent: 'center', position: 'absolute', right: 22, shadowColor: '#176B4D', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 12, width: 58 },
});
