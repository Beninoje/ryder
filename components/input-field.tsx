import { icons } from '@/constants'
import { InputFieldProps } from '@/types'
import React, { useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'


const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}:InputFieldProps) => {
  const [reveal, setReveal] = useState(false)
  const handleRevealPassword = () => {
    setReveal(!reveal)
  }
 return ( 
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='my-2 w-full'>
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>{label}</Text>
        <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border-2 border-neutral-100 focus:border-primary-500 ${containerStyle}`}>
          {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
          <TextInput
            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left lowercase`}
            secureTextEntry={secureTextEntry && !reveal}
            placeholderTextColor="gray"
            
            {...props} />
            {label === "Password" ? 
              <TouchableOpacity className='mr-3' onPress={handleRevealPassword}>
                <Image source={reveal ? icons.eyeopen : icons.eyeclose} className={`w-6 h-6 ml-4 ${iconStyle}`} /> 
              </TouchableOpacity>
                : null
            }
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
 )
}

export default InputField