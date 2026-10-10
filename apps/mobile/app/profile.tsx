import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  makeStyles,
  radii,
  setThemePreference,
  spacing,
  typography,
  useThemePreference,
  type ThemePreference,
} from '@/shared/theme';
import { Card, IconButton } from '@/shared/ui';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.xs }]}>
      <IconButton icon="chevron-back" label="Назад" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Я</Text>
        </View>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.muted}>
          Вход по почте, VK ID и Яндекс ID появится в следующем обновлении. Тогда избранное и отзывы будут с вами на любом телефоне.
        </Text>
      </View>
      <Card>
        <Text style={styles.cardTitle}>Оформление</Text>
        <ThemeSwitch />
      </Card>
      <Card>
        <Text style={styles.cardTitle}>О данных</Text>
        <Text style={styles.muted}>
          Карточки товаров частично из Open Food Facts, магазины из OpenStreetMap. Обе базы распространяются по лицензии ODbL.
        </Text>
      </Card>
    </View>
  );
}

const THEME_OPTIONS: [ThemePreference, string][] = [
  ['system', 'Как в телефоне'],
  ['light', 'Светлая'],
  ['dark', 'Тёмная'],
];

function ThemeSwitch() {
  const styles = useStyles();
  const value = useThemePreference();
  return (
    <View style={styles.segment} accessibilityRole="radiogroup">
      {THEME_OPTIONS.map(([key, label]) => (
        <Pressable
          key={key}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === key }}
          onPress={() => setThemePreference(key)}
          style={[styles.segmentItem, value === key && styles.segmentOn]}
        >
          <Text style={[styles.segmentText, value === key && styles.segmentTextOn]} numberOfLines={1}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.gutter, gap: spacing.lg },
    head: { alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: radii.pill,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    avatarText: { fontFamily: 'Onest_600SemiBold', fontSize: 32, color: colors.onPrimary },
    title: { ...typography.title, color: colors.ink },
    cardTitle: { ...typography.subheading, color: colors.ink, marginBottom: spacing.xxs },
    muted: { ...typography.body, color: colors.muted, textAlign: 'left' },
    segment: { flexDirection: 'row', padding: 4, gap: 4, marginTop: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.bg },
    segmentItem: { flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xs },
    segmentOn: { backgroundColor: colors.primary },
    segmentText: { ...typography.caption, fontFamily: 'Onest_500Medium', color: colors.ink },
    segmentTextOn: { fontFamily: 'Onest_600SemiBold', color: colors.onPrimary },
  }),
);
