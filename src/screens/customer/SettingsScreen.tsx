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

import {useTheme} from '../../contexts/ThemeContext';
import {useAuth} from '../../contexts/AuthContext';

const SettingsScreen = () => {
  const {colors, isDark, toggleTheme} = useTheme();
  const {signOut} = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const togglePushNotifications = () =>
    setPushNotifications(previousState => !previousState);
  const toggleEmailNotifications = () =>
    setEmailNotifications(previousState => !previousState);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic here
            Alert.alert(
              'Feature Not Implemented',
              'Account deletion is not yet implemented.',
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
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={pushNotifications ? colors.card : colors.background}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
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
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={isDark ? colors.card : colors.background}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Icon name="logout" size={24} color={colors.error} />
              <Text style={[styles.buttonText, {color: colors.error}]}>
                Sign Out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDeleteAccount}>
              <Icon name="delete" size={24} color={colors.error} />
              <Text style={[styles.buttonText, {color: colors.error}]}>
                Delete Account
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
