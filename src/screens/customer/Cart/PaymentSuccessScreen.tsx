import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CustomerCartStackParamList } from '@/navigation/CustomerNavigator';
import { useLocale } from '@/contexts/LocaleContext';
import { useTheme } from '@/contexts/ThemeContext';

type PaymentSuccessScreenRouteProp = RouteProp<
  CustomerCartStackParamList,
  'PaymentSuccess'
>;

const PaymentSuccessScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<PaymentSuccessScreenRouteProp>();
  const { t } = useLocale();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { paymentId } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('HomeTab' as never);
  };

  const handleViewOrders = () => {
    navigation.navigate(
      'ProfileTab' as never,
      {
        screen: 'TransactionHistory',
      } as never,
    );
  };

  const styles = getStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={100} color={colors.success} />
        </View>

        <Text style={styles.title}>
          {t('paymentSuccess.paymentSuccessful')}
        </Text>

        <Text style={styles.message}>
          {t('paymentSuccess.yourPaymentHasBeenSuccessfullyProcessed')}
        </Text>

        <Text style={styles.paymentIdText}>
          {t('paymentSuccess.paymentId')}: {paymentId}
        </Text>

        <Text style={styles.instructionsText}>
          {t(
            'paymentSuccess.youWillReceiveAConfirmationEmailShortlyWithYourOrderDetails',
          )}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleViewOrders}>
            <Text style={styles.secondaryButtonText}>
              {t('paymentSuccess.viewOrders')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleContinueShopping}>
            <Text style={styles.primaryButtonText}>
              {t('paymentSuccess.continueShopping')}
            </Text>
          </TouchableOpacity>
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
    contentContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    iconContainer: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    paymentIdText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    instructionsText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    buttonsContainer: {
      width: '100%',
      flexDirection: 'column',
      gap: 12,
    },
    button: {
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      width: '100%',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default PaymentSuccessScreen;
