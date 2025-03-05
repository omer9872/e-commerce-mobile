import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// Merchant Screens
import TransactionHistoryScreen from "../screens/merchant/TransactionHistoryScreen"
import TransactionDetailScreen from "../screens/merchant/TransactionDetailScreen"
import EditProfileScreen from "../screens/merchant/EditProfileScreen"
import SettingsScreen from "../screens/merchant/SettingsScreen"
import ProfileScreen from "../screens/merchant/ProfileScreen"
import ScanQRScreen from "../screens/merchant/ScanQRScreen"

// Stack param lists
export type MerchantTransactionStackParamList = {
  TransactionHistory: undefined
  TransactionDetail: { transactionId: string }
}

export type MerchantProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  Settings: undefined
}

// Create the stack navigators
const TransactionStack = createStackNavigator<MerchantTransactionStackParamList>()
const ProfileStack = createStackNavigator<MerchantProfileStackParamList>()

// Transaction Stack Navigator
const TransactionStackNavigator = () => {
  return (
    <TransactionStack.Navigator>
      <TransactionStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{ title: "Transactions" }}
      />
      <TransactionStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: "Transaction Details" }}
      />
    </TransactionStack.Navigator>
  )
}

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </ProfileStack.Navigator>
  )
}

// Tab Navigator
const Tab = createBottomTabNavigator()

const MerchantNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#5C6BC0",
          tabBarInactiveTintColor: "#9E9E9E",
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="ScanQR"
          component={ScanQRScreen}
          options={{
            title: "Scan QR Code",
            tabBarLabel: "Scan QR",
            tabBarIcon: ({ color, size }) => <Icon name="qrcode-scan" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="TransactionsTab"
          component={TransactionStackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: "Transactions",
            tabBarIcon: ({ color, size }) => <Icon name="history" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default MerchantNavigator

