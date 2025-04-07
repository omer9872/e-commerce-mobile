'use client';

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg';

import {fetchUserInformation} from '../../services/userInformationService';
import type {TransactionCodeResponse} from '../../types/transactionCode';
import {useCart, type CartItem} from '../../contexts/CartContext';
import type {PaymentCard} from '../../types/paymentCard';
import type {UserInformation} from '../../types/address';
import type {Address} from '../../types/address';
import {api, API_URL} from '../../services/api';
import {colors} from '../../theme/colors';

const CartScreen = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalRedeemPoints,
  } = useCart();
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const [isRedeemingPoints, setIsRedeemingPoints] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionCode, setTransactionCode] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [defaultPaymentCard, setDefaultPaymentCard] =
    useState<PaymentCard | null>(null);

  useEffect(() => {
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

  const handleIncreaseQuantity = (
    productId: string,
    currentQuantity: number,
  ) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (
    productId: string,
    currentQuantity: number,
  ) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromCart(productId),
          },
        ],
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ],
    );
  };

  const handleClearCart = () => {
    if (items.length === 0) return;

    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Clear', style: 'destructive', onPress: () => clearCart()},
    ]);
  };

  const handleRedeemPoints = async () => {
    if (items.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty. Add some items before checkout.',
      );
      return;
    }

    try {
      setIsRedeemingPoints(true);

      // Format the cart items into the required payload format
      const products = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      // Send the checkout request
      const response = await api.post<TransactionCodeResponse>(
        '/transaction-code',
        {
          type: 'points_redeemed_for_purchase',
          products,
        },
      );

      // Set the transaction code and show the modal
      setTransactionCode(response.data.code);
      setModalVisible(true);

      // Clear the cart after successful checkout
      await clearCart();
    } catch (error) {
      console.error('Redeem points error:', error);
      Toast.show({
        type: 'error',
        text1: 'Redemption Failed',
        text2:
          'There was an error processing your points redemption. Please try again.',
      });
    } finally {
      setIsRedeemingPoints(false);
    }
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

  const renderCartItem = ({item}: {item: CartItem}) => (
    <View style={styles.cartItem}>
      <Image
        source={{
          uri: item.product.images[0]
            ? `${API_URL}/image/${item.product.images[0]}`
            : undefined,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
        style={styles.productImage}
        defaultSource={require('../../assets/images/logo.jpg')}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          ${item.product.price.toFixed(2)}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleDecreaseQuantity(item.product._id, item.quantity)
            }>
            <Icon name="minus" size={16} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleIncreaseQuantity(item.product._id, item.quantity)
            }>
            <Icon name="plus" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.product._id)}>
        <Icon name="trash-can-outline" size={22} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearCart}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        )}

        {items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Icon name="cart-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('HomeTab' as never)}>
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={items}
              renderItem={renderCartItem}
              keyExtractor={item => item.product._id}
              contentContainerStyle={styles.cartList}
            />

            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
              </View>

              <View style={styles.pointsContainer}>
                <Icon name="star" size={16} color={colors.primary} />
                <Text style={styles.pointsText}>
                  Or redeem with {totalRedeemPoints || totalPrice * 10} points
                </Text>
              </View>

              <View style={styles.checkoutButtonsContainer}>
                <TouchableOpacity
                  style={[styles.checkoutButton, styles.redeemButton]}
                  onPress={handleRedeemPoints}
                  disabled={isRedeemingPoints}>
                  {isRedeemingPoints ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.checkoutButtonText}>Redeem Points</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.checkoutButton, styles.payButton]}
                  onPress={handlePayWithCardClick}>
                  <Text style={styles.checkoutButtonText}>Pay with Card</Text>
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
              <Text style={styles.modalTitle}>Transaction Complete</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Your Transaction Code:</Text>
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
                Please show this code to the merchant to complete your purchase.
              </Text>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={closeModal}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
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
  productPrice: {
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
  quantityText: {
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  redeemButton: {
    backgroundColor: colors.secondary || '#6B7280',
  },
  payButton: {
    backgroundColor: colors.primary,
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
});

export default CartScreen;
