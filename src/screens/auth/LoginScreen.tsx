'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

import type {AuthStackParamList} from '../../navigation/AuthNavigator';
import TextInput from '../../components/TextInput';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../theme/colors';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const {userType} = route.params;
  const {signInViaPhoneNumber, signInViaEmail} = useAuth();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (userType === 'customer') {
      if (!phone || !password) {
        Alert.alert('Error', 'Please enter both phone and password');
        return;
      }

      try {
        setIsLoading(true);
        await signInViaPhoneNumber({phone, password});
        // Auth context will handle navigation based on user type
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Login Failed',
          'Invalid phone or password. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      try {
        setIsLoading(true);
        await signInViaEmail({email, password});
        // Auth context will handle navigation based on user type
      } catch (error) {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please try again.',
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register', {userType});
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {userType === 'customer' ? 'Customer Login' : 'Merchant Login'}
        </Text>

        <View style={styles.form}>
          {userType === 'customer' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: colors.text,
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 5,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  registerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
