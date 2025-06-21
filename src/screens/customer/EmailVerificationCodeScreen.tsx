'use client';

import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput as RNTextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {userService} from '../../services/userService';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';

type EmailVerificationCodeScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'EmailVerificationCode'
>;

type EmailVerificationCodeScreenRouteProp = RouteProp<
  CustomerProfileStackParamList,
  'EmailVerificationCode'
>;

const CODE_LENGTH = 6;

const EmailVerificationCodeScreen = () => {
  const {user, updateUser} = useAuth();
  const navigation = useNavigation<EmailVerificationCodeScreenNavigationProp>();
  const route = useRoute<EmailVerificationCodeScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const {email} = route.params;
  const {colors} = useTheme();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleCodeChange = (text: string, index: number) => {
    // Allow only digits
    const digit = text.replace(/[^0-9]/g, '');

    // Update the code state
    const newCode = code.split('');
    newCode[index] = digit;
    const updatedCode = newCode.join('');
    setCode(updatedCode);

    // Auto-focus to next input if a digit was entered
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== CODE_LENGTH) {
      setError(`Please enter the ${CODE_LENGTH}-digit verification code`);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await userService.verifyEmail(code);

      // Update user in context with verified email status
      if (user) {
        await updateUser({
          ...user,
          verification: {
            ...user.verification,
            email: true,
          },
        });
      }

      setSuccess(true);

      // Navigate back to profile after a delay
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 2000);
    } catch (error: any) {
      console.error('Error verifying code:', error);
      setError(
        error.response?.data?.message ||
          'Invalid verification code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await userService.updateEmail(email);
      setCanResend(false);
      setCountdown(60);
      setError(null);
    } catch (error: any) {
      console.error('Error resending code:', error);
      setError(
        error.response?.data?.message ||
          'Failed to resend verification code. Please try again.',
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
        {success ? (
          <View style={styles.successContainer}>
            <Icon name="check-circle" size={80} color={colors.success} />
            <Text style={styles.successTitle}>Email Verified!</Text>
            <Text style={styles.successMessage}>
              Your email has been successfully verified. Redirecting to
              profile...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Icon name="email-outline" size={60} color={colors.primary} />
            </View>

            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.description}>
              We've sent a verification code to {email}. Please enter the code
              below.
            </Text>

            <View style={styles.codeContainer}>
              {Array(CODE_LENGTH)
                .fill(0)
                .map((_, index) => (
                  <RNTextInput
                    key={index}
                    ref={(ref: RNTextInput | null) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={code[index] || ''}
                    onChangeText={text => handleCodeChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    onFocus={() => setError(null)}
                  />
                ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={isLoading || code.length !== CODE_LENGTH}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={isLoading}
                  style={styles.resendButton}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.countdownText}>
                  Resend code in {countdown} seconds
                </Text>
              )}
            </View>
          </>
        )}
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
    codeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20,
      width: '100%',
    },
    codeInput: {
      width: 40,
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      marginHorizontal: 5,
      backgroundColor: colors.card,
    },
    errorText: {
      color: colors.error,
      textAlign: 'center',
      marginVertical: 10,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    buttonDisabled: {
      backgroundColor: colors.primaryLight,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    resendContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    resendButton: {
      padding: 10,
    },
    resendText: {
      color: colors.primary,
      fontSize: 16,
    },
    countdownText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    successContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    successMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

export default EmailVerificationCodeScreen;
