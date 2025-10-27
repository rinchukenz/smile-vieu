import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function DocumentsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#107483" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      {/* Main patients list */}
      <Stack.Screen name="index" options={{ title: "Your Patients" }} />

      {/* Patient Details screen with a clean back arrow */}
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7} // smooth press effect
              style={{
                paddingHorizontal: 10,
                backgroundColor: "transparent", // no background
                shadowColor: "transparent", // no shadow
                elevation: 0, // no Android elevation
              }}
            >
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
