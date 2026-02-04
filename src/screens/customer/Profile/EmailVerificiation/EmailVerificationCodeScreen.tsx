'use client';

import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '@/navigation/CustomerNavigator';
import CodeInput, {type CodeInputRef} from '@/components/CodeInput';
import {userService} from '@/services/userService';
import {useLocale} from '@/contexts/LocaleContext';
import {useTheme} from '@/contexts/ThemeContext';
import {useAuth} from '@/contexts/AuthContext';

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
  const {t} = useLocale();
  const navigation = useNavigation<EmailVerificationCodeScreenNavigationProp>();
  const route = useRoute<EmailVerificationCodeScreenRouteProp>();
  const {email} = route.params;
  const {colors} = useTheme();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const codeInputRef = useRef<CodeInputRef>(null);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(null); // Clear error when user starts typing
  };

  const handleCodeComplete = (completedCode: string) => {
    setCode(completedCode);
    // Auto-verify when code is complete
    if (completedCode.length === CODE_LENGTH) {
      handleVerifyCode(completedCode);
    }
  };

  const handleVerifyCode = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code;

    if (verificationCode.length !== CODE_LENGTH) {
      setError(
        t('emailVerificationCode.pleaseEnterTheVerificationCode', {
          codeLength: CODE_LENGTH,
        }),
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await userService.verifyEmail(verificationCode);

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
      // Clear the code input on error
      codeInputRef.current?.clear();
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
      setCode('');
      codeInputRef.current?.clear();
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
            <Text style={styles.successTitle}>
              {t('emailVerificationCode.emailVerified')}
            </Text>
            <Text style={styles.successMessage}>
              {t('emailVerificationCode.yourEmailHasBeenSuccessfullyVerified')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Icon name="email-outline" size={60} color={colors.primary} />
            </View>

            <Text style={styles.title}>
              {t('emailVerificationCode.enterVerificationCode')}
            </Text>
            <Text style={styles.description}>
              {t('emailVerificationCode.weHaveSentAVerificationCodeTo', {
                email,
              })}
            </Text>

            <CodeInput
              ref={codeInputRef}
              length={CODE_LENGTH}
              onCodeChange={handleCodeChange}
              onCodeComplete={handleCodeComplete}
              autoFocus
              error={!!error}
              style={styles.codeContainer}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => handleVerifyCode()}
              disabled={isLoading || code.length !== CODE_LENGTH}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {t('emailVerificationCode.verifyCode')}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={isLoading}
                  style={styles.resendButton}>
                  <Text style={styles.resendText}>
                    {t('emailVerificationCode.resendCode')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.countdownText}>
                  {t('emailVerificationCode.resendCodeIn', {
                    countdown,
                  })}
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
      marginVertical: 20,
      width: '100%',
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
