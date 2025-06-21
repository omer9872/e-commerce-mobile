import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {StatusBar, Text} from 'react-native';

import MerchantEmployeeNavigator from './src/navigation/MerchantEmployeeNavigator';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import {FavoritesProvider} from './src/contexts/FavoritesContext';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import CarrierNavigator from './src/navigation/CarrierNavigator';
import SplashScreen from './src/screens/common/SplashScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import {CartProvider} from './src/contexts/CartContext';

const AppContent = () => {
  const {isLoading, isAuthenticated, userType} = useAuth();
  const {isDark, colors} = useTheme();

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
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />
        </>
      ) : userType ? (
        <>
          {screenParams[userType].navigator()}
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />
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
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
      <Toast position="top" />
    </SafeAreaProvider>
  );
};

export default App;
