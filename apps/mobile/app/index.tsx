import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';
import { Button, Card, Chip, Price, Rating } from '@/shared/ui';

/** Витрина UI-кита этапа 0. Заменится главным экраном на этапе 7. */
export default function UiKitShowcase() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.display}>Scanly</Text>
      <Text style={styles.lead}>Навёл камеру и понял, брать или нет.</Text>
      <Button title="Сканировать товар" />
      <Button title="Найти вручную" variant="ghost" />
      <Card>
        <View style={styles.gap}>
          <Chip label="Реклама" tone="ad" />
          <Text style={styles.heading}>Гречка ядрица 800 г</Text>
          <Rating value={4.3} count={218} />
          <Price amount={129.9} />
          <View style={styles.row}>
            <Chip label="Вкусно" tone="positive" />
            <Chip label="Долго варить" tone="negative" />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.sm, paddingTop: spacing.xxl, gap: spacing.sm },
  display: { ...typography.display, color: colors.deepGreen },
  lead: { ...typography.body, color: colors.muted, marginBottom: spacing.sm },
  heading: { ...typography.heading, color: colors.deepGreen },
  gap: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.xs },
});
