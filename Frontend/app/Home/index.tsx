import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AddExpense from "../../components/expenses/AddExpense";
import ExpenseList from "../../components/expenses/ExpenseList";
import { useAuth } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

export default function Home() {
  const { logout, isAuthenticated, isLoading } = useAuth();
  const [expenseListVersion, setExpenseListVersion] = useState<number>(0);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      router.replace("/Auth/Login");
    } catch (e) {
      console.error(e);
    }
  };

  const goToProfile = () => {
    router.push("/Profile");
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/Auth/Login" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Toast />
      <ExpenseList refreshKey={expenseListVersion} />
      <AddExpense
        onExpenseAdded={() => {
          setExpenseListVersion((version) => version + 1);
        }}
      />
      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={goToProfile}
      >
        <Text style={{ color: "white" }}>Profile</Text>
      </Pressable>
      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={handleLogout}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
