'use client';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import type { CustomerProfileStackParamList } from '@/navigation/CustomerNavigator';
import LayoutHeader from '@/components/LayoutHeader';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/Avatar';

type ProfileScreenNavigationProp = StackNavigationProp<
  CustomerProfileStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { t } = useLocale();
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToAddresses = () => {
    navigation.navigate('AddressList');
  };

  const navigateToPaymentCards = () => {
    navigation.navigate('PaymentCardList');
  };

  const navigateToTransactionHistory = () => {
    navigation.navigate('TransactionHistory');
  };

  const navigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  const navigateToEmailVerification = () => {
    navigation.navigate('EmailVerification');
  };

  const navigateToPhoneVerification = () => {
    navigation.navigate('PhoneVerification');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const styles = getStyles(colors);

  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      <View style={styles.subContainer}>
        <LayoutHeader title={t('profile.title')} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <View style={styles.userSection}>
            <Avatar id={user?.image} size={100} />
            <View style={styles.userInfoSection}>
              <Text style={styles.userName}>{`${user?.firstName || ''} ${user?.lastName || ''
                }`}</Text>
              <View style={styles.userInfoRow}>
                <Icon name="email" size={20} color={colors.primary} />
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
              </View>
              {user?.phone && <View style={styles.userInfoRow}>
                <Icon name="phone" size={20} color={colors.primary} />
                <Text style={styles.userEmail}>{user?.phone || ''}</Text>
              </View>}
            </View>
          </View>

          <View style={styles.validationSection}>
            {user?.verification?.email ? (
              <TouchableOpacity
                onPress={navigateToEmailVerification}
                style={[styles.validationItem]}>
                <Icon name="check-circle" size={20} color={colors.primary} />
                <Text style={styles.validationText}>
                  {t('profile.emailVerified')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={navigateToEmailVerification}
                style={[styles.validationItem]}>
                <Icon name="close-circle" size={20} color={colors.error} />
                <Text style={styles.validationText}>
                  {t('profile.emailNotVerified')}
                </Text>
              </TouchableOpacity>
            )}
            {user?.verification?.phone ? (
              <TouchableOpacity
                onPress={navigateToPhoneVerification}
                style={[styles.validationItem]}>
                <Icon name="check-circle" size={20} color={colors.primary} />
                <Text style={styles.validationText}>
                  {t('profile.phoneVerified')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={navigateToPhoneVerification}
                style={[styles.validationItem]}>
                <Icon name="close-circle" size={20} color={colors.error} />
                <Text style={styles.validationText}>
                  {t('profile.phoneNotVerified')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToFavorites}>
              <Icon name="heart-outline" size={24} color={colors.primary} />
              <Text style={styles.actionText}>
                {t('profile.favorites')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToTransactionHistory}>
              <Icon name="history" size={24} color={colors.primary} />
              <Text style={styles.actionText}>
                {t('profile.transactionHistory')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToEditProfile}>
              <Icon name="account-edit" size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t('profile.editProfile')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToAddresses}>
              <Icon name="map-marker" size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t('profile.myAddresses')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToPaymentCards}>
              <Icon name="credit-card" size={24} color={colors.primary} />
              <Text style={styles.actionText}>
                {t('profile.paymentMethods')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToSettings}>
              <Icon name="cog" size={24} color={colors.primary} />
              <Text style={styles.actionText}>{t('profile.settings')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSignOut}>
              <Icon name="logout" size={24} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>
                {t('profile.signOut')}
              </Text>
            </TouchableOpacity>
          </View>
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
    scrollView: {
      flex: 1,
      padding: 10,
    },
    userSection: {
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginVertical: 10,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    image: {
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    userInfoSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    userInfoRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    userEmail: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    validationSection: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    validationItem: {
      backgroundColor: colors.card,
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      padding: 10,
      borderRadius: 10,
    },
    validationText: {
      fontSize: 16,
      color: colors.textSecondary,
    },

    actionsContainer: {
      marginVertical: 10,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 10,
    },
    actionText: {
      fontSize: 16,
      marginLeft: 15,
      color: colors.text,
    },
  });

export default ProfileScreen;
