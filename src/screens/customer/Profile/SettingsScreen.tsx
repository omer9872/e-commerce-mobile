'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '@/contexts/ThemeContext';
import {useAuth} from '@/contexts/AuthContext';
import {useLocale} from '@/contexts/LocaleContext';

const SettingsScreen = () => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {signOut} = useAuth();
  const {locale, setLocale, t} = useLocale();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const togglePushNotifications = () =>
    setPushNotifications(previousState => !previousState);
  const toggleEmailNotifications = () =>
    setEmailNotifications(previousState => !previousState);

  const handleLanguageChange = () => {
    Alert.alert(
      t('settings.language.title'),
      t('settings.language.description'),
      [
        {
          text: t('settings.language.turkish'),
          onPress: () => setLocale('tr'),
          style: locale === 'tr' ? 'default' : 'cancel',
        },
        {
          text: t('settings.language.english'),
          onPress: () => setLocale('en'),
          style: locale === 'en' ? 'default' : 'cancel',
        },
        {text: t('settings.language.cancel'), style: 'cancel'},
      ],
    );
  };

  const getLanguageDisplayName = () => {
    return locale === 'tr'
      ? t('settings.language.turkish')
      : t('settings.language.english');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t('errors.unknownError'), t('errors.unknownError'));
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.account.deleteAccount'),
      t('settings.account.deleteAccountDescription'),
      [
        {text: t('settings.account.cancel'), style: 'cancel'},
        {
          text: t('settings.account.delete'),
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic here
            Alert.alert(
              t('settings.account.featureNotImplemented'),
              t('settings.account.featureNotImplementedDescription'),
            );
          },
        },
      ],
    );
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('settings.notifications.title')}
            </Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t('settings.notifications.pushNotifications')}
              </Text>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={pushNotifications ? colors.card : colors.background}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t('settings.notifications.emailNotifications')}
              </Text>
              <Switch
                value={emailNotifications}
                onValueChange={toggleEmailNotifications}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={
                  emailNotifications ? colors.card : colors.background
                }
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('settings.appearance.title')}
            </Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {t('settings.appearance.darkMode')}
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={isDark ? colors.card : colors.background}
              />
            </View>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguageChange}>
              <Text style={styles.settingLabel}>
                {t('settings.language.title')}
              </Text>
              <View style={styles.languageSelector}>
                <Text style={[styles.languageText, {color: colors.text}]}>
                  {getLanguageDisplayName()}
                </Text>
                <Icon name="chevron-right" size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('settings.account.title')}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Icon name="logout" size={24} color={colors.error} />
              <Text style={[styles.buttonText, {color: colors.error}]}>
                {t('settings.account.signOut')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDeleteAccount}>
              <Icon name="delete" size={24} color={colors.error} />
              <Text style={[styles.buttonText, {color: colors.error}]}>
                {t('settings.account.deleteAccount')}
              </Text>
            </TouchableOpacity>
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
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    section: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageText: {
      fontSize: 16,
      marginRight: 8,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
    },
    buttonText: {
      fontSize: 16,
      marginLeft: 10,
    },
  });

export default SettingsScreen;
