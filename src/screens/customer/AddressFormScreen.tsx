'use client';

import {useState, useEffect} from 'react';
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
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import {
  fetchUserInformation,
  addAddress,
  updateAddress,
} from '../../services/userInformationService';
import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import type {AddressFormData} from '../../types/address';
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';
import TextInput from '../../components/TextInput';

type AddressFormScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'AddressForm'
>;

type AddressFormScreenRouteProp = RouteProp<
  CustomerProfileStackParamList,
  'AddressForm'
>;

const AddressFormScreen = () => {
  const navigation = useNavigation<AddressFormScreenNavigationProp>();
  const route = useRoute<AddressFormScreenRouteProp>();
  const {addressId} = route.params || {};
  const isEditing = !!addressId;
  const {colors} = useTheme();
  const {t} = useLocale();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    addressLine1: '',
    country: '',
    city: '',
    county: '',
    neighborhood: '',
    street: '',
    no: '',
    flat: '',
    postalCode: '',
  });

  useEffect(() => {
    if (isEditing) {
      const fetchAddress = async () => {
        try {
          const userInfo = await fetchUserInformation();
          const address = userInfo.addresses.find(a => a._id === addressId);
          if (address) {
            setFormData({
              name: address.name,
              addressLine1: address.addressLine1,
              country: address.country,
              city: address.city,
              county: address.county,
              neighborhood: address.neighborhood,
              street: address.street,
              no: address.no,
              flat: address.flat,
              postalCode: address.postalCode,
            });
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          Toast.show({
            type: 'error',
            text1: t('errors.error'),
            text2: t('addressForm.failedToLoadAddressDetails'),
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAddress();
    }
  }, [addressId, isEditing]);

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof AddressFormData)[] = [
      'name',
      'addressLine1',
      'country',
      'city',
      'county',
      'neighborhood',
      'street',
      'no',
      'flat',
      'postalCode',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldName = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());

        Toast.show({
          type: 'error',
          text1: t('errors.error'),
          text2: `${fieldName} ${t('errors.isRequired')}`,
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateAddress(addressId, formData);
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('addressForm.addressUpdatedSuccessfully'),
        });
      } else {
        await addAddress(formData);
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('addressForm.addressAddedSuccessfully'),
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving address:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('addressForm.failedToSaveAddress'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.addressName')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.addressNamePlaceholder')}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.addressLine')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.addressLinePlaceholder')}
              value={formData.addressLine1}
              onChangeText={text => handleChange('addressLine1', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.country')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.countryPlaceholder')}
              value={formData.country}
              onChangeText={text => handleChange('country', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>{t('addressForm.city')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addressForm.cityPlaceholder')}
                value={formData.city}
                onChangeText={text => handleChange('city', text)}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>{t('addressForm.county')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addressForm.countyPlaceholder')}
                value={formData.county}
                onChangeText={text => handleChange('county', text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.neighborhood')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.neighborhoodPlaceholder')}
              value={formData.neighborhood}
              onChangeText={text => handleChange('neighborhood', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.street')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.streetPlaceholder')}
              value={formData.street}
              onChangeText={text => handleChange('street', text)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
              <Text style={styles.label}>{t('addressForm.no')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addressForm.noPlaceholder')}
                value={formData.no}
                onChangeText={text => handleChange('no', text)}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>{t('addressForm.flat')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addressForm.flatPlaceholder')}
                value={formData.flat}
                onChangeText={text => handleChange('flat', text)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addressForm.postalCode')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addressForm.postalCodePlaceholder')}
              value={formData.postalCode}
              onChangeText={text => handleChange('postalCode', text)}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing
                  ? t('addressForm.updateAddress')
                  : t('addressForm.saveAddress')}
              </Text>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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

export default AddressFormScreen;
