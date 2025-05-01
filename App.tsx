import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {StatusBar, Text} from 'react-native';

import MerchantEmployeeNavigator from './src/navigation/MerchantEmployeeNavigator';
import {FavoritesProvider} from './src/contexts/FavoritesContext';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import CarrierNavigator from './src/navigation/CarrierNavigator';
import SplashScreen from './src/screens/common/SplashScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import {CartProvider} from './src/contexts/CartContext';

const AppContent = () => {
  const {isLoading, isAuthenticated, userType} = useAuth();

  const screenParams = {
    customer: {
      title: 'Customer',
      navigator: () => <CustomerNavigator />,
    },
    merchant: {
      title: 'Merchant',
      navigator: () => <MerchantEmployeeNavigator />,
    },
    carrier: {
      title: 'Carrier',
      navigator: () => <CarrierNavigator />,
    },
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <>
          <AuthNavigator />
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        </>
      ) : userType ? (
        <>
          {screenParams[userType].navigator()}
          <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
        </>
      ) : (
        <Text>Please Wait...</Text>
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
      <Toast position="top" />
    </SafeAreaProvider>
  );
};

export default App;
