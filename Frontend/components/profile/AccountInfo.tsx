import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

const AccountInfo = () => {
  const { user } = useAuth();

  if (!user) {
    return <Text>User information unavailable</Text>;
  }

  console.log(user);

  return (
    <View>
      <Text>
       Name: {user.first_name} {user.last_name}
      </Text>
      <Text>Email: {user.email}</Text>
      <Text>Phone: {user.phone_number ?? "Not provided"}</Text>
    </View>
  );
};

export default AccountInfo;