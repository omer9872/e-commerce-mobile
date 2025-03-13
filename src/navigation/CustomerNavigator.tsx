import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Customer Screens
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import QRCodeScreen from '../screens/customer/QRCodeScreen';
import CartScreen from '../screens/customer/CartScreen';
import HomeScreen from '../screens/customer/HomeScreen';

// Stack param lists
export type CustomerHomeStackParamList = {
  Home: undefined;
  ProductDetail: {productId: string};
};

export type CustomerProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

// Create the stack navigators
const HomeStack = createStackNavigator<CustomerHomeStackParamList>();
const ProfileStack = createStackNavigator<CustomerProfileStackParamList>();

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
        name="ProductDetail"
        component={ProductDetailScreen}
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
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const CustomerNavigator = () => {
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
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'QR Code',
          tabBarIcon: ({color, size}) => (
            <Icon name="qrcode" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <Icon name="cart" color={color} size={size} />
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

export default CustomerNavigator;
