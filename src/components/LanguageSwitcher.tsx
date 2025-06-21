import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useLocale} from '../contexts/LocaleContext';
import {useTheme} from '../contexts/ThemeContext';

interface LanguageSwitcherProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLabel = false,
  size = 'medium',
}) => {
  const {locale, setLocale, t} = useLocale();
  const {colors} = useTheme();

  const getLanguageLabel = () => {
    switch (locale) {
      case 'tr':
        return 'TR';
      case 'en':
        return 'EN';
      default:
        return 'TR';
    }
  };

  const getNextLanguage = () => {
    return locale === 'tr' ? 'en' : 'tr';
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  const handlePress = async () => {
    const nextLanguage = getNextLanguage();
    await setLocale(nextLanguage);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Icon
        name="language"
        size={getIconSize()}
        color={colors.primary}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: colors.onSurface,
              fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
            },
          ]}>
          {getLanguageLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
});

export default LanguageSwitcher; 