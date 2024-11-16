import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useUser();

    const firstInitial = user?.firstName.charAt(0)?.toUpperCase()
    const lastInitial = user?.lastName?.charAt(0)?.toUpperCase() 
    const initals = `${firstInitial}${lastInitial}`;


  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-JakartaBold">Your Profile</Text>
        <View className="w-full flex justify-center items-center my-5">
          {user?.imageUrl ? (
            <View
              style={{
                borderRadius: 50,
                overflow: "hidden",
              }}
            >
              <Image
                source={{uri: user.imageUrl}}
                alt="Profile"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#d1d5db", // Gray background
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  color: "#4b5563", // Darker gray text
                }}
              >
                {initals}
              </Text>
            </View>
          )}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
