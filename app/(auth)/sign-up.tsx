import CustomButton from '@/components/custom-button'
import OAuth from '@/components/google-auth'
import InputField from '@/components/input-field'
import { icons, images } from '@/constants'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactNativeModal } from 'react-native-modal';
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [showSuccessModal,setShowSuccessModal] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
  })

  const [verificationEmail, setVerificationEmail] = useState({
    state:"default",
    error:"",
    code:"",
  })

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerificationEmail({
        ...verificationEmail,
        state: "pending",
      })
    } catch (err: any) {
      Alert.alert('Error',err.errors[0].longMessage)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) return;
    
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationEmail.code
      })

      if (completeSignUp.status === 'complete') {
        // TODO Create User in DB as well
        await setActive({ session: completeSignUp.createdSessionId })
        setVerificationEmail({
         ...verificationEmail,
          state: "success",
        })
      } else {
        setVerificationEmail({
          ...verificationEmail,
           error:"Verfication Failed",
           state: "failed",
         })
      }
    } catch (err: any) {
      setVerificationEmail({
        ...verificationEmail,
         error:err.errors[0].longMessage,
         state: "failed",
       })
    }
  }
  return (
    <ScrollView className='flex-1 bg-white'>
            <View className='flex-1 bg-white'>
              <View className='relative w-full h-[250px]'>
                <Image source={images.signUpCar} className='z-0 w-full h-[250px]'/>
                <Text className='absolute bottom-8 left-5 text-2xl text-black font-JakartaSemiBold'>Create Your Account</Text>
              </View>
              <View className='p-5 '>
                <InputField
                  label="Name"
                  placeholder="Enter your name"
                  icon={icons.person}
                  value={form.name}
                  onChangeText={(value)=>{
                    setForm({
                      ...form, 
                      name: value,
                    })
                  }}
                />
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
                <Text className='flex w-full text-center mt-3 mb-10'>Already have an account? <Link href="/sign-in" className='text-primary-500 font-JakartaSemiBold'>Sign In</Link></Text>
                <ReactNativeModal 
                  isVisible={verificationEmail.state === "pending"}
                  onModalHide={() =>{
                    if(verificationEmail.state === "success")
                    {
                      setShowSuccessModal(true)
                    }
                  }}
                >
                  <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px] '>
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
                      value={verificationEmail.code}
                      keyboardType="numeric"
                      onChangeText={(code) =>
                        setVerificationEmail({ ...verificationEmail, code })
                      }
                    />
                    {verificationEmail.error && <Text className='text-red-5000'>{verificationEmail.error}</Text>}
                    <CustomButton
                      title="Verify Email"
                      onPress={
                        onPressVerify
                      }
                      className="mt-5 bg-success-500"
                    />
                  </View>
                </ReactNativeModal>
                <ReactNativeModal isVisible={showSuccessModal}>
                    <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                      <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                      <Text className="text-3xl font-JakartaBold text-center">
                        Verified
                      </Text>
                      <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                        You have successfully verified your account.
                      </Text>
                      <CustomButton
                        title="Browse Home"
                        
                        onPress={() => {
                          setShowSuccessModal(false);
                          router.push(`/(root)/(tabs)/home`);
                        }}
                        className="mt-5"
                      />
                    </View>
                </ReactNativeModal>
            </View>
    </ScrollView>
  )
}

export default SignUp