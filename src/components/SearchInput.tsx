import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../contexts/ThemeContext';
import { STYLING } from '@/style/const';

interface SearchInputProps extends Omit<TextInputProps, 'onChangeText'> {
  /** Current value of the search input */
  value: string;
  /** Callback fired when value changes (debounced) */
  onChangeText: (text: string) => void;
  /** Callback fired on submit/search button press */
  onSubmit?: () => void;
  /** Callback fired when clear button is pressed */
  onClear?: () => void;
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number;
  /** Custom container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Whether to show loading indicator */
  loading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  debounceDelay = 300,
  containerStyle,
  loading = false,
  placeholder,
  ...textInputProps
}) => {
  const {colors} = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Sync local value with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced change handler
  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new debounce timer
      debounceTimer.current = setTimeout(() => {
        onChangeText(text);
      }, debounceDelay);
    },
    [onChangeText, debounceDelay],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleClear = () => {
    setLocalValue('');
    
    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Immediately call onChangeText with empty string
    onChangeText('');
    onClear?.();
  };

  const handleSubmit = () => {
    // Clear pending debounce and immediately apply current value
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onChangeText(localValue);
    onSubmit?.();
  };

  const styles = getStyles(colors);

  return (
    <View style={[styles.container, containerStyle]}>
      <Icon
        name="magnify"
        size={20}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={localValue}
        onChangeText={handleChangeText}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        {...textInputProps}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Icon name="loading" size={16} color={colors.textSecondary} />
        </View>
      ) : (
        localValue.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: STYLING.borderRadius.md,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: '100%',
      color: colors.text,
      fontSize: 16,
      padding: 0,
    },
    clearButton: {
      padding: 4,
    },
    loadingContainer: {
      padding: 4,
    },
  });

export default SearchInput;
