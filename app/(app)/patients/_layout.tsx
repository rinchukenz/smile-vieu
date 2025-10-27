import { Stack } from "expo-router";

export default function PatientsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#107483",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Patients",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Patient Details",
        }}
      />
    </Stack>
  );
}
