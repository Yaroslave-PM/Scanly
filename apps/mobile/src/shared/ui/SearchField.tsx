import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type Props = Pick<TextInputProps, 'value' | 'onChangeText' | 'autoFocus' | 'onSubmitEditing' | 'placeholder'> & {
  onClear?: () => void;
};

export function SearchField({ value, onClear, placeholder = 'Название, бренд или штрихкод', ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        {...rest}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value && onClear ? (
        <Pressable accessibilityLabel="Очистить" hitSlop={spacing.xs} onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 48,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
  },
  input: { flex: 1, ...typography.body, color: colors.deepGreen, paddingVertical: 0 },
});
