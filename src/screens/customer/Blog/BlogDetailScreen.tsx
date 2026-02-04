import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

import { useLocale } from '../../../contexts/LocaleContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { IBlogPost } from '../../../types/blog';
import ImageCarousel from '../../../components/ImageCarousel';
import Image from '../../../components/Image';
import { api } from '../../../services/api';

const BlogDetailScreen = () => {
  const { t } = useLocale();
  const route = useRoute();
  const [blog, setBlog] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const { blogId } = route.params as { blogId: string };

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      const response = await api.get(`/blog-post/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: t('errors.unknownError'),
        text2: t('errors.unknownErrorDescription'),
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('blogDetails.notFound')}</Text>
      </View>
    );
  }

  const formatDate = (dateString: string | Date) => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        {blog.imageGallery && blog.imageGallery.length > 0 ? (
          <ImageCarousel images={blog.imageGallery} height={250} />
        ) : (
          <Image id={blog.coverImage} style={styles.blogImage} />
        )}


        <View style={styles.detailsContainer}>
          <Text style={styles.blogName}>{blog.title}</Text>
          <RenderHtml
            contentWidth={width}
            source={{ html: blog.content ?? '' }}
            baseStyle={{ color: colors.text }}
          />

          <View style={styles.section}>
            <View style={styles.durationContainer}>
              <View style={styles.dateContainer}>
                <Icon name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {t('blogDetails.createdAt')}: {formatDate(blog.createdAt)}
                </Text>
              </View>
              {blog.updatedAt && <View style={styles.dateContainer}>
                <Icon name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {t('blogDetails.updatedAt')}: {formatDate(blog.updatedAt)}
                </Text>
              </View>}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    blogImage: {
      width: '100%',
      height: 250,
    },
    detailsContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      margin: 16,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    blogName: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    blogDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 24,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    durationContainer: {
      backgroundColor: colors.lightBackground,
      padding: 12,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
    },
  });

export default BlogDetailScreen;
