import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Mulish: require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    // Keep Root Layout mounted, show a loader
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#107483" />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        {/* Slot renders all nested pages (login, register, etc.) */}
        <Slot />
      </View>
    </>
  );
}
