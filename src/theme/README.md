# Theme System

This directory contains the theming system for the Loyalty App Mobile application.

## Overview

The theme system provides a comprehensive solution for managing light and dark themes throughout the application. It includes:

- **ThemeContext**: React Context for managing theme state
- **Color Schemes**: Predefined color palettes for light and dark themes
- **Theme Components**: Reusable components that automatically adapt to the current theme
- **Theme Toggle**: Component for switching between themes

## Features

- **Three Theme Modes**: Light, Dark, and System (follows device settings)
- **Persistent Storage**: Theme preference is saved to AsyncStorage
- **Automatic Adaptation**: Components automatically adjust colors based on theme
- **System Integration**: Respects device theme settings when in "system" mode
- **Type Safety**: Full TypeScript support with proper type definitions

## Usage

### Basic Usage

```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { colors, isDark, theme, setTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.onSurface }}>
        Current theme: {theme}
      </Text>
    </View>
  );
};
```

### Theme Toggle Component

```tsx
import ThemeToggle from '../components/ThemeToggle';

// Simple toggle button
<ThemeToggle />

// With label
<ThemeToggle showLabel />

// Different sizes
<ThemeToggle size="small" />
<ThemeToggle size="medium" />
<ThemeToggle size="large" />
```

### Creating Theme-Aware Components

```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyCard = ({ title, children }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.outline,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      }}>
      <Text style={{ color: colors.onSurface, fontSize: 18 }}>
        {title}
      </Text>
      {children}
    </View>
  );
};
```

## Color Palette

### Light Theme Colors
- `primary`: Primary brand color
- `primaryLight`: Light variant of primary color
- `secondary`: Secondary brand color
- `background`: Main background color
- `surface`: Card/surface background color
- `surfaceVariant`: Alternative surface color
- `text`: Primary text color
- `textSecondary`: Secondary text color
- `onSurface`: Text color on surface
- `onSurfaceVariant`: Secondary text color on surface
- `border`: Border color
- `outline`: Outline color
- `outlineVariant`: Alternative outline color
- `error`: Error color
- `success`: Success color
- `warning`: Warning color
- `shadow`: Shadow color
- `scrim`: Overlay color

### Dark Theme Colors
The dark theme provides the same color properties but with appropriate dark mode values for better contrast and readability.

## Theme Context API

### Properties
- `theme`: Current theme mode ('light' | 'dark' | 'system')
- `isDark`: Boolean indicating if dark mode is active
- `colors`: Current theme's color palette
- `setTheme(theme)`: Function to change theme
- `toggleTheme()`: Function to cycle through themes

### Methods
- `setTheme(theme: Theme)`: Set a specific theme
- `toggleTheme()`: Toggle between light and dark themes

## Best Practices

1. **Always use the theme context**: Don't hardcode colors in components
2. **Use semantic color names**: Use `colors.onSurface` instead of `colors.text`
3. **Test both themes**: Ensure components look good in both light and dark modes
4. **Consider contrast**: Ensure sufficient contrast ratios for accessibility
5. **Use consistent spacing**: Maintain consistent spacing and sizing across themes

## Migration Guide

### From Legacy Colors
If you're migrating from the old color system:

```tsx
// Old way
import { colors } from '../theme/colors';
<View style={{ backgroundColor: colors.background }}>

// New way
import { useTheme } from '../contexts/ThemeContext';
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background }}>
```

### Legacy Support
The old `colors` object is still available as `legacyColors` for backward compatibility:

```tsx
import { legacyColors } from '../theme/colors';
```

## Examples

See the following files for examples:
- `ThemeSettingsScreen.tsx`: Complete theme settings interface
- `ThemeAwareCard.tsx`: Example of a theme-aware component
- `ThemeToggle.tsx`: Theme switching component

## Troubleshooting

### Theme not updating
- Ensure the component is wrapped in `ThemeProvider`
- Check that `useTheme()` is called within the provider
- Verify AsyncStorage permissions

### Colors not changing
- Make sure you're using `colors` from `useTheme()` hook
- Check that the color property exists in both light and dark themes
- Verify the component is re-rendering when theme changes

### Performance issues
- Avoid calling `useTheme()` in render loops
- Use `useMemo` for expensive theme-dependent calculations
- Consider using `useCallback` for theme-dependent event handlers 