import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radii, sizes, spacing } from '../theme';

type Props = Pick<TextInputProps, 'value' | 'onChangeText' | 'autoFocus' | 'onSubmitEditing' | 'placeholder'> & {
  onClear?: () => void;
};

/** Поиск-таблетка высотой 56. */
export function SearchField({ value, onClear, placeholder = 'Найти продукт или бренд', ...rest }: Props) {
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: sizes.field,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, fontFamily: 'Onest_400Regular', fontSize: 15, color: colors.ink, paddingVertical: 0 },
});
