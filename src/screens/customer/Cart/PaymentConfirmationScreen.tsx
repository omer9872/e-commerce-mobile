'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import type { CustomerCartStackParamList } from '@/navigation/CustomerNavigator';
import currencyFormatter from '@/utils/currencyFormatter';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import type { ICartItem } from '@/types/cart';
import { api } from '@/services/api';

type PaymentConfirmationScreenRouteProp = RouteProp<
  CustomerCartStackParamList,
  'PaymentConfirmation'
>;

const PaymentConfirmationScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { t } = useLocale();
  const route = useRoute<PaymentConfirmationScreenRouteProp>();
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const { colors } = useTheme();

  const { items, totalPrice, defaultAddress, defaultPaymentCard } = route.params;

  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);

      // Send the payment init request
      const response = await api.post('/payment/init', {
        products: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      });

      // Handle the payment response
      if (response.data && response.data._id) {
        // Clear the cart after successful payment
        await clearCart();

        // Navigate to success screen with payment ID
        navigation.navigate('PaymentSuccess', {
          paymentId: response.data._id,
        });

        Toast.show({
          type: 'success',
          text1: t('paymentConfirmation.paymentInitiated'),
          text2: t(
            'paymentConfirmation.yourPaymentHasBeenSuccessfullyInitiated',
          ),
        });
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Toast.show({
        type: 'error',
        text1: t('paymentConfirmation.paymentFailed'),
        text2: t(
          'paymentConfirmation.thereWasAnErrorProcessingYourPaymentPleaseTryAgain',
        ),
      });
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  const navigateToAddressList = () => {
    navigation.navigate(
      'ProfileTab' as never,
      {
        screen: 'AddressList',
      } as never,
    );
  };

  const navigateToPaymentCardList = () => {
    navigation.navigate(
      'ProfileTab' as never,
      {
        screen: 'PaymentCardList',
      } as never,
    );
  };

  const styles = getStyles(colors);

  const renderConfirmationItem = (item: ICartItem) => (
    <View key={item.product._id} style={styles.confirmationItem}>
      <Text style={styles.confirmationItemName}>{item.product.name}</Text>
      <View style={styles.confirmationItemDetails}>
        <Text style={styles.confirmationItemQuantity}>x{item.quantity}</Text>
        <Text style={styles.confirmationItemPrice}>
          {currencyFormatter.format(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Shipping Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {t('paymentConfirmation.shippingAddress')}
            </Text>
            <TouchableOpacity onPress={navigateToAddressList}>
              <Text style={styles.changeText}>
                {t('paymentConfirmation.change')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>{defaultAddress.name}</Text>
            <Text style={styles.addressLine}>
              {defaultAddress.street} No: {defaultAddress.no},{' '}
              {defaultAddress.flat && `Flat: ${defaultAddress.flat},`}
              {defaultAddress.neighborhood}, {defaultAddress.county}
            </Text>
            <Text style={styles.addressLine}>
              {defaultAddress.city}, {defaultAddress.postalCode},{' '}
              {defaultAddress.country}
            </Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="credit-card" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {t('paymentConfirmation.paymentMethod')}
            </Text>
            <TouchableOpacity onPress={navigateToPaymentCardList}>
              <Text style={styles.changeText}>
                {t('paymentConfirmation.change')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardInfo}>
              <Icon
                name={
                  defaultPaymentCard.cardAssociation.toLowerCase() === 'visa'
                    ? 'credit-card'
                    : 'credit-card-outline'
                }
                size={24}
                color={colors.primary}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.cardName}>
                  {defaultPaymentCard.cardAlias}
                </Text>
                <Text style={styles.cardNumber}>
                  **** **** **** {defaultPaymentCard.binNumber.substring(0, 4)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="basket" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {t('paymentConfirmation.orderSummary')}
            </Text>
          </View>

          <View style={styles.orderSummaryContainer}>
            {items.map(item => renderConfirmationItem(item))}

            <View
              style={[
                styles.confirmationItem,
                styles.totalItem,
                { borderTopWidth: 0 },
              ]}>
              <Text style={styles.totalItemLabel}>
                {t('paymentConfirmation.total')}
              </Text>
              <Text style={styles.totalItemPrice}>
                {currencyFormatter.format(totalPrice)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
          disabled={isProcessing}>
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {t('paymentConfirmation.confirmPayment')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
    changeText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    addressContainer: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
    },
    addressName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    addressLine: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    cardContainer: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
    },
    cardInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardDetails: {
      marginLeft: 12,
    },
    cardName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    cardNumber: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    orderSummaryContainer: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
    },
    confirmationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    confirmationItemName: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    confirmationItemDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    confirmationItemQuantity: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
      width: 30,
      textAlign: 'right',
    },
    confirmationItemPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'right',
    },
    totalItem: {
      borderBottomWidth: 0,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalItemLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    totalItemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
    },
    footer: {
      backgroundColor: colors.card,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    confirmButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default PaymentConfirmationScreen;
