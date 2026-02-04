'use client';

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useLocale } from '../../../contexts/LocaleContext';
import { IPaginatedResponsePayload } from '../../../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { IBlogPost } from '../../../types/blog';
import Image from '../../../components/Image';
import { api } from '../../../services/api';


const BlogScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLocale();

  const [blog, setBlog] = useState<
    IPaginatedResponsePayload<IBlogPost>
  >({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchBlog = async () => {
    try {
      const response = await api.get('/blog-post');
      setBlog(response.data);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch blog',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignPress = (blog: IBlogPost) => {
    navigation.navigate('BlogDetail', { blogId: blog._id });
  };

  const styles = getStyles(colors);

  useEffect(() => {
    fetchBlog();
  }, []);

  const renderBlog = ({ item }: { item: IBlogPost }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => handleCampaignPress(item)}>
      <Image id={item.coverImage} style={styles.blogImage} />
      <View style={styles.blogContent}>
        <Text style={styles.blogName}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('blog.title')}</Text>
        </View>

        {isLoading ? (
          <View style={[styles.flex, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={blog?.data ?? []}
            onRefresh={fetchBlog}
            refreshing={isLoading}
            renderItem={renderBlog}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={[styles.flex, styles.centerContent]}>
                <Icon name="book-open" size={64} color={colors.gray} />
                <Text style={styles.emptyText}>
                  {t('blog.noActiveBlog')}
                </Text>
                <Text style={styles.emptySubtext}>
                  {t('blog.checkBackLaterForNewBlog')}
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
    blogCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 8,
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
    blogImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    blogContent: {
      marginVertical: 6,
    },
    blogName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    blogDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
      lineHeight: 20,
    },
    conditionsContainer: {
      marginBottom: 12,
    },
    conditionContainer: {
      backgroundColor: colors.lightBackground,
      padding: 8,
      borderRadius: 4,
      marginBottom: 4,
    },
    conditionText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    rewardContainer: {
      backgroundColor: colors.lightBackground,
      padding: 8,
      borderRadius: 4,
    },
    rewardText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
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

export default BlogScreen;
