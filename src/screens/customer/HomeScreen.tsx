'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import type {IProductCategory} from '../../types/productCategory';
import LayoutHeader from '../../components/LayoutHeader';
import {useLocale} from '../../contexts/LocaleContext';
import ProductCard from '../../components/ProductCard';
import {useTheme} from '../../contexts/ThemeContext';
import TextInput from '../../components/TextInput';
import {useAuth} from '../../contexts/AuthContext';
import type {IProduct} from '../../types/product';
import Avatar from '../../components/Avatar';
import Image from '../../components/Image';
import {api} from '../../services/api';

type HomeScreenNavigationProp = StackNavigationProp<
  CustomerHomeStackParamList,
  'Home'
>;

interface ProductResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {t} = useLocale();
  const {colors} = useTheme();
  const {user} = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await api.get<IProductCategory[]>('/product-category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(
    async (pageNumber: number, shouldRefresh = false) => {
      try {
        if (pageNumber === 0) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        let url = `/product?page=${pageNumber}&limit=${limit}`;

        // Add category filter if selected
        if (selectedSubcategory) {
          url += `&category=${selectedSubcategory}`;
        } else if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        // Add search query if present
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }

        const response = await api.get<ProductResponse>(url);
        const newProducts = response.data.data;

        if (shouldRefresh) {
          setProducts(newProducts);
        } else {
          setProducts(prevProducts => [...prevProducts, ...newProducts]);
        }

        setHasMore(newProducts.length === limit);
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
        setIsSearching(false);
      }
    },
    [selectedCategory, selectedSubcategory, searchQuery],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(0, true);
  }, [fetchProducts, selectedCategory, selectedSubcategory, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCategories();
    fetchProducts(0, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchProducts(page + 1);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', {productId});
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // If the same category is pressed again, clear the selection
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryPress = (subcategoryId: string) => {
    if (selectedSubcategory === subcategoryId) {
      // If the same subcategory is pressed again, clear only the subcategory selection
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategoryId);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    setIsSearching(true);
    fetchProducts(0, true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    // The useEffect will trigger a new search
  };

  const renderCategoryItem = (category: IProductCategory) => {
    const isSelected = selectedCategory === category._id;
    return (
      <TouchableOpacity
        key={category._id}
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => handleCategoryPress(category._id)}>
        {category.image ? (
          <Image id={category.image} style={styles.categoryImage} />
        ) : (
          <View style={styles.categoryImagePlaceholder}>
            <Icon name="food-variant" size={24} color={colors.primary} />
          </View>
        )}
        <Text
          style={[
            styles.categoryName,
            isSelected && styles.selectedCategoryName,
          ]}
          numberOfLines={1}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSubcategoryItem = (subcategory: IProductCategory) => {
    const isSelected = selectedSubcategory === subcategory._id;
    return (
      <TouchableOpacity
        key={subcategory._id}
        style={[
          styles.subcategoryItem,
          isSelected && styles.selectedSubcategoryItem,
        ]}
        onPress={() => handleSubcategoryPress(subcategory._id)}>
        <Text
          style={[
            styles.subcategoryName,
            isSelected && styles.selectedSubcategoryName,
          ]}>
          {subcategory.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render products in a grid layout
  const renderProductGrid = () => {
    if (isSearching) {
      return (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      );
    }

    if (products.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available</Text>
          {searchQuery && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={clearSearch}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Calculate rows based on products (2 items per row)
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
      const item1 = products[i];
      const item2 = i + 1 < products.length ? products[i + 1] : null;

      rows.push(
        <View key={`row-${i}`} style={styles.productRow}>
          <ProductCard
            product={item1}
            onPress={() => handleProductPress(item1._id)}
            style={styles.productCard}
          />
          {item2 && (
            <ProductCard
              product={item2}
              onPress={() => handleProductPress(item2._id)}
              style={styles.productCard}
            />
          )}
          {!item2 && <View style={styles.productCard} />}
        </View>,
      );
    }

    return (
      <View style={styles.productsContainer}>
        {rows}
        {isLoadingMore && (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
        {!isLoadingMore && hasMore && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Find the selected category object to display its subcategories
  const selectedCategoryObject = categories.find(
    cat => cat._id === selectedCategory,
  );

  // Determine if we have active filters (search or categories)
  const hasActiveFilters =
    !!searchQuery || !!selectedCategory || !!selectedSubcategory;

  const styles = getStyles(colors);

  return (
    <View style={{...styles.container, paddingTop: insets.top}}>
      <View style={styles.subContainer}>
        <LayoutHeader
          title={t('home.title')}
          customComponent={
            <View style={styles.header}>
              <Text style={styles.greeting}>
                {t('home.hello')} {user?.firstName || 'User'}
              </Text>
              <View style={styles.avatarContainer}>
                <Avatar size={40} id={user?.image} />
              </View>
            </View>
          }
        />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          onScrollEndDrag={({nativeEvent}) => {
            const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
            const paddingToBottom = 20;
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom
            ) {
              handleLoadMore();
            }
          }}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon
                name="magnify"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t('home.searchProducts')}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearButton}>
                  <Icon
                    name="close-circle"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
            {isCategoriesLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScrollView}>
                {categories.map(renderCategoryItem)}
              </ScrollView>
            )}
          </View>

          {/* Subcategories Section - Only show if a category is selected */}
          {selectedCategoryObject &&
            (selectedCategoryObject.subCategories ?? []).length > 0 && (
              <View style={styles.subcategoriesContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subcategoriesScrollView}>
                  {(selectedCategoryObject.subCategories ?? []).map(
                    renderSubcategoryItem,
                  )}
                </ScrollView>
              </View>
            )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersLabel}>
                {t('home.activeFilters')}:
              </Text>
              <View style={styles.filtersRow}>
                {searchQuery && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      {t('home.search')}: {searchQuery}
                    </Text>
                    <TouchableOpacity onPress={clearSearch}>
                      <Icon name="close" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedCategory && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      {
                        categories.find(cat => cat._id === selectedCategory)
                          ?.name
                      }
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                      }}>
                      <Icon name="close" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedSubcategory && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      {
                        selectedCategoryObject?.subCategories?.find(
                          sub => sub._id === selectedSubcategory,
                        )?.name
                      }
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedSubcategory(null)}>
                      <Icon name="close" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
                {hasActiveFilters && (
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                      setSearchQuery('');
                    }}>
                    <Text style={styles.clearAllText}>
                      {t('home.clearAll')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Products Section */}
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Search Results${
                  selectedSubcategory
                    ? ` in ${
                        selectedCategoryObject?.subCategories?.find(
                          sub => sub._id === selectedSubcategory,
                        )?.name
                      }`
                    : selectedCategory
                    ? ` in ${
                        categories.find(cat => cat._id === selectedCategory)
                          ?.name
                      }`
                    : ''
                }`
              : selectedSubcategory
              ? `${
                  selectedCategoryObject?.subCategories?.find(
                    sub => sub._id === selectedSubcategory,
                  )?.name
                } Products`
              : selectedCategory
              ? `${
                  categories.find(cat => cat._id === selectedCategory)?.name
                } Products`
              : t('home.availableProducts')}
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            renderProductGrid()
          )}
        </ScrollView>
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
    scrollViewContent: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    avatarContainer: {
      backgroundColor: colors.white,
      borderRadius: 100,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    searchContainer: {
      marginTop: 15,
      marginBottom: 5,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      color: colors.text,
      fontSize: 16,
      padding: 0,
    },
    clearButton: {
      padding: 4,
    },
    searchingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      height: 200,
    },
    searchingText: {
      marginLeft: 10,
      fontSize: 16,
      color: colors.textSecondary,
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginVertical: 15,
    },
    productsContainer: {
      width: '100%',
    },
    productRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    productCard: {
      width: '48%',
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
      height: 200,
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    clearSearchButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    clearSearchText: {
      color: colors.white,
      fontWeight: '500',
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    loadMoreButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginVertical: 10,
      backgroundColor: colors.card,
      borderRadius: 8,
    },
    loadMoreText: {
      color: colors.primary,
      fontWeight: '600',
    },
    categoriesContainer: {
      marginBottom: 10,
    },
    categoriesScrollView: {
      paddingRight: 20,
    },
    categoryItem: {
      marginRight: 12,
      alignItems: 'center',
      width: 80,
    },
    selectedCategoryItem: {
      opacity: 1,
    },
    categoryImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    categoryImagePlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 12,
      textAlign: 'center',
      color: colors.text,
    },
    selectedCategoryName: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    subcategoriesContainer: {
      marginBottom: 10,
    },
    subcategoriesScrollView: {
      paddingRight: 20,
    },
    subcategoryItem: {
      marginRight: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    selectedSubcategoryItem: {
      backgroundColor: colors.primary,
    },
    subcategoryName: {
      fontSize: 14,
      color: colors.text,
    },
    selectedSubcategoryName: {
      color: colors.white,
    },
    activeFiltersContainer: {
      marginBottom: 10,
    },
    activeFiltersLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 5,
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    filterChipText: {
      fontSize: 14,
      color: colors.text,
      marginRight: 6,
    },
    clearAllButton: {
      marginLeft: 4,
      paddingVertical: 6,
    },
    clearAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
  });

export default HomeScreen;
