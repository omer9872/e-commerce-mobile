import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import ThemeAwareCard from '../../components/ThemeAwareCard';

const ThemeSettingsScreen: React.FC = () => {
  const {theme, setTheme, colors, isDark} = useTheme();

  const themeOptions = [
    {
      id: 'light' as const,
      title: 'Light Theme',
      description: 'Always use light colors',
      icon: 'light-mode',
    },
    {
      id: 'dark' as const,
      title: 'Dark Theme',
      description: 'Always use dark colors',
      icon: 'dark-mode',
    },
    {
      id: 'system' as const,
      title: 'System Default',
      description: 'Follow device settings',
      icon: 'brightness-auto',
    },
  ];

  const handleThemeSelect = async (selectedTheme: typeof theme) => {
    await setTheme(selectedTheme);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.onSurface,
              },
            ]}>
            Theme Settings
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.onSurfaceVariant,
              },
            ]}>
            Choose your preferred appearance
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.onSurface,
              },
            ]}>
            Current Theme
          </Text>
          <ThemeAwareCard
            title={`${themeOptions.find(t => t.id === theme)?.title} (Active)`}
            subtitle={themeOptions.find(t => t.id === theme)?.description}>
            <View style={styles.currentThemeInfo}>
              <Text
                style={[
                  styles.currentThemeText,
                  {
                    color: colors.onSurfaceVariant,
                  },
                ]}>
                Currently using: {isDark ? 'Dark' : 'Light'} mode
              </Text>
            </View>
          </ThemeAwareCard>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.onSurface,
              },
            ]}>
            Theme Options
          </Text>
          {themeOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.themeOption,
                {
                  backgroundColor: colors.surface,
                  borderColor: theme === option.id ? colors.primary : colors.outline,
                },
              ]}
              onPress={() => handleThemeSelect(option.id)}
              activeOpacity={0.7}>
              <View style={styles.themeOptionContent}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={theme === option.id ? colors.primary : colors.onSurfaceVariant}
                />
                <View style={styles.themeOptionText}>
                  <Text
                    style={[
                      styles.themeOptionTitle,
                      {
                        color: colors.onSurface,
                      },
                    ]}>
                    {option.title}
                  </Text>
                  <Text
                    style={[
                      styles.themeOptionDescription,
                      {
                        color: colors.onSurfaceVariant,
                      },
                    ]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              {theme === option.id && (
                <Icon
                  name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.onSurface,
              },
            ]}>
            Quick Toggle
          </Text>
          <View style={styles.quickToggleContainer}>
            <ThemeToggle showLabel size="large" />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.onSurface,
              },
            ]}>
            Preview
          </Text>
          <ThemeAwareCard
            title="Sample Card"
            subtitle="This is how components will look with the current theme">
            <Text
              style={[
                styles.previewText,
                {
                  color: colors.onSurfaceVariant,
                },
              ]}>
              This card demonstrates the current theme colors. The background,
              text, and borders will automatically adjust based on your theme
              selection.
            </Text>
          </ThemeAwareCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  currentThemeInfo: {
    marginTop: 8,
  },
  currentThemeText: {
    fontSize: 14,
  },
  themeOption: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  quickToggleContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ThemeSettingsScreen; 