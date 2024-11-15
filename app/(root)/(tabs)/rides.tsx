import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";
import React from "react";

const Rides = () => {
  const { user } = useUser();

  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>Hello</Text>
    </SafeAreaView>
  );
};

export default Rides;
