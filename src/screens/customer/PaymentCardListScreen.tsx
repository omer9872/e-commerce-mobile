'use client';

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {CustomerProfileStackParamList} from '../../navigation/CustomerNavigator';
import {colors} from '../../theme/colors';
import type {PaymentCard} from '../../types/paymentCard';
import type {UserInformation} from '../../types/address';
import Toast from 'react-native-toast-message';
import {fetchUserInformation} from '../../services/userInformationService';
import {
  deletePaymentCard,
  setDefaultPaymentCard,
} from '../../services/paymentCardService';

type PaymentCardListScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'PaymentCardList'
>;

const getCardIcon = (cardAssociation: string) => {
  switch (cardAssociation.toUpperCase()) {
    case 'VISA':
      return 'credit-card';
    case 'MASTERCARD':
      return 'credit-card';
    case 'AMEX':
      return 'credit-card';
    case 'DISCOVER':
      return 'credit-card';
    default:
      return 'credit-card';
  }
};

const PaymentCardListScreen = () => {
  const navigation = useNavigation<PaymentCardListScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await fetchUserInformation();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching payment cards:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load payment methods. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const handleAddPaymentCard = () => {
    navigation.navigate('PaymentCardForm', {});
  };

  const handleDeletePaymentCard = async (cardId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deletePaymentCard(cardId);
              await fetchData(false);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Payment method deleted successfully',
              });
            } catch (error) {
              console.error('Error deleting payment card:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete payment method. Please try again.',
              });
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSetDefaultPaymentCard = async (cardId: string) => {
    try {
      setLoading(true);
      await setDefaultPaymentCard(cardId);
      await fetchData(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Default payment method updated',
      });
    } catch (error) {
      console.error('Error setting default payment card:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update default payment method. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  const renderPaymentCardItem = ({item}: {item: PaymentCard}) => {
    const isDefault = userInfo?.defaultPaymentCard === item._id;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTypeContainer}>
            <Icon
              name={getCardIcon(item.cardAssociation)}
              size={24}
              color={colors.primary}
            />
            <Text style={styles.cardType}>{item.cardAlias}</Text>
            {isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleDeletePaymentCard(item._id)}
              style={styles.iconButton}>
              <Icon name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <Text style={styles.cardNumber}>
            •••• •••• •••• {item.binNumber.slice(-4)}
          </Text>
          <Text style={styles.cardholderName}>{item.cardFamily}</Text>
          <Text style={styles.cardType}>{item.cardAssociation}</Text>
        </View>

        {!isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefaultPaymentCard(item._id)}>
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {!userInfo || userInfo.paymentCards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="credit-card-off"
                size={60}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No payment methods found</Text>
              <Text style={styles.emptySubText}>
                Add a payment method to make checkout easier
              </Text>
            </View>
          ) : (
            <FlatList
              data={userInfo.paymentCards}
              renderItem={renderPaymentCardItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContainer}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPaymentCard}>
            <Icon name="plus" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80, // Space for the add button
  },
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  cardDetails: {
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardholderName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 5,
  },
  setDefaultText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentCardListScreen;
