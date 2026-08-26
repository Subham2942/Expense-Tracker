import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AddExpense from "../../components/expenses/AddExpense";
import ExpenseList from "../../components/expenses/ExpenseList";
import { useAuth } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

export default function Home() {
  const {logout, isAuthenticated, isLoading} = useAuth();
  const [expenseListVersion, setExpenseListVersion] = useState<number>(0);

  const handleLogout = async () : Promise<void> => {
    try {
      await logout();
      router.replace("/Auth/Login");
    } catch (e) {
      console.error(e);
    }
  };

  if(isLoading)
  {
    return <View>... Loading</View>
  }

  if(!isAuthenticated)
  {
    Toast.show({
      type: "error",
      text1: "Your session expired.",
      text2: "You need to login again"
    })

    return <Redirect href="/Auth/Login"/>
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Toast/>
      <ExpenseList refreshKey={expenseListVersion} />
      <AddExpense
        onExpenseAdded={() => {
          setExpenseListVersion((version) => version + 1);
        }}
      />
      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={handleLogout}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
