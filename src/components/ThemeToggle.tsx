import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

import {useTheme} from '../contexts/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  size = 'medium',
}) => {
  const {theme, setTheme, colors} = useTheme();

  const getIconName = () => {
    switch (theme) {
      case 'dark':
        return 'light-mode';
      case 'light':
        return 'dark-mode';
      case 'system':
      default:
        return 'brightness-auto';
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
      default:
        return 'light';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'Auto';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 28;
      case 'medium':
      default:
        return 24;
    }
  };

  const handlePress = async () => {
    const nextTheme = getNextTheme();
    await setTheme(nextTheme);
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
      <Icon name={getIconName()} size={getIconSize()} color={colors.primary} />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: colors.onSurface,
              fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
            },
          ]}>
          {getThemeLabel()}
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
    fontWeight: '500',
  },
});

export default ThemeToggle;
