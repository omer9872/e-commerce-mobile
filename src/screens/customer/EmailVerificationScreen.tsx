'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {userService} from '../../services/userService';
import {useTheme} from '../../contexts/ThemeContext';
import TextInput from '../../components/TextInput';
import {useAuth} from '../../contexts/AuthContext';

type EmailVerificationScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'EmailVerification'
>;

const EmailVerificationScreen = () => {
  const {user, fetchMe} = useAuth();
  const {colors} = useTheme();
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendVerificationCode = async () => {
    if (!email || !email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await userService.updateEmail(email);

      await fetchMe();

      // Navigate to code verification screen
      navigation.navigate('EmailVerificationCode', {email});
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      setError(
        error.response?.data?.message ||
          'Failed to send verification code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <Icon name="email-outline" size={60} color={colors.primary} />
        </View>

        <Text style={styles.title}>Update Your Email Address</Text>
        <Text style={styles.description}>
          Enter your email address to receive a verification code via email.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={255}
          />

          <TouchableOpacity
            style={[
              styles.button,
              isLoading || !email ? styles.buttonDisabled : null,
            ]}
            onPress={handleSendVerificationCode}
            disabled={isLoading || !email}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="information-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            We'll send a verification code to this email address.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
    },
    formContainer: {
      marginTop: 10,
      width: '100%',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      backgroundColor: colors.primaryLight,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.primaryLight,
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
    },
    infoText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

export default EmailVerificationScreen;
