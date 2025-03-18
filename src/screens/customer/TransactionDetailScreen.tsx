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
import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {fetchTransactionById} from '../../services/transactionService';
import type {Transaction} from '../../types/transaction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

type TransactionDetailScreenRouteProp = RouteProp<
  CustomerProfileStackParamList,
  'TransactionDetail'
>;

const TransactionDetailScreen = () => {
  const route = useRoute<TransactionDetailScreenRouteProp>();
  const navigation = useNavigation();
  const {transactionId} = route.params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
          text1: 'Error',
          text2: 'Failed to load transaction details. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

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

  const isEarn = transaction.type === 'earn';
  const date = new Date(transaction.createdAt);
  const formattedDate = dayjs(date).format('MMMM dddd, YYYY');
  const formattedTime = dayjs(date).format('hh:mm');

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#5C6BC0" />

      <View style={styles.card}>
        <View style={styles.transactionTypeContainer}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: isEarn ? '#E8F5E9' : '#FFEBEE'},
            ]}>
            <Icon
              name={isEarn ? 'arrow-down' : 'arrow-up'}
              size={30}
              color={isEarn ? '#4CAF50' : '#F44336'}
            />
          </View>
          <Text style={styles.transactionType}>
            {isEarn ? 'Points Earned' : 'Points Spent'}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.pointsAmount,
              {color: isEarn ? '#4CAF50' : '#F44336'},
            ]}>
            {isEarn ? '+' : '-'}
            {transaction.totalPoints} points
          </Text>
          {transaction.totalAmount > 0 && (
            <Text style={styles.moneyAmount}>
              ${transaction.totalAmount.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValueLeft}>{transaction._id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValueRight}>{formattedDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValueRight}>{formattedTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    transaction.paymentStatus === 'completed'
                      ? '#4CAF50'
                      : transaction.paymentStatus === 'pending'
                      ? '#FFC107'
                      : '#F44336',
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    transaction.paymentStatus === 'completed'
                      ? '#4CAF50'
                      : transaction.paymentStatus === 'pending'
                      ? '#FFC107'
                      : '#F44336',
                },
              ]}>
              {transaction.paymentStatus.charAt(0).toUpperCase() +
                transaction.paymentStatus.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValueRight}>
            {transaction.paymentMethod.charAt(0).toUpperCase() +
              transaction.paymentMethod.slice(1)}
          </Text>
        </View>

        {transaction.items && transaction.items.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsTitle}>Items</Text>
            {transaction.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
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
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  moneyAmount: {
    fontSize: 18,
    color: '#424242',
    marginTop: 4,
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemName: {
    fontSize: 16,
    color: '#212121',
  },
  itemPrice: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
});

export default TransactionDetailScreen;
