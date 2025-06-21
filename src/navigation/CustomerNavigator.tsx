import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';

// Customer Screens
import PhoneVerificationCodeScreen from '../screens/customer/PhoneVerificationCodeScreen';
import EmailVerificationCodeScreen from '../screens/customer/EmailVerificationCodeScreen';
import PaymentConfirmationScreen from '../screens/customer/PaymentConfirmationScreen';
import TransactionHistoryScreen from '../screens/customer/TransactionHistoryScreen';
import TransactionDetailScreen from '../screens/customer/TransactionDetailScreen';
import EmailVerificationScreen from '../screens/customer/EmailVerificationScreen';
import PhoneVerificationScreen from '../screens/customer/PhoneVerificationScreen';
import PaymentCardListScreen from '../screens/customer/PaymentCardListScreen';
import PaymentCardFormScreen from '../screens/customer/PaymentCardFormScreen';
import PaymentSuccessScreen from '../screens/customer/PaymentSuccessScreen';
import CampaignDetailScreen from '../screens/customer/CampaignDetailScreen';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import AddressListScreen from '../screens/customer/AddressListScreen';
import AddressFormScreen from '../screens/customer/AddressFormScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import CampaignsScreen from '../screens/customer/CampaignsScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import CartScreen from '../screens/customer/CartScreen';
import HomeScreen from '../screens/customer/HomeScreen';
import {useTheme} from '../contexts/ThemeContext';

// Stack param lists
export type CustomerHomeStackParamList = {
  Home: undefined;
  ProductDetail: {productId: string};
  PaymentConfirmation: {
    items: any[];
    totalPrice: number;
    defaultAddress: any;
    defaultPaymentCard: any;
  };
  PaymentSuccess: {paymentId: string};
};

export type CustomerCartStackParamList = {
  Cart: undefined;
  PaymentConfirmation: {
    items: any[];
    totalPrice: number;
    defaultAddress: any;
    defaultPaymentCard: any;
  };
  PaymentSuccess: {paymentId: string};
};

export type CustomerProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  AddressList: undefined;
  AddressForm: {addressId?: string};
  PaymentCardList: undefined;
  PaymentCardForm: {cardId?: string};
  TransactionHistory: undefined;
  TransactionDetail: {transactionId: string};
  EmailVerification: undefined;
  EmailVerificationCode: {email: string};
  PhoneVerification: undefined;
  PhoneVerificationCode: {phone: string};
};

export type CustomerFavoritesStackParamList = {
  Favorites: undefined;
  ProductDetail: {productId: string};
};

export type CustomerCampaignsStackParamList = {
  Campaigns: undefined;
  CampaignDetail: {campaignId: string};
};

// Create the stack navigators
const HomeStack = createStackNavigator<CustomerHomeStackParamList>();
const CartStack = createStackNavigator<CustomerCartStackParamList>();
const ProfileStack = createStackNavigator<CustomerProfileStackParamList>();
const FavoritesStack = createStackNavigator<CustomerFavoritesStackParamList>();
const CampaignsStack = createStackNavigator<CustomerCampaignsStackParamList>();
// Home Stack Navigator
const HomeStackNavigator = () => {
  const {colors} = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Product Details'}}
      />
    </HomeStack.Navigator>
  );
};

// Cart Stack Navigator
const CartStackNavigator = () => {
  const {colors} = useTheme();
  return (
    <CartStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <CartStack.Screen
        name="Cart"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <CartStack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={{title: 'Payment Confirmation'}}
      />
      <CartStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{title: 'Payment Success'}}
      />
    </CartStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  const {colors} = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
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
      <ProfileStack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{title: 'My Addresses'}}
      />
      <ProfileStack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({route}) => ({
          title: route.params?.addressId ? 'Edit Address' : 'Add New Address',
          headerBackTitle: 'Back',
        })}
      />
      <ProfileStack.Screen
        name="PaymentCardList"
        component={PaymentCardListScreen}
        options={{title: 'Payment Methods'}}
      />
      <ProfileStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{title: 'Transaction History'}}
      />
      <ProfileStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{title: 'Transaction Detail'}}
      />
      <ProfileStack.Screen
        name="PaymentCardForm"
        component={PaymentCardFormScreen}
        options={({route}) => ({
          title: route.params?.cardId
            ? 'Edit Payment Method'
            : 'Add Payment Method',
          headerBackTitle: 'Back',
        })}
      />
      <ProfileStack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{title: 'Verify Email'}}
      />
      <ProfileStack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationCodeScreen}
        options={{title: 'Verification Code'}}
      />
      <ProfileStack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{title: 'Verify Phone'}}
      />
      <ProfileStack.Screen
        name="PhoneVerificationCode"
        component={PhoneVerificationCodeScreen}
        options={{title: 'Verification Code'}}
      />
    </ProfileStack.Navigator>
  );
};

// Favorites Stack Navigator
const FavoritesStackNavigator = () => {
  const {colors} = useTheme();
  return (
    <FavoritesStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <FavoritesStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{headerShown: false}}
      />
      <FavoritesStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Product Details'}}
      />
    </FavoritesStack.Navigator>
  );
};

const CampaignsStackNavigator = () => {
  const {colors} = useTheme();
  return (
    <CampaignsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <CampaignsStack.Screen
        name="Campaigns"
        component={CampaignsScreen}
        options={{headerShown: false}}
      />
      <CampaignsStack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={{title: 'Details'}}
      />
    </CampaignsStack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const CustomerNavigator = () => {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5C6BC0',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.outline,
          borderTopWidth: 1,
        },
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
        name="CampaignsTab"
        component={CampaignsStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({color, size}) => (
            <Icon name="ticket" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <Icon name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color, size}) => (
            <Icon name="heart-outline" color={color} size={size} />
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
