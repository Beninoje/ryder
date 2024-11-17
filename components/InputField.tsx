import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";

import { InputFieldProps } from "@/types/type";
import React, { useState } from "react";
import { icons } from "@/constants";

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
}: InputFieldProps) => {
  const [reveal, setReveal] = useState(false)
  const handleRevealPassword = () => {
    setReveal(!reveal)
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500  ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
            autoCapitalize="none"
            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
            secureTextEntry={secureTextEntry && !reveal}
            placeholderTextColor="gray"
            {...props} />
            {label === "Password" ? 
              <TouchableOpacity className='mr-3' onPress={handleRevealPassword}>
                <Image source={reveal ? icons.eyeopen : icons.eyecross} className={`w-6 h-6 ml-4 ${iconStyle}`} /> 
              </TouchableOpacity>
                : null
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
