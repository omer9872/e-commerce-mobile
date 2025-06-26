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
import {useLocale} from '../contexts/LocaleContext';
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
  const {t} = useLocale();

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
        options={{title: t('productDetails.title')}}
      />
    </HomeStack.Navigator>
  );
};

// Cart Stack Navigator
const CartStackNavigator = () => {
  const {colors} = useTheme();
  const {t} = useLocale();

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
        options={{title: t('paymentConfirmation.title')}}
      />
      <CartStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{title: t('paymentSuccess.title')}}
      />
    </CartStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  const {colors} = useTheme();
  const {t} = useLocale();
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
        options={{title: t('profile.editProfile')}}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: t('settings.title')}}
      />
      <ProfileStack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{title: t('profile.myAddresses')}}
      />
      <ProfileStack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({route}) => ({
          title: route.params?.addressId
            ? t('profile.editAddress')
            : t('profile.addNewAddress'),
          headerBackTitle: t('profile.back'),
        })}
      />
      <ProfileStack.Screen
        name="PaymentCardList"
        component={PaymentCardListScreen}
        options={{title: t('profile.paymentMethods')}}
      />
      <ProfileStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{title: t('profile.transactionHistory')}}
      />
      <ProfileStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{title: t('profile.transactionDetail')}}
      />
      <ProfileStack.Screen
        name="PaymentCardForm"
        component={PaymentCardFormScreen}
        options={({route}) => ({
          title: route.params?.cardId
            ? t('profile.editPaymentMethod')
            : t('profile.addPaymentMethod'),
          headerBackTitle: t('profile.back'),
        })}
      />
      <ProfileStack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{title: t('profile.verifyEmail')}}
      />
      <ProfileStack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationCodeScreen}
        options={{title: t('profile.verificationCode')}}
      />
      <ProfileStack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{title: t('profile.verifyPhone')}}
      />
      <ProfileStack.Screen
        name="PhoneVerificationCode"
        component={PhoneVerificationCodeScreen}
        options={{title: t('profile.verificationCode')}}
      />
    </ProfileStack.Navigator>
  );
};

// Favorites Stack Navigator
const FavoritesStackNavigator = () => {
  const {colors} = useTheme();
  const {t} = useLocale();

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
        options={{title: t('productDetails.title')}}
      />
    </FavoritesStack.Navigator>
  );
};

const CampaignsStackNavigator = () => {
  const {colors} = useTheme();
  const {t} = useLocale();

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
        options={{title: t('campaignDetails.title')}}
      />
    </CampaignsStack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const CustomerNavigator = () => {
  const {colors} = useTheme();
  const {t} = useLocale();

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
          tabBarLabel: t('home.title'),
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
          tabBarLabel: t('campaigns.title'),
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
          tabBarLabel: t('cart.title'),
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
          tabBarLabel: t('favorites.title'),
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
          tabBarLabel: t('profile.title'),
          tabBarIcon: ({color, size}) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
