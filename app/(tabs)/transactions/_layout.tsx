import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme';

export default function TransactionsLayout() {
  const { theme } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
  );
}

