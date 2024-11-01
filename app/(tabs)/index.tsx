import { Image, StyleSheet, Platform, View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-red-500'>Hello Test</Text>
      <StatusBar style="auto"/>
    </SafeAreaView>
  );
}


