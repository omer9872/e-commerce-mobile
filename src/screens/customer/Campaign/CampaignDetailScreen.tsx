import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

import { useLocale } from '../../../contexts/LocaleContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICampaign } from '../../../types/campaign';
import Image from '../../../components/Image';
import { api } from '../../../services/api';

const CampaignDetailScreen = () => {
  const { t } = useLocale();
  const route = useRoute();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const { campaignId } = route.params as { campaignId: string };

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await api.get(`/campaign/active/${campaignId}`);
      setCampaign(response.data);
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

  if (!campaign) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{t('campaignDetails.notFound')}</Text>
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
        <Image id={campaign.image} style={styles.campaignImage} />

        <View style={styles.detailsContainer}>
          <Text style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.campaignDescription} >{campaign.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('campaignDetails.duration')}
            </Text>
            <View style={styles.durationContainer}>
              <View style={styles.dateContainer}>
                <Icon name="calendar-start" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {t('campaignDetails.start')}: {formatDate(campaign.startDate)}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Icon name="calendar-end" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {t('campaignDetails.end')}: {formatDate(campaign.endDate)}
                </Text>
              </View>
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
    campaignImage: {
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
    campaignName: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    campaignDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 24,
    },
    section: {},
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

export default CampaignDetailScreen;
