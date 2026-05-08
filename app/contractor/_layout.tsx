import { Stack } from "expo-router";

export default function ContractorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#F8FAFC",
        },
      }}
    />
  );
}