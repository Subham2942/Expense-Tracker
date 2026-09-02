import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import type { Expense } from "../../constants/types/ExpenseTypes";
import { deleteExpense, fetchExpense } from "../../services/useExpense";

type ExpenseListProps = {
  refreshKey?: number;
};

const ExpenseList = ({ refreshKey = 0 }: ExpenseListProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (externalId: string) => {
    setDeletingId(externalId);
    setDeleteError("");

    try {
      const deleted = await deleteExpense(externalId);

      if (!deleted) {
        setDeleteError("The expense could not be deleted");
        return;
      }

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.external_id !== externalId),
      );
    } catch (error) {
      console.error("Failed to delete expense", error);
      setDeleteError("Unable to delete the expense. Please try again");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (expense: Expense) => {
    Alert.alert(
      "Delete expense",
      `Delete ${expense.merchant ?? "this expense"} for ${expense.amount}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void handleDelete(expense.external_id),
        },
      ],
    );
  };

  useEffect(() => {
    const getExpenseList = async () => {
      try {
        const response = await fetchExpense();
        setExpenses(response);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    };

    void getExpenseList();
  }, [refreshKey]);

  return (
    <View style={{ overflowY: "scroll" }}>
      <Text>ExpenseList</Text>

      {deleteError ? (
        <Text accessibilityRole="alert" style={{ color: "red" }}>
          {deleteError}
        </Text>
      ) : null}

      {expenses.length > 0 ? (
        expenses.map((item) => (
          <View
            key={item.external_id}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <Text>{item.amount}</Text>
            <Text>{item.merchant ?? "Other"}</Text>
            <Pressable
              accessibilityRole="button"
              disabled={deletingId === item.external_id}
              onPress={() => confirmDelete(item)}
              style={{ backgroundColor: "#b91c1c", padding: 6 }}
            >
              <Text style={{ color: "white" }}>
                {deletingId === item.external_id ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text> No expenses recorded yet </Text>
      )}
    </View>
  );
};

export default ExpenseList;
