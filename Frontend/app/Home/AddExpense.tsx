import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addExpense } from "../services/useExpense";

type AddExpenseProps = {
  onExpenseAdded?: () => void | Promise<void>;
};

const AddExpense = ({ onExpenseAdded }: AddExpenseProps) => {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddExpense = async () => {
    setError("");
    setSuccessMessage("");

    const parsedAmount = Number(amount.trim());

    if (!amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await addExpense({
        amount: parsedAmount,
        ...(merchant.trim() ? { merchant: merchant.trim() } : {}),
      });

      if (!created) {
        setError("The expense could not be added");
        return;
      }

      setAmount("");
      setMerchant("");
      setSuccessMessage("Expense added successfully");
      await onExpenseAdded?.();
    } catch (requestError) {
      console.error("Failed to add expense", requestError);
      setError("Unable to add the expense. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add expense</Text>

      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="decimal-pad"
        editable={!isSubmitting}
        style={styles.input}
      />

      <TextInput
        value={merchant}
        onChangeText={setMerchant}
        placeholder="Merchant (optional)"
        editable={!isSubmitting}
        style={styles.input}
      />

      {error ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      {successMessage ? (
        <Text accessibilityRole="alert" style={styles.successText}>
          {successMessage}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={handleAddExpense}
        style={({ pressed }) => [
          styles.button,
          (pressed || isSubmitting) && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 420,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: "#b91c1c",
  },
  successText: {
    color: "#15803d",
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#374151",
    padding: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default AddExpense;
