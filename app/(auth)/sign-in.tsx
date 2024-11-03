import CustomButton from '@/components/custom-button'
import OAuth from '@/components/google-auth'
import InputField from '@/components/input-field'
import { icons, images } from '@/constants'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
  })

  const onSignUpPress = () => {

  }
  return (
    <ScrollView className='flex-1 bg-white'>
            <View className='flex-1 bg-white'>
              <View className='relative w-full h-[250px]'>
                <Image source={images.signUpCar} className='z-0 w-full h-[250px]'/>
                <Text className='absolute bottom-8 left-5 text-2xl text-black font-JakartaSemiBold'>Welcome 👋</Text>
              </View>
              <View className='p-5 '>
                 <InputField
                  label="Email"
                  placeholder="Enter email"
                  icon={icons.email}
                  textContentType="emailAddress"
                  value={form.email}
                  onChangeText={(value) => setForm({ ...form, email: value })}
                />
                <InputField
                  label="Password"
                  placeholder="Enter password"
                  icon={icons.lock}
                  secureTextEntry={true}
                  textContentType="password"
                  value={form.password}
                  onChangeText={(value) => setForm({ ...form, password: value })}
                />
                <CustomButton
                  title="Sign Up"
                  onPress={onSignUpPress}
                  className="mt-6"
                />
                <OAuth/>
              </View>
                <Text className='flex w-full text-center mt-3 mb-10'>Don't have an account? <Link href="/sign-up" className='text-primary-500 font-JakartaSemiBold'>Sign Up</Link></Text>
            </View>
    </ScrollView>
  )
}

export default SignIn