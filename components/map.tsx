import { useFetch } from '@/actions/fetch'
import { icons } from '@/constants'
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from '@/lib/map'
import { useDriverStore, useLocationStore } from '@/store'
import { Driver, MarkerData } from '@/types'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
const Map = () => {
  const {data:drivers, loading,error} = useFetch<Driver[]>("/(api)/driver")
  const { 
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
    const region = calculateRegion({
      userLongitude,
      userLatitude,
      destinationLatitude,
      destinationLongitude,
    })

    const {
      selectedDriver,
      setDrivers
    } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>([])
    useEffect(()=>{
      if(Array.isArray(drivers))
      {
        if(!userLatitude || !userLongitude)
        {
          return;
        }
        else
        {
          const newMarkers = generateMarkersFromData({
            data: drivers,
            userLatitude,
            userLongitude,
          })
          setMarkers(newMarkers)
        }
      }
    },[drivers, userLatitude, userLongitude])

    useEffect(()=>{
      if(markers.length > 0 && destinationLatitude !== undefined && destinationLongitude !== undefined)
      {
        calculateDriverTimes({
          markers,
          userLatitude,
          userLongitude,
          destinationLatitude,
          destinationLongitude,
        }).then((drivers)=>{
          setDrivers(drivers as MarkerData[])
        });
      }
    },[markers,destinationLatitude,destinationLongitude])

    if(loading || !userLatitude || !userLongitude)
    {
      return (
        <View className='flex justify-between items-center w-full'>
          <ActivityIndicator size="small" color="#000"/>
        </View>
      )
    }
    if(error)
    {
      return (
        <View className='flex justify-between items-center w-full'>
          <Text className='text-red-500'>{error}</Text>
        </View>
      )
    }
  return (
    <MapView
        provider={PROVIDER_DEFAULT}
        className='w-full h-full rounded-2xl'
        tintColor='black'
        mapType='mutedStandard'
        showsPointsOfInterest={false}
        initialRegion={region}
        showsUserLocation={true}
        userInterfaceStyle='light'
    >
        {markers.map((marker)=>(
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
              
            }
          />
        ))}
        {destinationLatitude && destinationLongitude && (
          <>
            <Marker 
              key="destination"
              coordinate={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              title="Destination"
              image={icons.pin}
            />
            <MapViewDirections
              origin={{ 
                latitude: userLatitude!, 
                longitude: userLongitude!, 
              }}
              destination={{ 
                latitude: destinationLatitude, 
                longitude: destinationLongitude 
              }}
              apikey={`${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`}
              strokeWidth={3}
              strokeColor="#0286ff"
              />
          </>
        )}
    </MapView>
  )
}

export default Map