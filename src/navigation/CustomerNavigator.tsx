import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';

import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';

// Customer Screens
import PaymentConfirmationScreen from '@/screens/customer/Cart/PaymentConfirmationScreen';
import PaymentSuccessScreen from '@/screens/customer/Cart/PaymentSuccessScreen';
import CartScreen from '@/screens/customer/Cart/CartScreen';

import ProductDetailScreen from '@/screens/customer/ProductDetailScreen';
import HomeScreen from '@/screens/customer/HomeScreen';

import PhoneVerificationCodeScreen from '@/screens/customer/Profile/PhoneVerification/PhoneVerificationCodeScreen';
import EmailVerificationCodeScreen from '@/screens/customer/Profile/EmailVerificiation/EmailVerificationCodeScreen';
import TransactionHistoryScreen from '@/screens/customer/Profile/Transaction/TransactionHistoryScreen';
import TransactionDetailScreen from '@/screens/customer/Profile/Transaction/TransactionDetailScreen';
import EmailVerificationScreen from '@/screens/customer/Profile/EmailVerificiation/EmailVerificationScreen';
import PhoneVerificationScreen from '@/screens/customer/Profile/PhoneVerification/PhoneVerificationScreen';
import PaymentCardListScreen from '@/screens/customer/Profile/PaymentCard/PaymentCardListScreen';
import PaymentCardFormScreen from '@/screens/customer/Profile/PaymentCard/PaymentCardFormScreen';
import AddressListScreen from '@/screens/customer/Profile/Address/AddressListScreen';
import AddressFormScreen from '@/screens/customer/Profile/Address/AddressFormScreen';
import EditProfileScreen from '@/screens/customer/Profile/EditProfileScreen';
import FavoritesScreen from '@/screens/customer/Profile/FavoritesScreen';
import SettingsScreen from '@/screens/customer/Profile/SettingsScreen';
import ProfileScreen from '@/screens/customer/Profile/ProfileScreen';

import BlogDetailScreen from '@/screens/customer/Blog/BlogDetailScreen';
import BlogScreen from '@/screens/customer/Blog/BlogScreen';

import CampaignDetailScreen from '@/screens/customer/Campaign/CampaignDetailScreen';
import CampaignsScreen from '@/screens/customer/Campaign/CampaignsScreen';

// Stack param lists
export type CustomerHomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  PaymentConfirmation: {
    items: any[];
    totalPrice: number;
    defaultAddress: any;
    defaultPaymentCard: any;
  };
  PaymentSuccess: { paymentId: string };
};

export type CustomerCartStackParamList = {
  Cart: undefined;
  PaymentConfirmation: {
    items: any[];
    totalPrice: number;
    defaultAddress: any;
    defaultPaymentCard: any;
  };
  PaymentSuccess: { paymentId: string };
};

export type CustomerProfileStackParamList = {
  Profile: undefined
  Favorites: undefined;
  EditProfile: undefined;
  Settings: undefined;
  AddressList: undefined;
  AddressForm: { addressId?: string };
  PaymentCardList: undefined;
  PaymentCardForm: { cardId?: string };
  TransactionHistory: undefined;
  TransactionDetail: { transactionId: string };
  EmailVerification: undefined;
  EmailVerificationCode: { email: string };
  PhoneVerification: undefined;
  PhoneVerificationCode: { phone: string };
};

export type CustomerFavoritesStackParamList = {
  Favorites: undefined;
  ProductDetail: { productId: string };
};

export type CustomerCampaignsStackParamList = {
  Campaigns: undefined;
  CampaignDetail: { campaignId: string };
};

export type CustomerBlogStackParamList = {
  Blog: undefined;
  BlogDetail: { blogId: string };
};

// Create the stack navigators
const HomeStack = createStackNavigator<CustomerHomeStackParamList>();
const CartStack = createStackNavigator<CustomerCartStackParamList>();
const ProfileStack = createStackNavigator<CustomerProfileStackParamList>();
const FavoritesStack = createStackNavigator<CustomerFavoritesStackParamList>();
const CampaignsStack = createStackNavigator<CustomerCampaignsStackParamList>();
const BlogStack = createStackNavigator<CustomerBlogStackParamList>();
// Home Stack Navigator
const HomeStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

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
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: t('productDetails.title') }}
      />
    </HomeStack.Navigator>
  );
};

// Cart Stack Navigator
const CartStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

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
        options={{ headerShown: false }}
      />
      <CartStack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={{ title: t('paymentConfirmation.title') }}
      />
      <CartStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{ title: t('paymentSuccess.title') }}
      />
    </CartStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();
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
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: t('profile.editProfile') }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings.title') }}
      />
      <ProfileStack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{ title: t('profile.myAddresses') }}
      />
      <ProfileStack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({ route }) => ({
          title: route.params?.addressId
            ? t('profile.editAddress')
            : t('profile.addNewAddress'),
          headerBackTitle: t('profile.back'),
        })}
      />
      <ProfileStack.Screen
        name="PaymentCardList"
        component={PaymentCardListScreen}
        options={{ title: t('profile.paymentMethods') }}
      />
      <ProfileStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{ title: t('profile.transactionHistory') }}
      />
      <ProfileStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: t('profile.transactionDetail') }}
      />
      <ProfileStack.Screen
        name="PaymentCardForm"
        component={PaymentCardFormScreen}
        options={({ route }) => ({
          title: route.params?.cardId
            ? t('profile.editPaymentMethod')
            : t('profile.addPaymentMethod'),
          headerBackTitle: t('profile.back'),
        })}
      />
      <ProfileStack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{ title: t('profile.verifyEmail') }}
      />
      <ProfileStack.Screen
        name="EmailVerificationCode"
        component={EmailVerificationCodeScreen}
        options={{ title: t('profile.verificationCode') }}
      />
      <ProfileStack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{ title: t('profile.verifyPhone') }}
      />
      <ProfileStack.Screen
        name="PhoneVerificationCode"
        component={PhoneVerificationCodeScreen}
        options={{ title: t('profile.verificationCode') }}
      />
    </ProfileStack.Navigator>
  );
};

// Favorites Stack Navigator
const FavoritesStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

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
        options={{ headerShown: false }}
      />
      <FavoritesStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: t('productDetails.title') }}
      />
    </FavoritesStack.Navigator>
  );
};

const CampaignsStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

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
        options={{ headerShown: false }}
      />
      <CampaignsStack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={{ title: t('campaignDetails.title') }}
      />
    </CampaignsStack.Navigator>
  );
};

const BlogStackNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

  return (
    <BlogStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}>
      <BlogStack.Screen
        name="Blog"
        component={BlogScreen}
        options={{ headerShown: false }}
      />
      <BlogStack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{ title: t('blogDetails.title') }}
      />
    </BlogStack.Navigator>
  );
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const CustomerNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLocale();

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
          tabBarIcon: ({ color, size }) => (
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
          tabBarIcon: ({ color, size }) => (
            <Icon name="ticket" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BlogTab"
        component={BlogStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('blog.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('cart.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('profile.title'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
