import { View, Text, Pressable } from 'react-native'
import React from 'react'
import AccountInfo from '../../components/profile/AccountInfo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Profile = () => {
  return (
    <SafeAreaView style={{height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile</Text>
      <AccountInfo/>
      <Pressable onPress={()=> router.back()} >
        <Text> Go Back</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Profile
