import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { StatusBar } from "expo-status-bar"; // ✅ Add this

export default function TabsLayout() {
  return (
    <>
      {/* Default status bar for all tabs */}
      <StatusBar style="dark" backgroundColor="#fff" />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#107483",
            tabBarLabelStyle: { fontSize: moderateScale(12) },
            tabBarLabelPosition: "below-icon",
            tabBarStyle: {
              height: verticalScale(65),
              paddingTop: verticalScale(10),
            },
          }}
        >
          <Tabs.Screen
            name="home/index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={moderateScale(26)}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule/index"
            options={{
              title: "Schedule",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={moderateScale(26)}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="patients"
            options={{
              title: "Patients",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  size={moderateScale(26)}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat/index"
            options={{
              title: "Chat",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "chatbubble" : "chatbubble-outline"}
                  size={moderateScale(26)}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={moderateScale(26)}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // default background
  },
});
