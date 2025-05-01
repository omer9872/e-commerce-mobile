import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Merchant Employee Screens
import TransactionDetailScreen from '../screens/carrier/TransactionDetailScreen';
import TransactionsScreen from '../screens/carrier/TransactionsScreen';
import EditProfileScreen from '../screens/carrier/EditProfileScreen';
import SettingsScreen from '../screens/carrier/SettingsScreen';
import ProfileScreen from '../screens/carrier/ProfileScreen';
// Stack param lists
export type MerchantEmployeeHomeStackParamList = {
  Transactions: undefined;
  TransactionDetail: {transactionId: string};
};

export type MerchantEmployeeProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

// Create the stack navigators
const HomeStack = createStackNavigator<MerchantEmployeeHomeStackParamList>();
const ProfileStack =
  createStackNavigator<MerchantEmployeeProfileStackParamList>();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{title: 'Transactions'}}
      />
      <HomeStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{title: 'Detail'}}
      />
    </HomeStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'My Profile'}}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Edit Profile'}}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </ProfileStack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const CarrierNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5C6BC0',
        tabBarInactiveTintColor: '#9E9E9E',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Transactions',
          tabBarIcon: ({color, size}) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CarrierNavigator;
