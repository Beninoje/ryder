import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'
type Props = {
    focused: boolean
    source:string
}
const TabIcon = ({focused,source}:{source:ImageSourcePropType, focused:boolean}) => {
  return (
    <View
    className={`flex flex-row justify-center items-center duration-200 transition-all  rounded-full ${focused ? "bg-general-300" : ""}`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
  )
}

export default TabIcon
