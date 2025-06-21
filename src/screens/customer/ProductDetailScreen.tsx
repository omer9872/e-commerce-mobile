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

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import type {IProduct, IProductVariant} from 'src/types/product';
import {useFavorites} from '../../contexts/FavoritesContext';
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
      Alert.alert('Error', 'Failed to load product details. Please try again.');
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
        text1: 'Added to Cart',
        text2: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add item to cart. Please try again.',
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
        text1: 'Removed from Cart',
        text2: `${product.name} has been removed from your cart`,
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove item from cart. Please try again.',
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
          text1: 'Removed from Favorites',
          text2: `${product.name} has been removed from your favorites`,
        });
      } else {
        await addToFavorites(product._id);
        Toast.show({
          type: 'success',
          text1: 'Added to Favorites',
          text2: `${product.name} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update favorites. Please try again.',
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
        text1: 'Error',
        text2: 'Failed to update quantity. Please try again.',
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
            {Object.entries(variant.options).map(([key, value]) => (
              <Text key={key} style={styles.variantOption}>
                {key}: {value}
              </Text>
            ))}
            <Text style={styles.variantSku}>SKU: {variant.sku}</Text>
          </View>
          <View style={styles.variantInfo}>
            <Text style={styles.variantPrice}>{variant.price} ₺</Text>
            <Text
              style={[
                styles.variantStock,
                isOutOfStock ? styles.outOfStockText : null,
              ]}>
              {isOutOfStock ? 'Out of Stock' : `Stock: ${variant.stock}`}
            </Text>
          </View>
        </View>
        {isInCart && (
          <View style={styles.inCartBadge}>
            <Text style={styles.inCartText}>In Cart</Text>
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
        <Text style={styles.errorText}>Product not found</Text>
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
        <Text style={styles.price}>
          {selectedSKU
            ? product.variants?.find(v => v.sku === selectedSKU)?.price
            : product.price}{' '}
          ₺
        </Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsTitle}>Available Variants</Text>
            {product.variants.map(renderVariantItem)}
          </View>
        )}

        {selectedSKU && currentSKUCartItem && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity in Cart</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}>
                {isCartQuantityLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Icon name="minus" size={20} color={colors.text} />
                )}
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  product.variants?.find(v => v.sku === selectedSKU)?.stock ===
                    quantity && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(quantity + 1)}
                disabled={
                  (product.variants?.find(v => v.sku === selectedSKU)?.stock ||
                    0) <= quantity || isCartQuantityLoading
                }>
                {isCartQuantityLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Icon name="plus" size={20} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.stockText}>
              {product.variants?.find(v => v.sku === selectedSKU)?.stock} items
              available
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isAddedToCart ? styles.removeFromCartButton : null,
            ]}
            onPress={isAddedToCart ? handleRemoveFromCart : handleAddToCart}
            disabled={isCartLoading || !selectedSKU}>
            {isCartLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.addToCartButtonContent}>
                <Icon
                  name={isAddedToCart ? 'cart-remove' : 'cart-plus'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.addToCartButtonText}>
                  {isAddedToCart ? 'Remove from Cart' : 'Add to Cart'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isInFavorites(product._id)
                ? styles.removeFromFavoritesButton
                : null,
            ]}
            onPress={handleToggleFavorites}
            disabled={isFavoritesLoading}>
            {isFavoritesLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.favoriteButtonContent}>
                <Icon
                  name={isInFavorites(product._id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.favoriteButtonText}>
                  {isInFavorites(product._id)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
      flexDirection: 'row',
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
    variantStock: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    outOfStockText: {
      color: colors.error,
    },
    inCartBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
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
      marginBottom: 8,
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
