import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-expo"; // Import from @clerk/clerk-expo for Expo support
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

const Profile = () => {
  const { user } = useUser();
  const firstInitial = user?.firstName?.charAt(0)?.toUpperCase();
  const lastInitial = user?.lastName?.charAt(0)?.toUpperCase();
  const initials = `${firstInitial}${lastInitial}`;

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    password: "",
  });

  const handleUpdateProfile = async () => {
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const response = await fetch("/(api)/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || null,
          email: form.email || null,
          clerkId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error occurred");
      }


      // Now update the Clerk user object
      const result = await user?.update({
        firstName: form.firstName,
        lastName: form.lastName,
      });
      

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error:any) {
      const errorMessage = error?.errors[0]?.longMessage || "Failed to update profile.";
      console.error("Profile update error:", errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="mb-10">
        <Text className="text-2xl font-JakartaBold">Your Profile</Text>
        <View className="w-full flex justify-center items-center my-5">
          <View className="relative">
            {user?.imageUrl ? (
              <View className="w-full justify-center flex items-center">
                <Image
                  source={{ uri: user.imageUrl }}
                  alt="Profile"
                  className="w-36 h-36 rounded-full border-4 border-gray-300"
                />
              </View>
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#d1d5db",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#4b5563",
                  }}
                >
                  {initials}
                </Text>
              </View>
            )}
            <TouchableOpacity className="bg-slate-100 p-2 rounded-full absolute bottom-[-10px] right-3">
              <Image source={icons.upload} className="w-6 h-6" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-2">
          <InputField
            label="First name"
            placeholder={user?.firstName}
            value={form.firstName}
            onChangeText={(value) => setForm({ ...form, firstName: value })}
          />
          <InputField
            label="Last name"
            placeholder={user?.lastName}
            value={form.lastName}
            onChangeText={(value) => setForm({ ...form, lastName: value })}
          />
          <InputField
            label="Email"
            placeholder={user?.primaryEmailAddress?.emailAddress}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Update Profile"
            onPress={handleUpdateProfile}
            className="mt-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
