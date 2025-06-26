'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

type PaymentCardFormScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'PaymentCardForm'
>;

const PaymentCardFormScreen = () => {
  const {t} = useLocale();
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
        text1: t('errors.error'),
        text2: t('paymentCardForm.cardAliasRequired'),
      });
      return false;
    }

    if (!formData.cardHolderName.trim()) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('paymentCardForm.cardHolderNameRequired'),
      });
      return false;
    }

    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('paymentCardForm.pleaseEnterAValidCardNumber'),
      });
      return false;
    }

    if (!formData.expireMonth || !formData.expireYear) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('paymentCardForm.expiryDateRequired'),
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
        text1: t('errors.error'),
        text2: t('paymentCardForm.cardHasExpired'),
      });
      return false;
    }

    if (!formData.cvc || formData.cvc.length < 3) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('paymentCardForm.pleaseEnterAValidCVV'),
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
        text1: t('success.success'),
        text2: t('paymentCardForm.paymentMethodAddedSuccessfully'),
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving payment card:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('paymentCardForm.failedToSavePaymentMethod'),
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
            <Text style={styles.label}>{t('paymentCardForm.cardAlias')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('paymentCardForm.cardAliasPlaceholder')}
              value={formData.cardAlias}
              onChangeText={text => handleChange('cardAlias', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('paymentCardForm.cardHolderName')}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('paymentCardForm.cardHolderNamePlaceholder')}
              value={formData.cardHolderName}
              onChangeText={text => handleChange('cardHolderName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('paymentCardForm.cardNumber')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('paymentCardForm.cardNumberPlaceholder')}
              value={formData.cardNumber}
              onChangeText={text =>
                handleChange('cardNumber', formatCardNumber(text))
              }
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>
                {t('paymentCardForm.expiryMonth')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('paymentCardForm.expiryMonthPlaceholder')}
                value={formData.expireMonth}
                onChangeText={text =>
                  handleChange('expireMonth', formatExpiryMonth(text))
                }
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>
                {t('paymentCardForm.expiryYear')}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('paymentCardForm.expiryYearPlaceholder')}
                value={formData.expireYear}
                onChangeText={text =>
                  handleChange('expireYear', formatExpiryYear(text))
                }
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>{t('paymentCardForm.cvc')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('paymentCardForm.cvcPlaceholder')}
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
              {t(
                'paymentCardForm.yourCardInformationIsSecurelyProcessedAndStoredByOurPaymentProvider',
              )}
            </Text>
          </View>

          <Button
            title={t('paymentCardForm.addPaymentMethod')}
            loading={submitting}
            onPress={handleSubmit}
            disabled={submitting}></Button>
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
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
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
