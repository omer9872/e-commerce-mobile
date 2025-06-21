'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import type {PaymentCardFormData} from '../../types/paymentCard';
import {addPaymentCard} from '../../services/paymentCardService';
import {useTheme} from '../../contexts/ThemeContext';
import TextInput from '../../components/TextInput';

type PaymentCardFormScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'PaymentCardForm'
>;

const PaymentCardFormScreen = () => {
  const navigation = useNavigation<PaymentCardFormScreenNavigationProp>();
  const {colors} = useTheme();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PaymentCardFormData>({
    cardAlias: '',
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
  });

  const handleChange = (field: keyof PaymentCardFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');

    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryMonth = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Ensure month is between 1-12
    if (digits.length > 0) {
      const month = Number.parseInt(digits, 10);
      if (month > 12) {
        return '12';
      }
      if (month < 1) {
        return '1';
      }
    }

    return digits.slice(0, 2);
  };

  const formatExpiryYear = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 4 digits
    return digits.slice(0, 4);
  };

  const formatCVV = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 4 digits (for Amex) or 3 digits (for others)
    return digits.slice(0, 4);
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.cardAlias.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Card alias is required',
      });
      return false;
    }

    if (!formData.cardHolderName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Cardholder name is required',
      });
      return false;
    }

    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid card number',
      });
      return false;
    }

    if (!formData.expireMonth || !formData.expireYear) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Expiry date is required',
      });
      return false;
    }

    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    const expiryYear = Number.parseInt(formData.expireYear, 10);
    const expiryMonth = Number.parseInt(formData.expireMonth, 10);

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Card has expired',
      });
      return false;
    }

    if (!formData.cvc || formData.cvc.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid CVV',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await addPaymentCard({
        cardAlias: formData.cardAlias,
        cardHolderName: formData.cardHolderName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expireMonth: formData.expireMonth,
        expireYear: formData.expireYear,
        cvc: formData.cvc,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Payment method added successfully',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving payment card:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save payment method. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Alias</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., My Visa Card"
              value={formData.cardAlias}
              onChangeText={text => handleChange('cardAlias', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name on card"
              value={formData.cardHolderName}
              onChangeText={text => handleChange('cardHolderName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChangeText={text =>
                handleChange('cardNumber', formatCardNumber(text))
              }
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>Expiry Month</Text>
              <TextInput
                style={styles.input}
                placeholder="MM"
                value={formData.expireMonth}
                onChangeText={text =>
                  handleChange('expireMonth', formatExpiryMonth(text))
                }
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>Expiry Year</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY"
                value={formData.expireYear}
                onChangeText={text =>
                  handleChange('expireYear', formatExpiryYear(text))
                }
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={formData.cvc}
                onChangeText={text => handleChange('cvc', formatCVV(text))}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={true}
              />
            </View>
          </View>

          <View style={styles.securityNote}>
            <Icon
              name="shield-check"
              size={20}
              color={colors.success}
              style={styles.securityIcon}
            />
            <Text style={styles.securityText}>
              Your card information is securely processed and stored by our
              payment provider.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Add Payment Method</Text>
            )}
          </TouchableOpacity>
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
    formContainer: {
      padding: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: '#E1E1E1',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      padding: 12,
      borderRadius: 8,
      marginBottom: 24,
    },
    securityIcon: {
      marginRight: 8,
    },
    securityText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
    },
    disabledButton: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default PaymentCardFormScreen;
