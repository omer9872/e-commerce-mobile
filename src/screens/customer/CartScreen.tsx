'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg';

import {fetchUserInformation} from '../../services/userInformationService';
import type {IProductVariant} from '../../types/product';
import type {PaymentCard} from '../../types/paymentCard';
import type {UserInformation} from '../../types/address';
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useCart} from '../../contexts/CartContext';
import type {Address} from '../../types/address';
import type {ICartItem} from '../../types/cart';
import Image from '../../components/Image';

const CartScreen = () => {
  const {colors} = useTheme();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    subtotal,
    totalDiscount,
    isLoading,
  } = useCart();
  const navigation = useNavigation<NavigationProp<any>>();
  const {t} = useLocale();
  const insets = useSafeAreaInsets();
  const [token, setToken] = React.useState<string | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [transactionCode, setTransactionCode] = React.useState<string | null>(
    null,
  );
  const [userInfo, setUserInfo] = React.useState<UserInformation | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = React.useState(false);
  const [defaultAddress, setDefaultAddress] = React.useState<Address | null>(
    null,
  );
  const [defaultPaymentCard, setDefaultPaymentCard] =
    React.useState<PaymentCard | null>(null);

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('@LoyaltyApp:token');
      setToken(token);
    };
    fetchToken();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoadingUserInfo(true);
      const userInformation = await fetchUserInformation();
      setUserInfo(userInformation);

      // Find default address
      if (userInformation.defaultAddress) {
        const defaultAddr = userInformation.addresses.find(
          addr => addr._id === userInformation.defaultAddress,
        );
        setDefaultAddress(defaultAddr || null);
      }

      // Find default payment card
      if (userInformation.defaultPaymentCard) {
        const defaultCard = userInformation.paymentCards.find(
          card => card._id === userInformation.defaultPaymentCard,
        );
        setDefaultPaymentCard(defaultCard || null);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load your information. Please try again.',
      });
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  const handleRemoveItem = async (sku: string) => {
    try {
      await removeFromCart(sku);
      Toast.show({
        type: 'success',
        text1: 'Item removed',
        text2: 'Item has been removed from your cart',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item from cart',
      });
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    sku: string,
    quantity: number,
  ) => {
    try {
      await updateQuantity(productId, sku, quantity);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update quantity',
      });
    }
  };

  const handleClearCart = () => {
    if (items.length === 0) return;

    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Clear', style: 'destructive', onPress: () => clearCart()},
    ]);
  };

  const handlePayWithCardClick = () => {
    if (items.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty. Add some items before checkout.',
      );
      return;
    }

    // Check if user has default address and payment card
    if (!defaultAddress) {
      Alert.alert(
        'No Default Address',
        'Please set a default address before proceeding with payment.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Add Address',
            onPress: () =>
              navigation.navigate('ProfileTab', {
                screen: 'AddressList',
              }),
          },
        ],
      );
      return;
    }

    if (!defaultPaymentCard) {
      Alert.alert(
        'No Default Payment Card',
        'Please set a default payment card before proceeding with payment.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Add Payment Card',
            onPress: () =>
              navigation.navigate('ProfileTab', {
                screen: 'PaymentCardList',
              }),
          },
        ],
      );
      return;
    }

    // Navigate to payment confirmation screen
    navigation.navigate('PaymentConfirmation', {
      items,
      totalPrice,
      defaultAddress,
      defaultPaymentCard,
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setTransactionCode(null);
  };

  const renderCartItem = (item: ICartItem) => {
    const variant = item.product.variants?.find(
      (v: IProductVariant) => v.sku === item.sku,
    );
    const variantOptions = variant
      ? Object.entries(variant.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      : '';

    const styles = getStyles(colors);

    return (
      <View key={`${item.product._id}-${item.sku}`} style={styles.cartItem}>
        <Image id={item.product.images[0]} style={styles.productImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.productName}>{item.product.name}</Text>
          {variantOptions ? (
            <Text style={styles.variantText}>{variantOptions}</Text>
          ) : null}
          <Text style={styles.price}>{item.price} ₺</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleUpdateQuantity(
                  item.product._id,
                  item.sku,
                  item.quantity - 1,
                )
              }
              disabled={item.quantity <= 1}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleUpdateQuantity(
                  item.product._id,
                  item.sku,
                  item.quantity + 1,
                )
              }>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.sku)}>
          <Icon name="trash-can-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  const styles = getStyles(colors);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearCart}>
            <Text style={styles.clearCartText}>{t('cart.clearCart')}</Text>
          </TouchableOpacity>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Icon name="cart-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyCartText}>{t('cart.emptyCart')}</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('HomeTab' as never)}>
              <Text style={styles.shopButtonText}>{t('cart.shopNow')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView style={styles.cartList}>
              {items.map(renderCartItem)}
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{t('cart.subtotal')}:</Text>
                  <Text style={styles.totalValue}>{subtotal.toFixed(2)} ₺</Text>
                </View>
                {totalDiscount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{t('cart.discount')}:</Text>
                    <Text style={[styles.totalValue, styles.discountValue]}>
                      -{totalDiscount.toFixed(2)} ₺
                    </Text>
                  </View>
                )}
                <View style={[styles.totalRow, styles.finalTotalRow]}>
                  <Text style={[styles.totalLabel, styles.finalTotalLabel]}>
                    {t('cart.total')}:
                  </Text>
                  <Text style={[styles.totalValue, styles.finalTotalValue]}>
                    {totalPrice.toFixed(2)} ₺
                  </Text>
                </View>
              </View>

              <View style={styles.checkoutButtonsContainer}>
                <TouchableOpacity
                  style={[styles.checkoutButton, styles.payButton]}
                  onPress={handlePayWithCardClick}>
                  <Icon name="cart-check" size={24} color={colors.white} />
                  <Text style={styles.checkoutButtonText}>
                    {t('cart.completeOrder')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Transaction Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('cart.transactionComplete')}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>
                {t('cart.yourTransactionCode')}:
              </Text>
              {transactionCode && (
                <QRCode
                  value={transactionCode}
                  size={200}
                  color={colors.text}
                  backgroundColor={colors.card}
                />
              )}
              <Text style={styles.codeValue}>{transactionCode}</Text>
              <Text style={styles.codeInstructions}>
                {t('cart.pleaseShowCodeToMerchant')}
              </Text>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={closeModal}>
              <Text style={styles.doneButtonText}>{t('cart.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    subContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 5,
      textAlign: 'center',
    },
    clearCart: {
      paddingHorizontal: 20,
      marginTop: 14,
    },
    clearCartText: {
      fontSize: 14,
      color: colors.error,
      opacity: 0.8,
      fontWeight: '700',
    },
    emptyCartContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyCartText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: 16,
      marginBottom: 24,
    },
    shopButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    shopButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cartList: {
      padding: 16,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    productImage: {
      width: 100,
      height: '100%',
      borderRadius: 8,
    },
    itemDetails: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    price: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 8,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    quantity: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginHorizontal: 12,
      minWidth: 20,
      textAlign: 'center',
    },
    removeButton: {
      padding: 8,
      justifyContent: 'center',
    },
    footer: {
      backgroundColor: colors.card,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalsContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 8,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    finalTotalRow: {
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    finalTotalLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    totalValue: {
      fontSize: 16,
      color: colors.text,
    },
    discountValue: {
      color: colors.success,
    },
    finalTotalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    checkoutButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    checkoutButton: {
      flex: 1,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 5,
    },
    codeContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    codeLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    codeValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: 2,
      marginVertical: 16,
    },
    codeInstructions: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    doneButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    doneButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    variantText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
  });

export default CartScreen;
