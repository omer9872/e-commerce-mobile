'use client';

import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {type RouteProp, useRoute} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';

import type {
  IProduct,
  IProductVariant,
  IProductVariantOption,
} from '../../types/product';
import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import currencyFormatter from '../../utils/currencyFormatter';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useLocale} from '../../contexts/LocaleContext';
import IconButton from '../../components/IconButton';
import {useTheme} from '../../contexts/ThemeContext';
import {useCart} from '../../contexts/CartContext';
import Image from '../../components/Image';
import {api} from '../../services/api';

type ProductDetailScreenRouteProp = RouteProp<
  CustomerHomeStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    items,
    isLoading: isCartLoading,
  } = useCart();
  const {addToFavorites, removeFromFavorites, isInFavorites} = useFavorites();
  const {colors} = useTheme();
  const {t} = useLocale();

  const {productId} = route.params;
  const width = Dimensions.get('window').width;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartQuantityLoading, setIsCartQuantityLoading] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<string>('');
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Find cart item that matches the current product and selected variant
  const cartItems = items.filter(item => item.product._id === productId);
  const currentSKUCartItem = cartItems.find(item => item.sku === selectedSKU);
  const isAddedToCart = !!currentSKUCartItem;

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/product/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert(
        t('errors.unknownError'),
        t('errors.unknownErrorDescription'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAddedToCart || isCartQuantityLoading) return;

    try {
      setIsCartQuantityLoading(true);
      await addToCart(product._id, selectedSKU, quantity);

      Toast.show({
        type: 'success',
        text1: t('productDetails.addedToCart'),
        text2: `${product.name} ${t('productDetails.hasBeenAddedToYourCart')}`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.unknownError'),
        text2: t('errors.unknownErrorDescription'),
      });
    } finally {
      setIsCartQuantityLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!product || !isAddedToCart || isCartQuantityLoading) return;

    try {
      setIsCartQuantityLoading(true);
      await removeFromCart(selectedSKU);

      Toast.show({
        type: 'success',
        text1: t('productDetails.removedFromCart'),
        text2: `${product.name} ${t(
          'productDetails.hasBeenRemovedFromYourCart',
        )}`,
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.unknownError'),
        text2: t('errors.unknownErrorDescription'),
      });
    } finally {
      setIsCartQuantityLoading(false);
    }
  };

  const handleToggleFavorites = async () => {
    if (!product) return;

    try {
      setIsFavoritesLoading(true);
      if (isInFavorites(product._id)) {
        await removeFromFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: t('productDetails.removedFromFavorites'),
          text2: `${product.name} ${t(
            'productDetails.hasBeenRemovedFromYourFavorites',
          )}`,
        });
      } else {
        await addToFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: t('productDetails.addedToFavorites'),
          text2: `${product.name} ${t(
            'productDetails.hasBeenAddedToYourFavorites',
          )}`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.unknownError'),
        text2: t('errors.unknownErrorDescription'),
      });
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!product || !selectedSKU || !currentSKUCartItem) return;
    if (newQuantity < 1) return;
    const selectedVariant = product.variants?.find(v => v.sku === selectedSKU);
    if (selectedVariant && newQuantity > selectedVariant.stock) return;

    try {
      setIsCartQuantityLoading(true);
      await updateQuantity(product._id, selectedSKU, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Toast.show({
        type: 'error',
        text1: t('errors.unknownError'),
        text2: t('errors.unknownErrorDescription'),
      });
    } finally {
      setIsCartQuantityLoading(false);
    }
  };

  // Update quantity when SKU changes
  useEffect(() => {
    if (selectedSKU) {
      const cartItem = cartItems.find(item => item.sku === selectedSKU);
      setQuantity(cartItem?.quantity || 1);
    } else {
      setQuantity(1);
    }
  }, [selectedSKU, cartItems]);

  const getFirstVariantPrice = () => {
    const pVariants = product?.variants ?? [];
    if (pVariants.length > 1) {
      return pVariants[0].price;
    }
    return 0;
  };

  const styles = getStyles(colors);

  const renderCarouselItem = (item: string) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image id={item} style={styles.productImage} />
      </View>
    );
  };

  const renderVariantItem = (variant: IProductVariant) => {
    const isSelected = selectedSKU === variant.sku;
    const isOutOfStock = variant.stock === 0;
    const isInCart = cartItems.some(item => item.sku === variant.sku);

    return (
      <TouchableOpacity
        key={variant.sku}
        style={[
          styles.variantItem,
          isSelected && styles.selectedVariant,
          isOutOfStock && styles.outOfStockVariant,
        ]}
        onPress={() => !isOutOfStock && setSelectedSKU(variant.sku)}
        disabled={isOutOfStock}>
        <View style={styles.variantContent}>
          <View>
            {variant.options.map((option: IProductVariantOption) => (
              <Text key={option.name} style={styles.variantOption}>
                {option.name}: {option.value}
              </Text>
            ))}
            <Text style={styles.variantSku}>SKU: {variant.sku}</Text>
          </View>
          <View style={styles.variantInfo}>
            <Text style={styles.variantPrice}>
              {currencyFormatter.format(variant.price)}
            </Text>
            {isOutOfStock && (
              <Text style={styles.outOfStockText}>
                {isOutOfStock && t('productDetails.outOfStock')}
              </Text>
            )}
          </View>
        </View>
        {isInCart && (
          <View style={styles.inCartBadge}>
            <Text style={styles.inCartText}>{t('productDetails.inCart')}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('productDetails.notFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {product.images && product.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            loop={false}
            width={width}
            height={300}
            autoPlay={false}
            data={product.images}
            scrollAnimationDuration={1000}
            renderItem={({item}) => renderCarouselItem(item)}
            customConfig={() => ({type: 'positive', viewCount: 5})}
          />
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsTitle}>
              {t('productDetails.availableVariants')}
            </Text>
            {product.variants.map(renderVariantItem)}
          </View>
        )}

        {selectedSKU && currentSKUCartItem && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>
              {t('productDetails.quantityInCart')}
            </Text>
            <View style={styles.quantityControls}>
              <IconButton
                onPress={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isCartQuantityLoading}
                icon={<Icon name="minus" size={16} color={colors.text} />}
              />
              <Text style={styles.quantityText}>{quantity}</Text>
              <IconButton
                onPress={() => handleQuantityChange(quantity + 1)}
                disabled={
                  (product.variants?.find(v => v.sku === selectedSKU)?.stock ||
                    0) <= quantity || isCartQuantityLoading
                }
                icon={<Icon name="plus" size={16} color={colors.text} />}
              />
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <IconButton
            onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}
            loading={isCartLoading}
            disabled={!selectedSKU}
            variant={isAddedToCart ? 'secondary' : 'primary'}
            icon={
              isAddedToCart ? (
                <Icon name="cart-remove" size={20} color={colors.text} />
              ) : (
                <Icon name="cart-plus" size={20} color={colors.text} />
              )
            }
          />

          <IconButton
            onPress={handleToggleFavorites}
            loading={isFavoritesLoading}
            variant={isInFavorites(product._id) ? 'secondary' : 'primary'}
            icon={
              isInFavorites(product._id) ? (
                <Icon name="heart" size={20} color={colors.text} />
              ) : (
                <Icon name="heart-outline" size={20} color={colors.text} />
              )
            }
          />
        </View>
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
    carouselContainer: {
      marginTop: 20,
    },
    carouselItemContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },
    productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
      color: colors.error,
    },
    contentContainer: {
      padding: 20,
    },
    productName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 24,
    },
    actionsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginTop: 20,
    },
    favoriteButton: {
      flex: 1,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: 8,
    },
    removeFromFavoritesButton: {
      backgroundColor: colors.error,
    },
    favoriteButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 8,
    },
    addToCartButton: {
      flex: 1,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: 8,
    },
    removeFromCartButton: {
      backgroundColor: colors.error,
    },
    addToCartButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addToCartButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 8,
    },
    variantsContainer: {
      marginTop: 20,
    },
    variantsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    variantItem: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: colors.border,
    },
    selectedVariant: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    outOfStockVariant: {
      opacity: 0.5,
    },
    variantContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    variantOption: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    variantSku: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    variantInfo: {
      alignItems: 'flex-end',
    },
    variantPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    outOfStockText: {
      fontSize: 12,
      color: colors.error,
    },
    inCartBadge: {
      marginTop: 4,
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    inCartText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    quantityContainer: {
      marginTop: 20,
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quantityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonDisabled: {
      opacity: 0.5,
    },
    quantityText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginHorizontal: 20,
      minWidth: 30,
      textAlign: 'center',
    },
    stockText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

export default ProductDetailScreen;
