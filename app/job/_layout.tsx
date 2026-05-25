import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JobLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerStatusBarHeight: insets.top,
        headerStyle: {
          backgroundColor: "#F8FAFC",
        },
      }}
    />
  );
}
