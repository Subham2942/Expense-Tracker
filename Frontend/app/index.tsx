import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, {useState} from "react";
import Login from "./Auth/Login";

export default function HomeScreen() {
  return (
    <SafeAreaProvider style={styles.safeArea}>
      
        <Login/>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F8FA",
    flex: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#1A1D21",
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    color: "#667085",
    fontSize: 16,
    marginTop: 10,
  },
});
