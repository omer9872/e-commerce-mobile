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
  ITransactionItem,
  PaymentMethod,
  PaymentStatus,
  ShippingStatus,
  ShippingType,
  ITransaction,
} from '../../types/transaction';
import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {fetchTransactionById} from '../../services/transactionService';
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';
import Image from '../../components/Image';

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
  const {colors} = useTheme();
  const {t} = useLocale();

  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionById(transactionId);
        setTransaction(data);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: t('transactionDetail.error'),
          text2: t(
            'transactionDetail.failedToLoadTransactionDetailsPleaseTryAgain',
          ),
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

  const styles = getStyles(colors);

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
        <Text style={styles.errorText}>
          {t('transactionDetail.transactionNotFound')}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>
            {t('transactionDetail.goBack')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const date = new Date(transaction.createdAt);
  const formattedDate = dayjs(date).format('MMMM dddd, YYYY');
  const formattedTime = dayjs(date).format('hh:mm');

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#5C6BC0" />

      <View style={styles.card}>
        <View style={styles.transactionTypeContainer}>
          <View style={[styles.iconContainer, {backgroundColor: '#E8F5E9'}]}>
            <Icon name={'check'} size={30} color={'#4CAF50'} />
          </View>
          <Text style={styles.transactionType}>
            {t('transactionDetail.payment')}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValueLeft}>{transaction._id}</Text>
        </View> */}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('transactionDetail.date')}</Text>
          <Text style={styles.detailValueRight}>{formattedDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('transactionDetail.time')}</Text>
          <Text style={styles.detailValueRight}>{formattedTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('transactionDetail.paymentMethod')}
          </Text>
          <Text style={styles.detailValueRight}>
            {
              PaymentMethodText[
                transaction.paymentMethod as keyof typeof PaymentMethodText
              ]
            }
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('transactionDetail.paymentStatus')}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    PaymentStatusColors[
                      transaction.paymentStatus as keyof typeof PaymentStatusColors
                    ],
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    PaymentStatusColors[
                      transaction.paymentStatus as keyof typeof PaymentStatusColors
                    ],
                },
              ]}>
              {
                PaymentStatusText[
                  transaction.paymentStatus as keyof typeof PaymentStatusText
                ]
              }
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('transactionDetail.shippingType')}
          </Text>
          <Text style={styles.detailValueRight}>
            {
              ShippingTypeText[
                transaction.shippingType as keyof typeof ShippingTypeText
              ]
            }
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {t('transactionDetail.shippingStatus')}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    ShippingStatusColors[
                      transaction.shippingStatus as keyof typeof ShippingStatusColors
                    ],
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    ShippingStatusColors[
                      transaction.shippingStatus as keyof typeof ShippingStatusColors
                    ],
                },
              ]}>
              {
                ShippingStatusText[
                  transaction.shippingStatus as keyof typeof ShippingStatusText
                ]
              }
            </Text>
          </View>
        </View>

        {transaction.items && transaction.items.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsTitle}>
              {t('transactionDetail.items')}
            </Text>
            {transaction.items.map((item: ITransactionItem, index: number) => (
              <View
                key={index}
                style={{
                  ...styles.itemRow,
                  ...{borderBottomWidth: 1, borderBottomColor: '#EEEEEE'},
                }}>
                <View style={styles.itemImageContainer}>
                  <Image id={item.product.images[0]} style={styles.itemImage} />
                  <View>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <Text style={styles.itemSKUName}>{item.sku}</Text>
                  </View>
                </View>
                <Text style={styles.itemPrice}>
                  {(item?.product?.price ?? 0).toFixed(2)}₺ x {item.quantity}
                </Text>
              </View>
            ))}
            <View style={styles.itemRow}>
              <Text style={styles.totalName}>
                {t('transactionDetail.total')}
              </Text>
              <Text style={styles.moneyAmount}>
                {(transaction?.totalAmount ?? 0).toFixed(2)}₺
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
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
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      margin: 16,
      padding: 20,
      elevation: 2,
      shadowColor: colors.black,
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
      color: colors.text,
    },
    moneyAmount: {
      fontSize: 18,
      color: colors.text,
      marginTop: 4,
      fontWeight: 'bold',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
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
      marginBottom: 16,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.text,
    },
    detailValueLeft: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
      textAlign: 'left',
    },
    detailValueRight: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
      textAlign: 'right',
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
      color: colors.text,
      marginBottom: 12,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    itemName: {
      fontSize: 16,
      color: colors.text,
    },
    itemSKUName: {
      fontSize: 14,
      color: colors.text,
    },
    totalName: {
      fontSize: 16,
      color: colors.text,
      fontWeight: 'bold',
    },
    itemPrice: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    itemImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    itemImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
    },
  });

export default TransactionDetailScreen;
