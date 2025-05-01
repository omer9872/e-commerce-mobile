import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

import type {MerchantEmployeeProfileStackParamList} from '../../navigation/MerchantEmployeeNavigator';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../theme/colors';

type ProfileScreenNavigationProp = StackNavigationProp<
  MerchantEmployeeProfileStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {user, signOut} = useAuth();
  const insets = useSafeAreaInsets();

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.content}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.userInfoSection}>
        <Icon name="account-tie" size={80} color={colors.primary} />
        <Text style={styles.userName}>{`${user?.firstName || ''} ${
          user?.lastName || ''
        }`}</Text>
        <Text style={styles.userEmail}>{user?.email || user?.phone || ''}</Text>
        <View style={styles.roleContainer}>
          <Icon name="badge-account" size={20} color={colors.primary} />
          <Text style={styles.roleText}>Merchant Employee</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToEditProfile}>
          <Icon name="account-edit" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToSettings}>
          <Icon name="cog" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <Icon name="logout" size={24} color={colors.error} />
          <Text style={[styles.actionText, {color: colors.error}]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userInfoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    color: colors.text,
  },
});

export default ProfileScreen;
