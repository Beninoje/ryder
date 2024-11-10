import CustomButton from '@/components/custom-button'
import GoogleTextInput from '@/components/google-text-input'
import RideLayout from '@/components/ride-layout'
import { icons } from '@/constants'
import { useLocationStore } from '@/store'
import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const ConfirmRide = () => {
    const { 
        userAddress,
        setDestinationLocation,
        destinationAddress,
        setUserLocation,
    } = useLocationStore()
  return (
    <View>
      <Text>Confirm Ride</Text>
    </View>
  )
}

export default ConfirmRide