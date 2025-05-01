'use client';

import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

import {
  PaymentMethod,
  PaymentStatus,
  ShippingStatus,
  ShippingType,
  TransactionDetail,
} from '../../types/transaction';
import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {
  fetchCarrierTransactionById,
  updateCarrierTransactionShippingStatus,
} from '../../services/carrierTransactionService';
import {colors} from '../../theme/colors';

type TransactionDetailScreenRouteProp = RouteProp<
  CustomerProfileStackParamList,
  'TransactionDetail'
>;

const ShippingStatusColors = {
  [ShippingStatus.PENDING]: '#FFC107',
  [ShippingStatus.SHIPPED]: '#4CAF50',
  [ShippingStatus.ON_THE_WAY]: '#4CAF50',
  [ShippingStatus.DELIVERED]: '#4CAF50',
  [ShippingStatus.CANCELLED]: '#F44336',
};

const PaymentStatusColors = {
  [PaymentStatus.PENDING]: '#FFC107',
  [PaymentStatus.COMPLETED]: '#4CAF50',
  [PaymentStatus.FAILED]: '#F44336',
};

const ShippingTypeText = {
  [ShippingType.CARRIER]: 'Carrier',
  [ShippingType.SELF_PICKUP]: 'Self Pickup',
};

const ShippingStatusText = {
  [ShippingStatus.PENDING]: 'Pending',
  [ShippingStatus.SHIPPED]: 'Shipped',
  [ShippingStatus.ON_THE_WAY]: 'On the way',
  [ShippingStatus.DELIVERED]: 'Delivered',
  [ShippingStatus.CANCELLED]: 'Cancelled',
};

const PaymentMethodText = {
  [PaymentMethod.CREDIT_CARD]: 'Credit Card',
  [PaymentMethod.CASH]: 'Cash',
};

const PaymentStatusText = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.COMPLETED]: 'Completed',
  [PaymentStatus.FAILED]: 'Failed',
};

const TransactionDetailScreen = () => {
  const route = useRoute<TransactionDetailScreenRouteProp>();
  const navigation = useNavigation();
  const {transactionId} = route.params;
  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setLoading(true);
        const data = await fetchCarrierTransactionById(transactionId);
        setTransaction(data);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load transaction details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

  const updateShippingStatus = async (newStatus: ShippingStatus) => {
    try {
      await updateCarrierTransactionShippingStatus(transactionId, newStatus);

      // Update local state
      setTransaction(prev =>
        prev ? {...prev, shippingStatus: newStatus} : null,
      );
      setShowStatusModal(false);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Shipping status updated successfully',
      });
    } catch (error) {
      setShowStatusModal(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update shipping status. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#F44336" />
        <Text style={styles.errorText}>Transaction not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = new Date(transaction.createdAt);
  const formattedDate = dayjs(date).format('MMMM dddd, YYYY');
  const formattedTime = dayjs(date).format('hh:mm');

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.card}>
        <View style={styles.transactionTypeContainer}>
          <View style={[styles.iconContainer, {backgroundColor: '#E8F5E9'}]}>
            <Icon name={'check'} size={30} color={'#4CAF50'} />
          </View>
          <Text style={styles.transactionType}>Payment</Text>
        </View>

        <View style={styles.divider} />

        {/* <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValueLeft}>{transaction._id}</Text>
        </View> */}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValueRight}>{formattedDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValueRight}>{formattedTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValueRight}>
            {PaymentMethodText[transaction.paymentMethod]}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Status</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    PaymentStatusColors[transaction.paymentStatus],
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: PaymentStatusColors[transaction.paymentStatus],
                },
              ]}>
              {PaymentStatusText[transaction.paymentStatus]}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipping Type</Text>
          <Text style={styles.detailValueRight}>
            {ShippingTypeText[transaction.shippingType]}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipping Status</Text>
          {transaction.shippingStatus !== ShippingStatus.DELIVERED &&
          transaction.shippingStatus !== ShippingStatus.CANCELLED ? (
            <TouchableOpacity
              style={styles.shippingStatusContainer}
              onPress={() => setShowStatusModal(true)}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      ShippingStatusColors[transaction.shippingStatus],
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: ShippingStatusColors[transaction.shippingStatus],
                  },
                ]}>
                {ShippingStatusText[transaction.shippingStatus]}
              </Text>
              <Icon
                name="chevron-down"
                size={20}
                color={colors.gray}
                style={styles.statusIcon}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      ShippingStatusColors[transaction.shippingStatus],
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: ShippingStatusColors[transaction.shippingStatus],
                  },
                ]}>
                {ShippingStatusText[transaction.shippingStatus]}
              </Text>
            </View>
          )}
        </View>

        {transaction.items && transaction.items.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsTitle}>Items</Text>
            {transaction.items.map((item, index) => (
              <View
                key={index}
                style={{
                  ...styles.itemRow,
                  ...{borderBottomWidth: 1, borderBottomColor: '#EEEEEE'},
                }}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>
                  ${(item?.product?.price ?? 0).toFixed(2)} x {item.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.itemRow}>
              <Text style={styles.totalName}>Total</Text>
              <Text style={styles.moneyAmount}>
                ${(transaction?.totalAmount ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showStatusModal}
        onRequestClose={() => setShowStatusModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Shipping Status</Text>
            {Object.values(ShippingStatus).map(status => (
              <TouchableOpacity
                key={status}
                style={styles.statusOption}
                onPress={() => updateShippingStatus(status)}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: ShippingStatusColors[status],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    {
                      color: ShippingStatusColors[status],
                    },
                  ]}>
                  {ShippingStatusText[status]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowStatusModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  moneyAmount: {
    fontSize: 18,
    color: '#424242',
    marginTop: 4,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  detailColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: '#757575',
  },
  detailValueLeft: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    textAlign: 'left',
  },
  detailValueRight: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    textAlign: 'right',
  },
  shippingStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 16,
    color: '#212121',
  },
  totalName: {
    fontSize: 16,
    color: '#212121',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  statusIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TransactionDetailScreen;
