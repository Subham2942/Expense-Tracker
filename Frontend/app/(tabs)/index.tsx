import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Period = 'Week' | 'Month' | 'All';

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
};

const expenses: Expense[] = [
  {
    id: '1',
    title: 'Fresh Basket',
    category: 'Groceries',
    amount: 1240,
    date: 'Today, 10:24 AM',
    icon: 'basket-outline',
    color: '#C66A21',
    background: '#FFF1E6',
  },
  {
    id: '2',
    title: 'Uber',
    category: 'Transport',
    amount: 386,
    date: 'Today, 8:10 AM',
    icon: 'car-outline',
    color: '#3166B5',
    background: '#EAF2FF',
  },
  {
    id: '3',
    title: 'Netflix',
    category: 'Entertainment',
    amount: 649,
    date: 'Yesterday',
    icon: 'film-outline',
    color: '#B33C4B',
    background: '#FDECEF',
  },
  {
    id: '4',
    title: 'Green Leaf Cafe',
    category: 'Food & dining',
    amount: 540,
    date: '18 Jul, 7:42 PM',
    icon: 'cafe-outline',
    color: '#6A4DA0',
    background: '#F1EBFC',
  },
  {
    id: '5',
    title: 'Electricity bill',
    category: 'Utilities',
    amount: 1875,
    date: '16 Jul',
    icon: 'flash-outline',
    color: '#8A7117',
    background: '#FFF8D9',
  },
];

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function HomeScreen() {
  const [period, setPeriod] = useState<Period>('Month');
  const total = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={expenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.eyebrow}>GOOD MORNING</Text>
                <Text style={styles.greeting}>Hi, Alex</Text>
              </View>
              <Pressable accessibilityLabel="Notifications" style={styles.iconButton}>
                <Ionicons color="#34473F" name="notifications-outline" size={23} />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>

            <View style={styles.totalCard}>
              <View style={styles.cardGlow} />
              <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
              <Text style={styles.totalValue}>{currency.format(total)}</Text>
              <View style={styles.changeRow}>
                <View style={styles.changeBadge}>
                  <Ionicons color="#D7F6E7" name="trending-down" size={15} />
                  <Text style={styles.changeText}>8.4%</Text>
                </View>
                <Text style={styles.comparison}>less than last month</Text>
              </View>
            </View>

            <View style={styles.periodRow}>
              {(['Week', 'Month', 'All'] as Period[]).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setPeriod(item)}
                  style={[styles.periodButton, period === item && styles.activePeriodButton]}>
                  <Text style={[styles.periodText, period === item && styles.activePeriodText]}>
                    {item === 'All' ? 'All time' : `This ${item.toLowerCase()}`}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent expenses</Text>
              <Text style={styles.count}>{expenses.length} transactions</Text>
            </View>
          </>
        }
        renderItem={({ item }) => <ExpenseRow expense={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      <Pressable accessibilityLabel="Add expense" style={styles.addButton}>
        <Ionicons color="#FFFFFF" name="add" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

function ExpenseRow({ expense }: { expense: Expense }) {
  return (
    <Pressable style={({ pressed }) => [styles.expenseRow, pressed && styles.rowPressed]}>
      <View style={[styles.categoryIcon, { backgroundColor: expense.background }]}>
        <Ionicons color={expense.color} name={expense.icon} size={22} />
      </View>
      <View style={styles.expenseDetails}>
        <Text numberOfLines={1} style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseMeta}>{expense.category} · {expense.date}</Text>
      </View>
      <Text style={styles.amount}>−{currency.format(expense.amount)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F6F8F6', flex: 1 },
  content: { paddingBottom: 110, paddingHorizontal: 20 },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 22 },
  eyebrow: { color: '#89948F', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  greeting: { color: '#14251E', fontSize: 26, fontWeight: '800', letterSpacing: -0.7, marginTop: 3 },
  iconButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, height: 48, justifyContent: 'center', width: 48 },
  notificationDot: { backgroundColor: '#E6784F', borderColor: '#FFFFFF', borderRadius: 5, borderWidth: 2, height: 9, position: 'absolute', right: 12, top: 11, width: 9 },
  totalCard: { backgroundColor: '#176B4D', borderRadius: 25, marginBottom: 18, overflow: 'hidden', padding: 24 },
  cardGlow: { backgroundColor: '#3C8C6D', borderRadius: 100, height: 150, opacity: 0.55, position: 'absolute', right: -42, top: -65, width: 150 },
  totalLabel: { color: '#BDE2D1', fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  totalValue: { color: '#FFFFFF', fontSize: 37, fontWeight: '800', letterSpacing: -1.3, marginTop: 9 },
  changeRow: { alignItems: 'center', flexDirection: 'row', marginTop: 18 },
  changeBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, flexDirection: 'row', gap: 4, paddingHorizontal: 9, paddingVertical: 5 },
  changeText: { color: '#E2F7ED', fontSize: 12, fontWeight: '800' },
  comparison: { color: '#BDE2D1', fontSize: 12, marginLeft: 8 },
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 27 },
  periodButton: { backgroundColor: '#EAEFEC', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 },
  activePeriodButton: { backgroundColor: '#D9ECE3' },
  periodText: { color: '#718078', fontSize: 12, fontWeight: '700' },
  activePeriodText: { color: '#176B4D' },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { color: '#14251E', fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  count: { color: '#89948F', fontSize: 12 },
  expenseRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 13 },
  rowPressed: { opacity: 0.65 },
  categoryIcon: { alignItems: 'center', borderRadius: 15, height: 48, justifyContent: 'center', width: 48 },
  expenseDetails: { flex: 1, marginHorizontal: 13 },
  expenseTitle: { color: '#253A31', fontSize: 15, fontWeight: '700' },
  expenseMeta: { color: '#8A9690', fontSize: 11, marginTop: 5 },
  amount: { color: '#24362F', fontSize: 14, fontWeight: '800' },
  separator: { backgroundColor: '#E8EDE9', height: StyleSheet.hairlineWidth, marginLeft: 61 },
  addButton: { alignItems: 'center', backgroundColor: '#176B4D', borderRadius: 29, bottom: 22, height: 58, justifyContent: 'center', position: 'absolute', right: 22, shadowColor: '#176B4D', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 12, width: 58 },
});
