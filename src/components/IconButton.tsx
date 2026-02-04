import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

export type ButtonVariant =
  | 'primary'
  | 'primary-outline'
  | 'secondary'
  | 'secondary-outline'
  | 'danger'
  | 'danger-outline'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const { colors } = useTheme();

  const getButtonColors = () => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
          borderColor: colors.primary,
        };
      case 'primary-outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 2,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled
            ? colors.surfaceVariant
            : colors.secondary,
          textColor: colors.white,
          borderColor: colors.secondary,
        };
      case 'secondary-outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.secondary,
          borderColor: colors.secondary,
          borderWidth: 2,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          textColor: colors.white,
          borderColor: colors.error,
        };
      case 'danger-outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.error,
          borderColor: colors.error,
          borderWidth: 2,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary,
          borderColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: colors.error,
          textColor: colors.white,
          borderColor: colors.error,
        };
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          textColor: '#FFFFFF',
          borderColor: '#4CAF50',
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.white,
          borderColor: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 34,
          height: 34,
          minWidth: 34,
          minHeight: 34,
          maxWidth: 34,
          maxHeight: 34,
        };
      case 'large':
        return {
          width: 38,
          height: 38,
          minWidth: 38,
          minHeight: 38,
          maxWidth: 38,
          maxHeight: 38,
        };
      case 'medium':
      default:
        return {
          width: 46,
          height: 46,
          minWidth: 46,
          minHeight: 46,
          maxWidth: 46,
          maxHeight: 46,
        };
    }
  };

  const buttonColors = getButtonColors();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderRadius: '100%',
          ...buttonColors,
          ...sizeStyles,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={buttonColors.textColor}
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 44, // Minimum touch target size
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
