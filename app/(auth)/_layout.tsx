import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="userAgreement" />
      <Stack.Screen name="basicDetails" />
      <Stack.Screen name="moreDetails" />
      <Stack.Screen name="uploadProfilePicture" />
      <Stack.Screen name="profileCreated" />
    </Stack>
  );
}
