import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import {colors} from '../theme/colors';

interface TextInputProps extends RNTextInputProps {}

const TextInput = ({...props}: TextInputProps) => {
  return (
    <RNTextInput
      style={styles.input}
      {...props}
      placeholderTextColor={colors.textSecondary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
});

export default TextInput;
