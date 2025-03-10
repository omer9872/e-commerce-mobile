import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {AuthStackParamList} from '../../navigation/AuthNavigator';
import {colors} from '../../theme/colors';

type UserTypeSelectionScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'UserTypeSelection'
>;

const UserTypeSelectionScreen = () => {
  const navigation = useNavigation<UserTypeSelectionScreenNavigationProp>();

  const handleCustomerSelection = () => {
    navigation.navigate('Login', {userType: 'customer'});
  };

  const handleMerchantSelection = () => {
    navigation.navigate('Login', {userType: 'merchant'});
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Loyalty App</Text>
          <Text style={styles.subtitle}>Please select your account type</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleCustomerSelection}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  style={styles.icon}
                  defaultSource={require('../../assets/images/logo.jpg')}
                />
              </View>
              <Text style={styles.optionTitle}>Customer</Text>
              <Text style={styles.optionDescription}>
                Earn points, view rewards, and redeem offers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleMerchantSelection}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  style={styles.icon}
                  defaultSource={require('../../assets/images/logo.jpg')}
                />
              </View>
              <Text style={styles.optionTitle}>Merchant</Text>
              <Text style={styles.optionDescription}>
                Scan customer codes and manage transactions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 20,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 50,
    height: 50,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default UserTypeSelectionScreen;
