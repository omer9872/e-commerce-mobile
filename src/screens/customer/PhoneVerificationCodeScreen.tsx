'use client';

import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {colors} from '../../theme/colors';
import {useAuth} from '../../contexts/AuthContext';
import {userService} from '../../services/userService';

type PhoneVerificationCodeScreenRouteProp = RouteProp<
  CustomerProfileStackParamList,
  'PhoneVerificationCode'
>;

type PhoneVerificationCodeScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'PhoneVerificationCode'
>;

const VERIFICATION_CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const PhoneVerificationCodeScreen = () => {
  const navigation = useNavigation<PhoneVerificationCodeScreenNavigationProp>();
  const route = useRoute<PhoneVerificationCodeScreenRouteProp>();
  const {phone} = route.params;
  const {fetchMe} = useAuth();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resendActive, setResendActive] = useState(false);

  const inputRefs = useRef<Array<RNTextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendActive && cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown === 0) {
      setResendActive(false);
      setCooldown(RESEND_COOLDOWN);
    }
    return () => clearInterval(interval);
  }, [resendActive, cooldown]);

  useEffect(() => {
    // Start the cooldown when the component mounts
    setResendActive(true);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');

    // Update the code state
    const newCode = code.split('');
    newCode[index] = digit;
    setCode(newCode.join(''));

    // Auto-focus to next input if a digit was entered
    if (digit && index < VERIFICATION_CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== VERIFICATION_CODE_LENGTH) {
      setError(
        `Please enter all ${VERIFICATION_CODE_LENGTH} digits of the verification code`,
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userService.verifyPhone(code);
      setSuccess(true);
      await fetchMe();

      // Navigate back to profile after a short delay
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 2000);
    } catch (err: any) {
      console.error('Error verifying phone:', err);
      setError(
        err.response?.data?.message ||
          'Failed to verify code. Please check the code and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendActive) return;

    setLoading(true);
    setError('');

    try {
      await userService.updatePhone(phone);
      setResendActive(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      console.error('Error resending verification code:', err);
      setError(
        err.response?.data?.message ||
          'Failed to resend verification code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {success ? (
          <View style={styles.successContainer}>
            <Icon name="check-circle" size={80} color={colors.success} />
            <Text style={styles.successTitle}>Phone Number Verified!</Text>
            <Text style={styles.successMessage}>
              Your phone number has been successfully verified. Redirecting to
              profile...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Icon name="cellphone-message" size={60} color={colors.primary} />
            </View>

            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.description}>
              We've sent a verification code to {phone}. Please enter it below.
            </Text>

            <View style={styles.codeContainer}>
              {Array.from({length: VERIFICATION_CODE_LENGTH}).map(
                (_, index) => (
                  <RNTextInput
                    key={index}
                    ref={(ref: RNTextInput | null) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.codeInput}
                    value={code[index] || ''}
                    onChangeText={text => handleCodeChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ),
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.button,
                loading || code.length !== VERIFICATION_CODE_LENGTH
                  ? styles.buttonDisabled
                  : null,
              ]}
              onPress={handleVerifyCode}
              disabled={loading || code.length !== VERIFICATION_CODE_LENGTH}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              {resendActive ? (
                <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                  <Text style={styles.resendButtonText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    marginHorizontal: 4,
    backgroundColor: colors.card,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  resendButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  cooldownText: {
    color: colors.textSecondary,
    fontSize: 14,
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

export default PhoneVerificationCodeScreen;
