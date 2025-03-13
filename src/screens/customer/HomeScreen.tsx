'use client';

import {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import type {CustomerHomeStackParamList} from '../../navigation/CustomerNavigator';
import LayoutHeader from '../../components/LayoutHeader';
import ProductCard from '../../components/ProductCard';
import {useAuth} from '../../contexts/AuthContext';
import type {Product} from 'src/types/product';
import {colors} from '../../theme/colors';
import {api} from '../../services/api';

type HomeScreenNavigationProp = StackNavigationProp<
  CustomerHomeStackParamList,
  'Home'
>;

interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user, loyaltySummary, refreshLoyaltySummary} = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const insets = useSafeAreaInsets();

  const fetchProducts = useCallback(
    async (pageNumber: number, shouldRefresh = false) => {
      try {
        setIsLoading(true);
        const response = await api.get<ProductResponse>(
          `/product?page=${pageNumber}&limit=${limit}`,
        );
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
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts(0, true);
  }, [fetchProducts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLoyaltySummary();
    fetchProducts(0, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', {productId});
  };

  const renderProductItem = ({item}: {item: Product}) => (
    <ProductCard product={item} onPress={() => handleProductPress(item._id)} />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={{...styles.container, paddingTop: insets.top}}>
      <View style={styles.subContainer}>
        <LayoutHeader
          title="Home"
          customComponent={
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.firstName || 'User'}
              </Text>
              <Text style={styles.pointsText}>
                You have{' '}
                <Text style={styles.pointsValue}>
                  {loyaltySummary?.currentBalance || 0}
                </Text>{' '}
                <Icon name="star" size={16} color={colors.card} />
              </Text>
            </View>
          }
        />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Available Products</Text>
          <FlatList
            data={products}
            keyExtractor={item => item._id}
            renderItem={renderProductItem}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products available</Text>
                </View>
              ) : null
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingBottom: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  pointsText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 15,
  },
  productsList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
