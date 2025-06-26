import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import {useTheme} from '../contexts/ThemeContext';

interface TextInputProps extends RNTextInputProps {}

const TextInput = ({...props}: TextInputProps) => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  return (
    <RNTextInput
      style={styles.input}
      {...props}
      placeholderTextColor={colors.textSecondary}
    />
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
  });

export default TextInput;
