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

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {fetchCarrierTransactions} from '../../services/carrierTransactionService';
import {ITransaction, ShippingStatus} from '../../types/transaction';
import {colors} from '../../theme/colors';

type TransactionsScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'TransactionHistory'
>;

const ShippingStatusText = {
  [ShippingStatus.PENDING]: 'Pending',
  [ShippingStatus.SHIPPED]: 'Shipped',
  [ShippingStatus.ON_THE_WAY]: 'On the way',
  [ShippingStatus.DELIVERED]: 'Delivered',
  [ShippingStatus.CANCELLED]: 'Cancelled',
};

const ShippingStatusColors = {
  [ShippingStatus.PENDING]: '#FFC107',
  [ShippingStatus.SHIPPED]: '#4CAF50',
  [ShippingStatus.ON_THE_WAY]: '#4CAF50',
  [ShippingStatus.DELIVERED]: '#4CAF50',
  [ShippingStatus.CANCELLED]: '#F44336',
};

const TransactionsScreen = () => {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
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

        const response = await fetchCarrierTransactions(pageNum, limit);

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
          text1: 'Error',
          text2: 'Failed to load transactions. Please try again.',
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

  const renderTransactionItem = ({item}: {item: ITransaction}) => {
    const date = new Date(item.createdAt);
    const formattedDate = dayjs(date).format('MMMM ddd, YYYY');
    const formattedTime = dayjs(date).format('hh:mm');

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigateToTransactionDetail(item)}>
        <View style={styles.iconContainer}>
          <Icon name={'receipt'} size={24} color={colors.primary} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>Payment</Text>
          <Text style={styles.transactionDate}>
            {formattedDate} at {formattedTime}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.transactionStatus}>Status:</Text>
            <Text
              style={{
                ...styles.statusText,
                color: ShippingStatusColors[item.shippingStatus],
              }}>
              {ShippingStatusText[item.shippingStatus]}
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
            ${item.totalAmount.toFixed(2)}
          </Text>
          {item.totalAmount > 0 && (
            <Text style={styles.moneyAmount}>
              ${item.totalAmount.toFixed(2)}
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
        <Text style={styles.emptyText}>No transactions yet</Text>
        <Text style={styles.emptySubText}>
          Your transaction history will appear here
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: 'white',
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
    backgroundColor: '#F5F5F5',
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
    color: '#212121',
  },
  transactionDate: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transactionStatus: {
    fontSize: 14,
    color: '#757575',
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
    color: '#757575',
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
    color: '#424242',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TransactionsScreen;
