import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: '#3B82F6',
            background: '#F9FAFB',
            card: '#FFFFFF',
            text: '#111827',
            border: '#E5E7EB',
            notification: '#EF4444',
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '900' },
          },
        }}
      >
        <StatusBar style="dark" backgroundColor="#F9FAFB" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
})
