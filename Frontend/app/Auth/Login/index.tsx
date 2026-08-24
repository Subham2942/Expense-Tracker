import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  LoginUser,
  getCurrentUserId,
  refreshToken,
} from "../../services/authService";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const goToSignup = () => {
    router.replace("/Auth/Signup");
  };

  useEffect(() => {
    const handleLogin = async () => {
      const user = await getCurrentUserId();

      if (user) {
        router.replace("/Home");
      } else {
        const refresh = await refreshToken();
        if (refresh) router.replace("/Home");
      }
    };

    handleLogin();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleManualLogin = async () => {
    const success = await LoginUser(userName, password);
    if (success) {
      Toast.show({
        type: "success",
        text1: "Login successful!",
      });
      router.replace("/Home");
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
