import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {useTheme} from '../contexts/ThemeContext';

interface ThemeAwareCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

const ThemeAwareCard: React.FC<ThemeAwareCardProps> = ({
  title,
  subtitle,
  onPress,
  children,
}) => {
  const {colors} = useTheme();

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outline,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.onSurface,
            },
          ]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.onSurfaceVariant,
              },
            ]}>
            {subtitle}
          </Text>
        )}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    marginTop: 8,
  },
});

export default ThemeAwareCard; 