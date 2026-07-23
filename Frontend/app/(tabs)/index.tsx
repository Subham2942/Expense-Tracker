import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Expenses</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
          <Text style={styles.totalValue}>{currency.format(0)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent expenses</Text>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons color="#176B4D" name="receipt-outline" size={32} />
          </View>
          <Text style={styles.emptyTitle}>No expenses yet</Text>
          <Text style={styles.emptyMessage}>
            Your expenses will appear here after you add the first one.
          </Text>
        </View>
      </ScrollView>

      <Pressable accessibilityLabel="Add expense" style={styles.addButton}>
        <Ionicons color="#FFFFFF" name="add" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F6F8F6',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
  title: {
    color: '#14251E',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 22,
  },
  totalCard: {
    backgroundColor: '#176B4D',
    borderRadius: 24,
    padding: 24,
  },
  totalLabel: {
    color: '#BDE2D1',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#14251E',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 30,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7ECE8',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    padding: 32,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#EDF6F1',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  emptyTitle: {
    color: '#263A31',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 16,
  },
  emptyMessage: {
    color: '#89948F',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 270,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#176B4D',
    borderRadius: 29,
    bottom: 22,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: 22,
    shadowColor: '#176B4D',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    width: 58,
  },
});
