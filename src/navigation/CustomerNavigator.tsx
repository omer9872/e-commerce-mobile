import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';

// Customer Screens
import HomeScreen from '../screens/customer/HomeScreen';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import QRCodeScreen from '../screens/customer/QRCodeScreen';
import CartScreen from '../screens/customer/CartScreen';
import AddressListScreen from '../screens/customer/AddressListScreen';
import AddressFormScreen from '../screens/customer/AddressFormScreen';
import PaymentCardListScreen from '../screens/customer/PaymentCardListScreen';
import PaymentCardFormScreen from '../screens/customer/PaymentCardFormScreen';
import TransactionHistoryScreen from '../screens/customer/TransactionHistoryScreen';
import TransactionDetailScreen from '../screens/customer/TransactionDetailScreen';
import EmailVerificationScreen from '../screens/customer/EmailVerificationScreen';
import EmailVerificationCodeScreen from '../screens/customer/EmailVerificationCodeScreen';
import PhoneVerificationScreen from '../screens/customer/PhoneVerificationScreen';
import PhoneVerificationCodeScreen from '../screens/customer/PhoneVerificationCodeScreen';
import PaymentConfirmationScreen from '../screens/customer/PaymentConfirmationScreen';
import PaymentSuccessScreen from '../screens/customer/PaymentSuccessScreen';

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

// Create the stack navigators
const HomeStack = createStackNavigator<CustomerHomeStackParamList>();
const CartStack = createStackNavigator<CustomerCartStackParamList>();
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
        options={{title: 'Product Details'}}
      />
    </HomeStack.Navigator>
  );
};

// Cart Stack Navigator
const CartStackNavigator = () => {
  return (
    <CartStack.Navigator>
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
