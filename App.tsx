import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import AuthNavigator from './src/navigation/AuthNavigator';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import MerchantNavigator from './src/navigation/MerchantNavigator';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import SplashScreen from './src/screens/common/SplashScreen';

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
        <MerchantNavigator />
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
