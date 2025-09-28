'use client';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type {IFavoritesItem, IProduct} from '../../types/index';
import currencyFormatter from '../../utils/currencyFormatter';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useLocale} from '../../contexts/LocaleContext';
import {useTheme} from '../../contexts/ThemeContext';
import Image from '../../components/Image';

const FavoritesScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {t} = useLocale();
  const insets = useSafeAreaInsets();
  const {isLoading, favorites, removeFromFavorites} = useFavorites();
  const {colors} = useTheme();

  const handleProductPress = (product: IProduct) => {
    navigation.navigate('ProductDetail', {productId: product._id});
  };

  const styles = getStyles(colors);

  const getFirstVariantPrice = (item: IFavoritesItem) => {
    const pVariants = item.product.variants ?? [];
    if (pVariants.length > 1) {
      return pVariants[0].price;
    }
    return 0;
  };

  const renderFavoriteItem = ({item}: {item: IFavoritesItem}) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleProductPress(item.product)}>
      <Image id={item.product.images?.[0]} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.productPrice}>
          {currencyFormatter.format(getFirstVariantPrice(item))}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.product._id)}>
        <Icon name="heart" size={24} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('favorites.title')}</Text>
        </View>

        {isLoading ? (
          <View style={[styles.flex, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.product._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            ListEmptyComponent={
              <View style={[styles.flex, styles.centerContent]}>
                <Icon name="heart-outline" size={64} color={colors.gray} />
                <Text style={styles.emptyText}>
                  {t('favorites.noFavorites')}
                </Text>
                <Text style={styles.emptySubtext}>
                  {t('favorites.addProductsToFavorites')}
                </Text>
              </View>
            }
          />
        )}
      </View>
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
    flex: {
      flex: 1,
    },
    list: {
      flex: 1,
      padding: 16,
    },

    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    productInfo: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    removeButton: {
      padding: 8,
      marginLeft: 8,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
  });

export default FavoritesScreen;
