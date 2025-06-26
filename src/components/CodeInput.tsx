import React, {useState, useRef, useImperativeHandle, forwardRef} from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {useTheme} from '../contexts/ThemeContext';

export interface CodeInputRef {
  clear: () => void;
  focus: () => void;
  getValue: () => string;
  setValue: (code: string) => void;
}

interface CodeInputProps {
  length?: number;
  onCodeChange?: (code: string) => void;
  onCodeComplete?: (code: string) => void;
  style?: ViewStyle;
  cellStyle?: ViewStyle;
  cellTextStyle?: TextStyle;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'numeric';
  secureTextEntry?: boolean;
  editable?: boolean;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const CodeInput = forwardRef<CodeInputRef, CodeInputProps>(
  (
    {
      length = 6,
      onCodeChange,
      onCodeComplete,
      style,
      cellStyle,
      cellTextStyle,
      autoFocus = false,
      keyboardType = 'number-pad',
      secureTextEntry = false,
      editable = true,
      placeholder = '',
      error = false,
      disabled = false,
    },
    ref,
  ) => {
    const {colors} = useTheme();
    const [code, setCode] = useState('');
    const inputRefs = useRef<Array<RNTextInput | null>>([]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setCode('');
        inputRefs.current[0]?.focus();
      },
      focus: () => {
        inputRefs.current[0]?.focus();
      },
      getValue: () => code,
      setValue: (newCode: string) => {
        setCode(newCode.slice(0, length));
      },
    }));

    const handleCodeChange = (text: string, index: number) => {
      // Filter based on keyboard type
      let filteredText = text;
      if (keyboardType === 'number-pad' || keyboardType === 'numeric') {
        filteredText = text.replace(/[^0-9]/g, '');
      }

      // Update the code state
      const newCode = code.split('');
      newCode[index] = filteredText;
      const updatedCode = newCode.join('');
      setCode(updatedCode);

      // Call onChange callback
      onCodeChange?.(updatedCode);

      // Auto-focus to next input if a character was entered
      if (filteredText && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Call onComplete callback if code is complete
      if (updatedCode.length === length) {
        onCodeComplete?.(updatedCode);
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      // Handle backspace
      if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const getCellStyle = (index: number) => {
      const baseStyle = [
        styles.codeInput,
        {
          borderColor: error
            ? colors.error
            : code[index]
            ? colors.primary
            : colors.border,
          backgroundColor: disabled
            ? colors.surfaceVariant
            : colors.surface || colors.card,
          color: disabled ? colors.onSurfaceVariant : colors.onSurface || colors.text,
        },
        cellStyle,
      ];

      return baseStyle;
    };

    const styles = getStyles(colors);

    return (
      <View style={[styles.container, style]}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <RNTextInput
              key={index}
              ref={(ref: RNTextInput | null) => {
                inputRefs.current[index] = ref;
              }}
              style={[getCellStyle(index), cellTextStyle]}
              maxLength={1}
              keyboardType={keyboardType}
              value={code[index] || ''}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              autoFocus={autoFocus && index === 0}
              secureTextEntry={secureTextEntry}
              editable={editable && !disabled}
              placeholder={placeholder}
              placeholderTextColor={colors.onSurfaceVariant}
            />
          ))}
      </View>
    );
  },
);

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    codeInput: {
      width: 45,
      height: 55,
      borderWidth: 2,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      marginHorizontal: 4,
      // Shadow for iOS
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      // Elevation for Android
      elevation: 1,
    },
  });

CodeInput.displayName = 'CodeInput';

export default CodeInput; 