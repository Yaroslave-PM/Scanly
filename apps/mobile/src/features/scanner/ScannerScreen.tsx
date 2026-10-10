import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { catalogKeys, fetchByBarcode } from '@/features/catalog/api';
import { ApiError } from '@/shared/api/client';
import { colors, radii, spacing, typography } from '@/shared/theme';
import { Button, StateView } from '@/shared/ui';

type ScanState =
  | { kind: 'scanning' }
  | { kind: 'manual' }
  | { kind: 'searching'; code: string }
  | { kind: 'not-found'; code: string }
  | { kind: 'error'; code: string; message: string };

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e'] as const;

export function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScanState>({ kind: 'scanning' });
  const [torch, setTorch] = useState(false);
  const [manualCode, setManualCode] = useState('');
  // Камера присылает один и тот же код много раз в секунду: обрабатываем только первый.
  const busy = useRef(false);

  const lookup = useCallback(
    async (code: string) => {
      busy.current = true;
      setState({ kind: 'searching', code });
      try {
        const card = await fetchByBarcode(code);
        queryClient.setQueryData(catalogKeys.product(card.product.id), card);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace({ pathname: '/product/[id]', params: { id: card.product.id } });
      } catch (error) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        if (error instanceof ApiError && error.isNotFound) setState({ kind: 'not-found', code });
        else setState({ kind: 'error', code, message: error instanceof Error ? error.message : 'Ошибка' });
      }
    },
    [queryClient],
  );

  const onScanned = useCallback(
    ({ data }: BarcodeScanningResult) => {
      if (busy.current) return;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      void lookup(data);
    },
    [lookup],
  );

  const reset = () => {
    busy.current = false;
    setManualCode('');
    setState({ kind: 'scanning' });
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!permission) return <View style={styles.dark} />;

  if (!permission.granted) {
    return (
      <View style={[styles.light, { paddingTop: insets.top }]}>
        <CloseButton onPress={close} dark />
        <StateView
          icon="camera-outline"
          title="Нужен доступ к камере"
          text="Камера нужна только чтобы считать штрихкод. Фото и видео никуда не отправляются."
        >
          {permission.canAskAgain ? (
            <Button title="Разрешить камеру" onPress={requestPermission} />
          ) : (
            <Button title="Открыть настройки" onPress={() => Linking.openSettings()} />
          )}
          <Button title="Ввести код вручную" variant="ghost" onPress={() => setState({ kind: 'manual' })} />
        </StateView>
        {state.kind === 'manual' ? <ManualEntry {...{ manualCode, setManualCode, lookup, reset }} /> : null}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.dark} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
        onBarcodeScanned={state.kind === 'scanning' ? onScanned : undefined}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <CloseButton onPress={close} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={torch ? 'Выключить фонарик' : 'Включить фонарик'}
          onPress={() => setTorch((t) => !t)}
          style={[styles.roundButton, torch && styles.roundButtonActive]}
        >
          <Ionicons name={torch ? 'flashlight' : 'flashlight-outline'} size={22} color={torch ? colors.deepGreen : colors.white} />
        </Pressable>
      </View>

      <View style={styles.frameArea} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>
          {state.kind === 'scanning' ? 'Наведите камеру на штрихкод' : ' '}
        </Text>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        {state.kind === 'scanning' ? (
          <Button title="Ввести код вручную" variant="ghost" onPress={() => setState({ kind: 'manual' })} />
        ) : state.kind === 'manual' ? (
          <ManualEntry {...{ manualCode, setManualCode, lookup, reset }} />
        ) : state.kind === 'searching' ? (
          <View style={styles.searching}>
            <ActivityIndicator color={colors.green} />
            <Text style={styles.sheetTitle}>Ищем товар</Text>
            <Text style={styles.sheetText}>{state.code}</Text>
          </View>
        ) : state.kind === 'not-found' ? (
          <View style={styles.sheetBody}>
            <Text style={styles.sheetTitle}>Товар не найден</Text>
            <Text style={styles.sheetText}>
              Кода {state.code} пока нет в нашей базе. Попробуйте найти товар по названию.
            </Text>
            <Button title="Найти по названию" onPress={() => router.replace('/search')} />
            <Button title="Сканировать ещё" variant="ghost" onPress={reset} />
          </View>
        ) : (
          <View style={styles.sheetBody}>
            <Text style={styles.sheetTitle}>Нет связи</Text>
            <Text style={styles.sheetText}>{state.message}. Проверьте интернет и попробуйте ещё раз.</Text>
            <Button title="Повторить" onPress={() => lookup(state.code)} />
            <Button title="Сканировать ещё" variant="ghost" onPress={reset} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function CloseButton({ onPress, dark }: { onPress: () => void; dark?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Закрыть"
      onPress={onPress}
      style={[styles.roundButton, dark && styles.roundButtonLight]}
    >
      <Ionicons name="close" size={24} color={dark ? colors.deepGreen : colors.white} />
    </Pressable>
  );
}

function ManualEntry({
  manualCode,
  setManualCode,
  lookup,
  reset,
}: {
  manualCode: string;
  setManualCode: (v: string) => void;
  lookup: (code: string) => Promise<void>;
  reset: () => void;
}) {
  const digits = manualCode.replace(/\D/g, '');
  const valid = digits.length === 8 || digits.length === 12 || digits.length === 13;
  return (
    <View style={styles.sheetBody}>
      <Text style={styles.sheetTitle}>Код под штрихкодом</Text>
      <TextInput
        autoFocus
        value={manualCode}
        onChangeText={setManualCode}
        keyboardType="number-pad"
        maxLength={14}
        placeholder="4600000000000"
        placeholderTextColor={colors.muted}
        style={styles.codeInput}
        onSubmitEditing={() => valid && lookup(digits)}
      />
      <Button title="Найти" disabled={!valid} onPress={() => lookup(digits)} />
      <Button title="Назад к камере" variant="ghost" onPress={reset} />
    </View>
  );
}

const styles = StyleSheet.create({
  dark: { flex: 1, backgroundColor: colors.deepGreen },
  light: { flex: 1, backgroundColor: colors.cream, padding: spacing.sm },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7, 19, 4, 0.6)',
  },
  roundButtonActive: { backgroundColor: colors.lime },
  roundButtonLight: { backgroundColor: colors.white },
  frameArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  frame: { width: 280, height: 160, borderRadius: radii.md, borderWidth: 3, borderColor: colors.lime },
  hint: { ...typography.bodyStrong, color: colors.white },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.md,
  },
  sheetBody: { gap: spacing.xs },
  searching: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  sheetTitle: { ...typography.heading, color: colors.deepGreen },
  sheetText: { ...typography.body, color: colors.muted, marginBottom: spacing.xs },
  codeInput: {
    ...typography.title,
    color: colors.deepGreen,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.sm,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
});
