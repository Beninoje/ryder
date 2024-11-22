import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo"; // Import from @clerk/clerk-expo for Expo support
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { ReactNativeModal } from "react-native-modal";
import { icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { addDoc, collection, onSnapshot } from "firebase/firestore"
import { db, storage } from "@/firebaseConfig";
const Profile = () => {
  const { user } = useUser();
  console.log(user)
  const firstInitial = user?.firstName?.charAt(0)?.toUpperCase();
  const lastInitial = user?.lastName?.charAt(0)?.toUpperCase();
  const [showImgModal, setShowImgModal] = useState(false);
  const initials = `${firstInitial}${lastInitial}`;
  const [saveImage, setSaveImage] = useState("");
  const [progressUpload, setProgressUpload] = useState(0)

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


        Alert.alert("Success", "Profile updated successfully!");
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
  const saveProfileImage = async (image:string) => {
    try {
      
      setSaveImage(image);
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, `ProfileImages/${new Date().getTime()}`);

    // Start the upload process
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed(2)}% done`);
        setProgressUpload(Number(progress.toFixed(2)));
      },
      (error) => {
        console.error("Upload error:", error);
        Alert.alert("Error", "Failed to upload image");
      },
      async () => {
        // Get the download URL once the upload completes
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at:", downloadURL);

        // Optionally save the URL in state or database
        setSaveImage(downloadURL);
        saveImgToFirebase(downloadURL);

        if (user) {
            await user.update({
            unsafeMetadata: {
              imageUrl: downloadURL,
            },
          });
          console.log("Clerk profile image updated.");
        }

        Alert.alert("Success", "Image uploaded successfully!");
      }
    );
    setShowImgModal(false); // Close the modal
  }
  catch (error) {
    console.error("Save image error:", error);
    Alert.alert("Error", "Failed to save profile image.");
  }
}

  const handleImgUpload = async (mode:string) => {
    try {
    let result: ImagePicker.ImagePickerResult;

    if (mode === "gallery") {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Permission to access the gallery is required.");
      }

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      // Request permissions for the camera
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Permission to access the camera is required.");
      }

      // Launch the camera
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        await saveProfileImage(result.assets[0].uri); 

      } else {
        console.log("Image selection was canceled.");
      }
    }

    // Check if the user canceled the selection
    if (!result.canceled) {
      // Save the selected image
      await saveProfileImage(result.assets[0].uri);
    } else {
      console.log("Image selection was canceled.");
    }
  } catch (error: any) {
    Alert.alert("Error uploading profile image", error.message);
    console.error("Error:", error);
    setShowImgModal(false);
  }

}
const saveImgToFirebase = async (url:string) => {
  try {
    const docRef = await addDoc(collection(db,"files"),{
      url,
    })
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.log(error)
  }
}

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="mb-10">
        <Text className="text-2xl font-JakartaBold">Your Profile</Text>
        <View className="w-full flex justify-center items-center my-5">
          <View className="relative">
            {saveImage ? (
  <Image
    source={{ uri: saveImage }} // Pass the locally saved image URL here
    alt="Profile"
    className="w-36 h-36 rounded-full border-4 border-gray-300"
  />
) : user?.unsafeMetadata?.imageUrl ? (
  <Image
    source={{ uri: user.unsafeMetadata.imageUrl }} // Use the updated image from unsafeMetadata
    alt="Profile"
    className="w-36 h-36 rounded-full border-4 border-gray-300"
  />
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
              onPress={() => setShowImgModal(true)}
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
                  <TouchableOpacity 
                    className="flex flex-col py-2 px-3 justify-center items-center rounded-lg bg-gray-200"
                    onPress={() => handleImgUpload}
                    >
                    <Image source={icons.camera} className="w-8 h-8 " />
                    <Text className="text-sm font-JakartaRegular">
                      Camera
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex flex-col py-2 px-3 justify-center items-center rounded-lg bg-gray-200"
                    onPress={() => handleImgUpload("gallery")}
                  >
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

