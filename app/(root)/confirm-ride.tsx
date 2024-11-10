import CustomButton from '@/components/custom-button'
import DriverCard from '@/components/driver-card'
import GoogleTextInput from '@/components/google-text-input'
import RideLayout from '@/components/ride-layout'
import { icons } from '@/constants'
import { useDriverStore, useLocationStore } from '@/store'
import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const ConfirmRide = () => {
    const {
      drivers,
      selectedDriver, 
      setSelectedDriver 
    } = useDriverStore();
    
  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id!))}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  )
}

export default ConfirmRide