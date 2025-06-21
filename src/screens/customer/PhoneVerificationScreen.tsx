'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {userService} from '../../services/userService';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';
import TextInput from '../../components/TextInput';

type PhoneVerificationScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'PhoneVerification'
>;

const PhoneVerificationScreen = () => {
  const navigation = useNavigation<PhoneVerificationScreenNavigationProp>();
  const {user, fetchMe} = useAuth();
  const {colors} = useTheme();

  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phoneNumber: string) => {
    // Basic phone validation - can be enhanced based on your requirements
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
  };

  const handleSendVerification = async () => {
    setError('');

    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    if (!validatePhone(cleanPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await userService.updatePhone(phone);
      await fetchMe();
      navigation.navigate('PhoneVerificationCode', {phone});
    } catch (err: any) {
      console.error('Error sending phone verification:', err);
      setError(
        err.response?.data?.message ||
          'Failed to send verification code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <Icon name="cellphone" size={60} color={colors.primary} />
        </View>

        <Text style={styles.title}>Update Your Phone Number</Text>
        <Text style={styles.description}>
          Enter your phone number to receive a verification code via SMS.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            maxLength={11}
          />

          <TouchableOpacity
            style={[
              styles.button,
              loading || !phone ? styles.buttonDisabled : null,
            ]}
            onPress={handleSendVerification}
            disabled={loading || !phone}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Icon name="information-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            We'll send a verification code to this phone number. Standard SMS
            rates may apply.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
      marginBottom: 10,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 30,
      textAlign: 'center',
    },
    formContainer: {
      width: '100%',
      marginBottom: 20,
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
      opacity: 0.7,
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

export default PhoneVerificationScreen;
