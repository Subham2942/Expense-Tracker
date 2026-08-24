import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { logoutUser } from "../services/authService";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import {router} from "expo-router";

export default function Home() {
  const [expenseListVersion, setExpenseListVersion] = useState(0);

  const handleLogout = () =>{
    try{
      logoutUser();
      router.replace("/Auth/Login");
    }catch(e){
      console.error(e);
    }

  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
