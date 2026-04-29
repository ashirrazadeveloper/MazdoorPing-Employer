import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'
import HomeScreen from '../screens/Home/HomeScreen'
import FindWorkersScreen from '../screens/Workers/FindWorkersScreen'
import WorkerDetailScreen from '../screens/Workers/WorkerDetailScreen'
import PostJobScreen from '../screens/Jobs/PostJobScreen'
import MyBookingsScreen from '../screens/Jobs/MyBookingsScreen'
import JobDetailScreen from '../screens/Jobs/JobDetailScreen'
import CategoriesScreen from '../screens/Categories/CategoriesScreen'
import FavoritesScreen from '../screens/Favorites/FavoritesScreen'
import RateWorkerScreen from '../screens/Reviews/RateWorkerScreen'
import NotificationsScreen from '../screens/Notifications/NotificationsScreen'
import ProfileScreen from '../screens/Profile/ProfileScreen'
import LoginScreen from '../screens/Auth/LoginScreen'
import RegisterScreen from '../screens/Auth/RegisterScreen'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Custom tab bar icon
function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: string
  label: string
  focused: boolean
}) {
  return (
    <View style={styles.tabItem}>
      <Text
        style={[
          styles.tabIcon,
          focused ? styles.tabIconActive : styles.tabIconInactive,
        ]}
      >
        {icon}
      </Text>
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="FindWorkersTab"
        component={FindWorkersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👷" label="Workers" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PostJobTab"
        component={PostJobScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📋" label="Post Job" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={MyBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📁" label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// Auth Stack Navigator
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

// Main Stack Navigator
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Tab Screens */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Worker Screens */}
      <Stack.Screen
        name="FindWorkers"
        component={FindWorkersScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="WorkerDetail"
        component={WorkerDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Job Screens */}
      <Stack.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />

      {/* Other Screens */}
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="RateWorker"
        component={RateWorkerScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  )
}

// Root Navigator — switches between auth and main
export default function AppNavigator() {
  const { session, employer, loading, demoMode } = useAuth()

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingIcon}>👷</Text>
          <Text style={styles.loadingText}>MazdoorPing</Text>
          <Text style={styles.loadingSubtitle}>Employer App</Text>
          <Text style={styles.loadingSubtext}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!session && !demoMode) {
    return <AuthNavigator />
  }

  return <MainNavigator />
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '900',
    color: COLORS.text,
  },
  loadingSubtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  loadingSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabIconActive: {},
  tabIconInactive: {
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabLabelInactive: {
    color: COLORS.textLight,
  },
})
