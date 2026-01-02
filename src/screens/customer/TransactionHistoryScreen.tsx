'use client';

import {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

import {
  ITransaction,
  PaymentStatus,
  ShippingStatus,
} from '../../types/transaction';
import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {fetchTransactions} from '../../services/transactionService';
import priceFormatter from '../../utils/currencyFormatter';
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';

type TransactionHistoryScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'TransactionHistory'
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

const TransactionHistoryScreen = () => {
  const navigation = useNavigation<TransactionHistoryScreenNavigationProp>();
  const {colors} = useTheme();
  const {t} = useLocale();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  const loadTransactions = useCallback(
    async (pageNum = 0, shouldRefresh = false) => {
      try {
        if (pageNum === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await fetchTransactions(pageNum, limit);

        if (shouldRefresh || pageNum === 0) {
          setTransactions(response.data);
        } else {
          setTransactions(prev => [...prev, ...response.data]);
        }

        setHasMore(response.data.length === limit);
        setPage(pageNum);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('errors.unknownError'),
          text2: t('transactionHistory.failedToLoadTransactionsPleaseTryAgain'),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions(0, true);
  }, [loadTransactions]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadTransactions(page + 1);
    }
  }, [hasMore, loadingMore, loadTransactions, page]);

  const navigateToTransactionDetail = (transaction: ITransaction) => {
    navigation.navigate('TransactionDetail', {transactionId: transaction._id});
  };

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const styles = getStyles(colors);

  const renderTransactionItem = ({item}: {item: ITransaction}) => {
    const date = new Date(item.createdAt);
    const formattedDate = dayjs(date).format('MMMM ddd, YYYY - hh:mm');

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigateToTransactionDetail(item)}>
        <View style={styles.iconContainer}>
          <Icon name={'receipt'} size={24} color={colors.primary} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>
            {t('transactionHistory.payment')}
          </Text>
          <Text style={styles.transactionDate}>{formattedDate}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.transactionStatus}>
              {t('transactionHistory.paymentStatus')}:
            </Text>
            <Text
              style={{
                ...styles.statusText,
                color: PaymentStatusColors[item.paymentStatus],
              }}>
              {t(`common.enums.paymentStatus.${item.paymentStatus}`)}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.transactionStatus}>
              {t('transactionHistory.shippingStatus')}:
            </Text>
            <Text
              style={{
                ...styles.statusText,
                color: ShippingStatusColors[item.shippingStatus],
              }}>
              {t(`common.enums.shippingStatus.${item.shippingStatus}`)}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.transactionAmount,
              {
                color: colors.primary,
              },
            ]}>
            {priceFormatter.format(item.totalAmount)}
          </Text>
          {item.totalAmount > 0 && (
            <Text style={styles.moneyAmount}>
              {priceFormatter.format(item.totalAmount)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#5C6BC0" />
      </View>
    );
  };

  const renderEmptyList = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="history" size={60} color="#BDBDBD" />
        <Text style={styles.emptyText}>
          {t('transactionHistory.noTransactionsYet')}
        </Text>
        <Text style={styles.emptySubText}>
          {t('transactionHistory.yourTransactionHistoryWillAppearHere')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#5C6BC0" />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#5C6BC0" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item._id}
          contentContainerStyle={
            transactions.length === 0
              ? styles.listContentEmpty
              : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#5C6BC0']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
    },
    listContentEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    transactionItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    transactionDetails: {
      flex: 1,
    },
    transactionType: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    transactionDate: {
      fontSize: 14,
      color: colors.text,
      marginTop: 2,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    transactionStatus: {
      fontSize: 14,
      color: colors.text,
      marginRight: 4,
    },
    statusText: {
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    amountContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    moneyAmount: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
    },
    emptySubText: {
      fontSize: 14,
      color: colors.text,
      marginTop: 8,
      textAlign: 'center',
    },
  });

export default TransactionHistoryScreen;
