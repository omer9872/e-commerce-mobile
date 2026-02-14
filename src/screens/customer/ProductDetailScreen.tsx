'use client';

import { useEffect, useState } from 'react';
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
import { type RouteProp, useRoute } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';

import type {
  IProduct,
  IProductVariant,
  IProductVariantOption,
} from '@/types/product';
import type { CustomerHomeStackParamList } from '@/navigation/CustomerNavigator';
import currencyFormatter from '@/utils/currencyFormatter';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLocale } from '@/contexts/LocaleContext';
import IconButton from '@/components/IconButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import Image from '@/components/Image';
import { api } from '@/services/api';
import { STYLING } from '@/style/const';

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
    addCartLoading,
    removeCartLoading,
    updateCartLoading,
  } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { colors } = useTheme();
  const { t } = useLocale();

  const { productId } = route.params;
  const width = Dimensions.get('window').width;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartQuantityLoading, setIsCartQuantityLoading] = useState(false);
  const [webViewHeight, setWebViewHeight] = useState(0); // Add WebView height state
  const [selectedSKU, setSelectedSKU] = useState<string>('');
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  // Find cart items that match the current product
  const cartItems = items.filter(item => item.product._id === productId);

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

  const handleAddToCart = async (sku: string, qty: number = 1) => {
    if (!product || isCartQuantityLoading) return;

    try {
      setIsCartQuantityLoading(true);
      await addToCart(product._id, sku, qty);

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

  const handleRemoveFromCart = async (sku: string) => {
    if (!product || isCartQuantityLoading) return;

    try {
      setIsCartQuantityLoading(true);
      await removeFromCart(product._id, sku);

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

  const handleQuantityChange = async (sku: string, newQuantity: number) => {
    if (!product || newQuantity < 1) return;
    const variant = product.variants?.find(v => v.sku === sku);
    if (variant && newQuantity > variant.stock) return;
    const cartItem = cartItems.find(item => item.sku === sku);
    if (!cartItem) return;

    try {
      setIsCartQuantityLoading(true);
      await updateQuantity(product._id, sku, newQuantity);
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
    const variantCartItem = cartItems.find(item => item.sku === variant.sku);
    const isInCart = !!variantCartItem;
    const variantQuantity = variantCartItem?.quantity ?? 1;

    return (
      <View
        key={variant.sku}
        style={[
          styles.variantItem,
          isSelected && styles.selectedVariant,
          isOutOfStock && styles.outOfStockVariant,
        ]}>
        <TouchableOpacity
          style={styles.variantContent}
          onPress={() => !isOutOfStock && setSelectedSKU(variant.sku)}
          disabled={isOutOfStock}
          activeOpacity={0.7}>
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
            {!isInCart && (
              <IconButton
                size="small"
                onPress={() => handleAddToCart(variant.sku, 1)}
                loading={addCartLoading}
                variant="primary"
                rounded={false}
                icon={
                  <Icon name="cart-plus" size={20} color={colors.white} />
                }
              />
            )}
          </View>
        </TouchableOpacity>

        {isInCart && (
          <View style={styles.variantActionsRow}>
            <View style={styles.quantityControls}>
              <IconButton
                size="small"
                onPress={() => handleQuantityChange(variant.sku, variantQuantity - 1)}
                variant="primary-outline"
                disabled={variantQuantity <= 1 || updateCartLoading}
                icon={<Icon name="minus" size={16} color={colors.white} />}
                rounded={false}
              />
              <Text style={styles.quantityText}>{variantQuantity}</Text>
              <IconButton
                size="small"
                onPress={() =>
                  handleQuantityChange(variant.sku, variantQuantity + 1)
                }
                variant="primary-outline"
                disabled={
                  variant.stock <= variantQuantity || updateCartLoading
                }
                icon={<Icon name="plus" size={16} color={colors.white} />}
                rounded={false}
              />
            </View>
            <IconButton
              size="small"
              onPress={() => handleRemoveFromCart(variant.sku)}
              loading={removeCartLoading}
              variant="danger"
              rounded={false}
              icon={
                <Icon name="cart-remove" size={20} color={colors.white} />
              }
            />
          </View>
        )}
      </View>
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
            renderItem={({ item }) => renderCarouselItem(item)}
            customConfig={() => ({ type: 'positive', viewCount: 5 })}
          />
        </View>
      )}
      <View style={styles.contentContainer}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <IconButton
            onPress={handleToggleFavorites}
            loading={isFavoritesLoading}
            variant={isInFavorites(product._id) ? 'danger' : 'primary'}
            rounded={false}
            icon={
              isInFavorites(product._id) ? (
                <Icon name="heart" size={25} color={colors.white} />
              ) : (
                <Icon name="heart-outline" size={25} color={colors.white} />
              )
            }
          />
        </View>

        {product.description && (
          <View style={styles.descriptionContainer}>
            <WebView
              style={{
                height: webViewHeight,
                backgroundColor: colors.background,
              }}
              source={{
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        * {
                          color: ${colors.text} !important;
                        }
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                          font-size: 16px;
                          line-height: 1.5;
                          color: ${colors.text} !important;
                          background-color: ${colors.background} !important;
                          margin: 0;
                        }
                        p { 
                          margin: 0 0 8px 0; 
                          color: ${colors.text} !important;
                        }
                        br { line-height: 1.2; }
                        h1, h2, h3, h4, h5, h6 { 
                          color: ${colors.text} !important; 
                          margin: 16px 0 8px 0; 
                        }
                        a { 
                          color: ${colors.primary} !important; 
                          text-decoration: underline;
                        }
                        img { 
                          max-width: 100%; 
                          height: auto; 
                        }
                        ul, ol {
                          color: ${colors.text} !important;
                          margin: 8px 0;
                          padding-left: 20px;
                        }
                        li {
                          color: ${colors.text} !important;
                          margin-bottom: 4px;
                        }
                        strong, b {
                          color: ${colors.text} !important;
                          font-weight: bold;
                        }
                        em, i {
                          color: ${colors.text} !important;
                          font-style: italic;
                        }
                        span, div {
                          color: ${colors.text} !important;
                        }
                        blockquote {
                          color: ${colors.textSecondary} !important;
                          border-left: 3px solid ${colors.primary};
                          margin: 8px 0;
                          padding-left: 12px;
                          font-style: italic;
                        }
                        code {
                          color: ${colors.text} !important;
                          background-color: ${colors.surfaceVariant} !important;
                          padding: 2px 4px;
                          border-radius: 3px;
                          font-family: monospace;
                          font-size: 14px;
                        }
                        pre {
                          color: ${colors.text} !important;
                          background-color: ${colors.surfaceVariant} !important;
                          padding: 12px;
                          border-radius: 6px;
                          font-family: monospace;
                          font-size: 14px;
                        }
                        table {
                          color: ${colors.text} !important;
                          width: 100%;
                          border-collapse: collapse;
                          margin: 8px 0;
                        }
                        th, td {
                          color: ${colors.text} !important;
                          border: 1px solid ${colors.outline};
                          padding: 8px;
                          text-align: left;
                        }
                        th {
                          background-color: ${colors.surfaceVariant} !important;
                          font-weight: bold;
                        }
                        /* Override any inline styles that might set black text */
                        [style*="color: black"], [style*="color: #000"], [style*="color: #000000"] {
                          color: ${colors.text} !important;
                        }
                        [style*="color: white"], [style*="color: #fff"], [style*="color: #ffffff"] {
                          color: ${colors.text} !important;
                        }
                        /* Override common text color classes */
                        .text-black, .black-text {
                          color: ${colors.text} !important;
                        }
                        .text-white, .white-text {
                          color: ${colors.text} !important;
                        }
                      </style>
                      <script>
                        function updateHeight() {
                          const height = Math.max(
                            document.body.scrollHeight,
                            document.body.offsetHeight,
                            document.documentElement.clientHeight,
                            document.documentElement.scrollHeight,
                            document.documentElement.offsetHeight
                          );
                          window.ReactNativeWebView?.postMessage(JSON.stringify({
                            type: 'setHeight',
                            height: height
                          }));
                        }
                        
                        document.addEventListener('DOMContentLoaded', function() {
                          updateHeight();
                          // Update height after images load
                          const images = document.querySelectorAll('img');
                          let loadedImages = 0;
                          if (images.length === 0) return;
                          
                          images.forEach(img => {
                            if (img.complete) {
                              loadedImages++;
                              if (loadedImages === images.length) updateHeight();
                            } else {
                              img.onload = () => {
                                loadedImages++;
                                if (loadedImages === images.length) updateHeight();
                              };
                            }
                          });
                        });
                      </script>
                    </head>
                    <body>${product.description}</body>
                  </html>
                `,
              }}
              javaScriptEnabled={true}
              startInLoadingState={false}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onMessage={event => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'setHeight') {
                    setWebViewHeight(Math.max(data.height + 20, 6)); // Add padding and minimum height
                  }
                } catch (error) {
                  console.log('Error parsing WebView message:', error);
                }
              }}
            />
          </View>
        )}

        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsTitle}>
              {t('productDetails.availableVariants')}
            </Text>
            {product.variants.map(renderVariantItem)}
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
      borderRadius: STYLING.borderRadius.md,
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
    productHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    productName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    descriptionContainer: {},
    descriptionText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      padding: 16,
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
      marginTop: 8,
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
      borderRadius: STYLING.borderRadius.md,
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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10
    },
    variantPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
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
      borderRadius: STYLING.borderRadius.sm,
    },
    inCartText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    variantActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    quantityContainer: {
      marginTop: 20,
      backgroundColor: colors.background,
      borderRadius: STYLING.borderRadius.md,
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
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: STYLING.borderRadius.md,
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
      marginHorizontal: 10,
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
