import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Merchant Employee Screens
import TransactionDetailScreen from '../screens/merchantEmployee/TransactionDetailScreen';
import EditProfileScreen from '../screens/merchantEmployee/EditProfileScreen';
import SettingsScreen from '../screens/merchantEmployee/SettingsScreen';
import ProfileScreen from '../screens/merchantEmployee/ProfileScreen';
import ScanQRScreen from '../screens/merchantEmployee/ScanQRScreen';
import HomeScreen from '../screens/merchantEmployee/HomeScreen';

// Stack param lists
export type MerchantEmployeeHomeStackParamList = {
  Home: undefined;
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
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{headerShown: false}}
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
        options={{headerShown: false}}
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

const MerchantEmployeeNavigator = () => {
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
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanQR"
        component={ScanQRScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Scan QR',
          tabBarIcon: ({color, size}) => (
            <Icon name="qrcode-scan" color={color} size={size} />
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

export default MerchantEmployeeNavigator;
