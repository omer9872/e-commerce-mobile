import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {useTheme} from '../contexts/ThemeContext';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
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
  const {colors} = useTheme();

  const getButtonColors = () => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? colors.outline : colors.primary,
          textColor: isDisabled ? colors.onSurfaceVariant : colors.white,
          borderColor: isDisabled ? colors.outline : colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled
            ? colors.surfaceVariant
            : colors.secondary,
          textColor: isDisabled ? colors.onSurfaceVariant : colors.white,
          borderColor: isDisabled ? colors.surfaceVariant : colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: isDisabled ? colors.onSurfaceVariant : colors.primary,
          borderColor: isDisabled ? colors.outline : colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: isDisabled ? colors.onSurfaceVariant : colors.primary,
          borderColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: isDisabled ? colors.outline : colors.error,
          textColor: isDisabled ? colors.onSurfaceVariant : colors.white,
          borderColor: isDisabled ? colors.outline : colors.error,
        };
      case 'success':
        return {
          backgroundColor: isDisabled ? colors.outline : '#4CAF50',
          textColor: isDisabled ? colors.onSurfaceVariant : '#FFFFFF',
          borderColor: isDisabled ? colors.outline : '#4CAF50',
        };
      default:
        return {
          backgroundColor: isDisabled ? colors.outline : colors.primary,
          textColor: isDisabled ? colors.onSurfaceVariant : colors.white,
          borderColor: isDisabled ? colors.outline : colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 30,
          height: 30,
          minWidth: 30,
          minHeight: 30,
          maxWidth: 30,
          maxHeight: 30,
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
          backgroundColor: buttonColors.backgroundColor,
          borderColor: buttonColors.borderColor,
          borderRadius: '100%',
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
