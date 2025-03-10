import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {StatusBar} from 'react-native';

import MerchantEmployeeNavigator from './src/navigation/MerchantEmployeeNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import SplashScreen from './src/screens/common/SplashScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import {CartProvider} from './src/contexts/CartContext';

const AppContent = () => {
  const {isLoading, isAuthenticated, userType} = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userType === 'customer' ? (
        <CustomerNavigator />
      ) : (
        <MerchantEmployeeNavigator />
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
      <Toast />
    </SafeAreaProvider>
  );
};

export default App;
