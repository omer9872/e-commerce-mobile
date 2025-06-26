'use client';

import {useEffect, useState} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {useLocale} from '../../contexts/LocaleContext';
import {IPaginatedResponsePayload} from '../../types';
import {useTheme} from '../../contexts/ThemeContext';
import Image from '../../components/Image';
import {api} from '../../services/api';

interface CampaignCondition {
  type: 'purchase' | 'visit';
  amount: number;
}

interface CampaignReward {
  type: 'points' | 'discount';
  amount: number;
}

interface Campaign {
  _id: string;
  name: string;
  description: string;
  image: string;
  conditions: CampaignCondition[];
  reward: CampaignReward;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CampaignsScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const {t} = useLocale();

  const [campaigns, setCampaigns] = useState<
    IPaginatedResponsePayload<Campaign>
  >({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaign/active');
      setCampaigns(response.data);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch campaigns',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignPress = (campaign: Campaign) => {
    navigation.navigate('CampaignDetail', {campaignId: campaign._id});
  };

  const styles = getStyles(colors);

  const renderCondition = (condition: CampaignCondition, index: number) => (
    <View key={index} style={styles.conditionContainer}>
      <Text style={styles.conditionText}>
        {condition.type === 'purchase' ? 'Purchase' : 'Visit'}{' '}
        {condition.amount} times
      </Text>
    </View>
  );

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const renderCampaign = ({item}: {item: Campaign}) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => handleCampaignPress(item)}>
      <Image id={item.image} style={styles.campaignImage} />
      <View style={styles.campaignContent}>
        <Text style={styles.campaignName}>{item.name}</Text>
        <Text style={styles.campaignDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('campaigns.title')}</Text>
        </View>

        {isLoading ? (
          <View style={[styles.flex, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={campaigns?.data ?? []}
            onRefresh={fetchCampaigns}
            refreshing={isLoading}
            renderItem={renderCampaign}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={[styles.flex, styles.centerContent]}>
                <Icon name="gift-outline" size={64} color={colors.gray} />
                <Text style={styles.emptyText}>
                  {t('campaigns.noActiveCampaigns')}
                </Text>
                <Text style={styles.emptySubtext}>
                  {t('campaigns.checkBackLaterForNewCampaigns')}
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
    campaignCard: {
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
    campaignImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    campaignContent: {
      marginTop: 6,
    },
    campaignName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    campaignDescription: {
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

export default CampaignsScreen;
