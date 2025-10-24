// MUST be first
import "react-native-gesture-handler";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Dimensions, StyleSheet } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/src/store/authStore";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Mulish: require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
    "Mulish-ExtraBold": require("../assets/fonts/Mulish-ExtraBold.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
  });


  const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await loadAuthFromStorage(); // load tokens from SecureStore
      setAuthLoaded(true);

      const { width } = Dimensions.get("window");
      if (width < 600) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        await ScreenOrientation.unlockAsync();
      }
    };
    initApp();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <StatusBar style="dark" backgroundColor="#ffffff" />
          {/* Always render Slot */}
          <Slot />

          {/* Overlay loader while fonts load */}
          {!fontsLoaded && (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                { justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
              ]}
            >
              <ActivityIndicator size="large" color="#107483" />
            </View>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
