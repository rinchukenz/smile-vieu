import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen name="my-details" options={{ title: "My Details" }} />
      <Stack.Screen name="documents" options={{ headerShown: false }} />
      <Stack.Screen name="consultation" options={{ title: "Previous Consultations" }} />
    </Stack>
  );
}
