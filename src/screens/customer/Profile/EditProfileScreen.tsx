'use client';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useState, useEffect} from 'react';

import {useLocale} from '@/contexts/LocaleContext';
import {useTheme} from '@/contexts/ThemeContext';
import TextInput from '@/components/TextInput';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/services/api';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const {user, updateUser} = useAuth();
  const {t} = useLocale();
  const {colors} = useTheme();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put('/user/me', {
        firstName,
        lastName,
      });
      await updateUser(response.data);
      Alert.alert(
        t('success.updated'),
        t('editProfile.profileUpdatedSuccessfully'),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('errors.error'), t('editProfile.failedToUpdateProfile'));
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('editProfile.name')}</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('editProfile.namePlaceholder')}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('editProfile.lastName')}</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('editProfile.lastNamePlaceholder')}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {t('editProfile.saveChanges')}
              </Text>
            )}
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
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 5,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default EditProfileScreen;
