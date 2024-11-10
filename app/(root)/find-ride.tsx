import CustomButton from '@/components/custom-button'
import GoogleTextInput from '@/components/google-text-input'
import RideLayout from '@/components/ride-layout'
import { icons } from '@/constants'
import { useLocationStore } from '@/store'
import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const FindRide = () => {
    const { 
        userAddress,
        setDestinationLocation,
        destinationAddress,
        setUserLocation,
    } = useLocationStore()
  return (
    <RideLayout title="Ride" snapPoints={["45%"]}>
       <View className='my-3'>
        <Text className='text-lg font-JakartaSemiBold mb-3'>From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
       </View>
       <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location)=>setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />
    </RideLayout>
  )
}

export default FindRide