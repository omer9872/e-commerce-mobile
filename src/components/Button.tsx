import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
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
          backgroundColor: isDisabled ? colors.surfaceVariant : colors.secondary,
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
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: 12,
          fontSize: 18,
          iconSize: 24,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const buttonColors = getButtonColors();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Icon
        name={icon}
        size={sizeStyles.iconSize}
        color={buttonColors.textColor}
        style={[
          iconPosition === 'left' ? styles.iconLeft : styles.iconRight,
        ]}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={buttonColors.textColor}
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && renderIcon()}
        <Text
          style={[
            styles.text,
            {
              color: buttonColors.textColor,
              fontSize: sizeStyles.fontSize,
            },
            textStyle,
          ]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.backgroundColor,
          borderColor: buttonColors.borderColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {renderContent()}
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