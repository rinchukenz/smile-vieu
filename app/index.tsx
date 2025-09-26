import { Redirect } from "expo-router";

export default function Index() {
  // If your login screen is in a route group like app/(auth)/login.tsx,
  // include the group in the href:
  return <Redirect href="/(auth)/login" />; // or "/login" if that's your path
}
