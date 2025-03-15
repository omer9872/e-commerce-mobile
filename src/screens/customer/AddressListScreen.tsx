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
import type {Address, UserInformation} from '../../types/address';
import Toast from 'react-native-toast-message';
import {
  fetchUserInformation,
  deleteAddress,
  setDefaultAddress,
} from '../../services/userInformationService';

type AddressListScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'AddressList'
>;

const AddressListScreen = () => {
  const navigation = useNavigation<AddressListScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await fetchUserInformation();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load addresses. Please try again.',
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

  const handleAddAddress = () => {
    navigation.navigate('AddressForm', {});
  };

  const handleEditAddress = (addressId: string) => {
    navigation.navigate('AddressForm', {addressId});
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteAddress(addressId);
              await fetchData(false);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Address deleted successfully',
              });
            } catch (error) {
              console.error('Error deleting address:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete address. Please try again.',
              });
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await setDefaultAddress(addressId);
      await fetchData(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Default address updated',
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update default address. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  const renderAddressItem = ({item}: {item: Address}) => {
    const isDefault = userInfo?.defaultAddress === item._id;

    return (
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.addressName}>{item.name}</Text>
            {isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => handleEditAddress(item._id!)}
              style={styles.iconButton}>
              <Icon name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteAddress(item._id!)}
              style={styles.iconButton}>
              <Icon name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>{item.addressLine1}</Text>
          <Text style={styles.addressText}>
            {item.neighborhood} Mah. {item.street} Sok.
          </Text>
          <Text style={styles.addressText}>
            No: {item.no}, Daire: {item.flat}
          </Text>
          <Text style={styles.addressText}>
            {item.county}, {item.city} {item.postalCode}
          </Text>
          <Text style={styles.addressText}>{item.country}</Text>
        </View>

        {!isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => handleSetDefaultAddress(item._id!)}>
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
          {!userInfo || userInfo.addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="map-marker-off"
                size={60}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No addresses found</Text>
              <Text style={styles.emptySubText}>
                Add an address to make checkout easier
              </Text>
            </View>
          ) : (
            <FlatList
              data={userInfo.addresses}
              renderItem={renderAddressItem}
              keyExtractor={item => item._id!}
              contentContainerStyle={styles.listContainer}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
            <Icon name="plus" size={24} color="#FFF" />
            <Text style={styles.addButtonText}>Add New Address</Text>
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
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
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
  addressDetails: {
    marginBottom: 10,
  },
  addressText: {
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

export default AddressListScreen;
