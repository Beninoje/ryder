import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo"; // Import from @clerk/clerk-expo for Expo support
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { ReactNativeModal } from "react-native-modal";
import { icons } from "@/constants";

const Profile = () => {
  const { user } = useUser();



  const firstInitial = user?.firstName?.charAt(0)?.toUpperCase();
  const lastInitial = user?.lastName?.charAt(0)?.toUpperCase();
  const [showImgModal, setShowImgModal] = useState(false);
  const initials = `${firstInitial}${lastInitial}`;

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

   const handleUpdateProfile = async () => {
    try {
      // Step 1: Update first name and last name
      await user?.update({
        firstName: form.firstName,
        lastName: form.lastName,
      });

      // // Step 2: Update email address directly
      // if (form.email !== user?.primaryEmailAddress?.emailAddress) {
      //   const emailAddressId = user?.primaryEmailAddress?.id;
        
      //   if (!emailAddressId) {
      //     throw new Error("No primary email address found.");
      //   }

      //   // Update the existing email address (not create a new one)
      //   const updatedEmail = await user?.updateEmailAddress(emailAddressId, {
      //     emailAddress: form.email,
      //     verified: false, // Initially unverified, so it will require verification
      //   });

      //   // Proceed with verification if email was updated
      //   if (updatedEmail) {
      //     await updatedEmail.prepareVerification({ strategy: "email_code" });
      //     setVerification({ ...verification, state: "pending" });
      //   }
      // } else {
        Alert.alert("Success", "Profile updated successfully!");
      // }
    } catch (error: any) {
      const errorMessage =
        error?.errors?.[0]?.longMessage || "Failed to update profile.";
      console.error("Profile update error:", errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  const onPressVerify = async () => {
    try {
      const emailAddress = user?.emailAddresses.find(
        (email) => email.emailAddress === form.email
      );

      if (!emailAddress) {
        throw new Error("Email address not found for verification.");
      }

      const result = await emailAddress.attemptVerification({
        code: verification.code,
      });

      if (result?.status === "verified") {
        setVerification({ ...verification, state: "success" });
        Alert.alert("Success", "Email updated and verified!");

        // // Step 3: Set the verified email as primary
        // const updateResult = await user?.update({
        //   primaryEmailAddressId: emailAddress.id,
        // });

        // if (updateResult?.primaryEmailAddressId === emailAddress.id) {
        //   console.log("Primary email updated successfully");
        // } else {
        //   throw new Error("Failed to update primary email.");
        // }
      } else {
        throw new Error("Verification failed");
      }
    } catch (error: any) {
      setVerification({
        ...verification,
        error: "Invalid verification code. Please try again.",
        state: "failed",
      });
      console.error("Verification error:", error);
    }
  };
  const handleImgUpload = () => {
    setShowImgModal(true); 

  }


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
            <TouchableOpacity 
              className="bg-slate-100 p-2 rounded-full absolute bottom-[-10px] right-3"
              onPress={handleImgUpload}
            >
              <Image source={icons.upload} className="w-6 h-6" />
            </TouchableOpacity>
            <ReactNativeModal 
              isVisible={showImgModal}
              onBackdropPress={()=>setShowImgModal(false)}
              >
              <View className="flex flex-col justify-start items-center bg-white rounded-2xl min-h-[200px] py-8 px-4">
                <Text className="font-JakartaExtraBold text-2xl mb-2">Profile Photo</Text>
                <View className="flex flex-row justify-center gap-6 w-full mt-1">
                  <TouchableOpacity className="flex flex-col py-2 px-3 justify-center items-center rounded-lg bg-gray-200">
                    <Image source={icons.camera} className="w-8 h-8 " />
                    <Text className="text-sm font-JakartaRegular">
                      Camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex flex-col py-2 px-3 justify-center items-center rounded-lg bg-gray-200">
                    <Image source={icons.gallery} className="w-8 h-8 " />
                    <Text className="text-sm font-JakartaRegular">
                      Gallery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex flex-col py-2 px-3 justify-center items-center rounded-lg bg-gray-200">
                    <Image source={icons.trash} className="w-8 h-8" />
                    <Text className="text-sm text-black font-JakartaRegular">
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ReactNativeModal>
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
        <ReactNativeModal isVisible={verification.state === "pending"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
