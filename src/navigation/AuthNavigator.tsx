import {createStackNavigator} from '@react-navigation/stack';

import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';

export type AuthStackParamList = {
  UserTypeSelection: undefined;
  Login: {userType: 'customer' | 'merchant' | 'carrier'};
  Register: {userType: 'customer' | 'merchant' | 'carrier'};
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="UserTypeSelection"
        component={UserTypeSelectionScreen}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
