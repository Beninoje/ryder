import TabIcon from '@/components/tab-icon';
import { icons } from '@/constants';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export default function Layout() {

  return (
      <Tabs 
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          paddingBottom: 0, 
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown:false,
            tabBarIcon: ({focused})=> <TabIcon focused={focused} source={icons.home}/>
            
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            headerShown:false,
            tabBarIcon: ({focused})=> <TabIcon focused={focused} source={icons.chat}/>
            
          }}
        />
        <Tabs.Screen
          name="rides"
          options={{
            title: 'Rides',
            headerShown:false,
            tabBarIcon: ({focused})=> <TabIcon focused={focused} source={icons.list}/>
            
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown:false,
            tabBarIcon: ({focused})=> <TabIcon focused={focused} source={icons.profile}/>
            
          }}
        />



      </Tabs>
  );
}



