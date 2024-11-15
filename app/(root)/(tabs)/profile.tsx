import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text } from "react-native";


const Profile = () => {
  const { user } = useUser();

  return (
    <Text>Hello</Text>
  );
};

export default Profile;
