import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { signUp } from "../../services/authService";
import Toast from "react-native-toast-message";
import {router} from "expo-router"

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const goToLoginWithoutValidation = () => {
    router.replace("/Auth/Login");
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const success = await signUp(
      firstName,
      lastName,
      userName,
      password,
      email,
      parseInt(phoneNumber),
    );
    if (success) {
      Toast.show({
        type: "success",
        text1: "Sign up successful",
        text2: "Logging in"
      })
      router.replace("/Home");
    } else {
      Toast.show({
        type: "error",
        text1: "Signup failed.",
        text2: "Please try again after some time."
      })
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Toast/>
      <Text>SIGNUP PAGE</Text>

      <TextInput
        placeholder="First Name"
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />

      <TextInput
        placeholder="Last Name"
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />

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
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Phone Number"
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
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
      <TextInput
        autoComplete="password"
        placeholder="Confirm Password"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 10,
          margin: 10,
          width: "80%",
        }}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={handleSignup}
      >
        <Text style={{ color: "white" }}>Signup</Text>
      </Pressable>

      <Pressable
        style={{ backgroundColor: "grey", padding: 10, margin: 10 }}
        onPress={goToLoginWithoutValidation}
      >
        <Text style={{ color: "white" }}>Go to Login</Text>
      </Pressable>
    </View>
  );
}
