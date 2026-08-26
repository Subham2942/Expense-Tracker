import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, isAuthenticated } = useAuth();

  const goToSignup = () => {
    router.replace("/Auth/Signup");
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/Home");
    }
  }, [isLoading, isAuthenticated]);

  const handleManualLogin = async () => {
    const success = await login(userName, password);
    if (success) {
      Toast.show({
        type: "success",
        text1: "Login successful!",
      });
    } else {
      console.log("Login failed. Please check your credentials.");
      Toast.show({
        type: "error",
        text1: "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>LOGIN PAGE</Text>

      <TextInput
        placeholder="User Name"
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />
      <TextInput
        autoComplete="password"
        placeholder="Password"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={handleManualLogin}
      >
        <Text style={{ color: "white" }}>Login</Text>
      </Pressable>
      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={goToSignup}
      >
        <Text style={{ color: "white" }}>Go to Signup</Text>
      </Pressable>

      <Toast />
    </View>
  );
}
