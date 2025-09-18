import LoginCarousel from "@/src/components/authComponents/LoginCarousel";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Illustration from "../../assets/images/illustartion.svg";
import LoginLogo from "../../assets/images/newlogo1.svg";

export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View>
            <LoginLogo width={scale(228)} height={scale(68)} />
          </View>

          {/* Illustration */}
          <Illustration width={scale(399)} height={verticalScale(202)} />

          {/* Intro Text */}
          {/* <View style={styles.textWrapper}>
            <Text style={styles.title}>
              Simplify your dental practice with smart scheduling and patient
              management.
            </Text>
            <Text style={styles.subtitle}>
              Streamline appointments, manage patient records, and grow your
              practice with our comprehensive solution.
            </Text>
          </View>

          <Dots width={scale(50)} height={verticalScale(10)} /> */}

          {/* Carousel */}
          <LoginCarousel />

          {/* Form Section */}
          <View style={styles.form}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              placeholder="Enter your email id or phone number"
              placeholderTextColor="#7B7B7B"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(auth)/otp")}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.link} onPress={() => router.push("/(auth)/register")}>
            Not a Member? Click here
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: verticalScale(24),
  },
  textWrapper: {
    alignItems: "center",
    gap: verticalScale(8),
  },
  title: {
    fontSize: moderateScale(16),
    fontFamily: "Mulish-Bold",
    textAlign: "center",
    color: "#000000",
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
    textAlign: "center",
    color: "#7B7B7B",
  },
  form: {
    width: "100%",
    gap: verticalScale(8),
  },
  label: {
    fontSize: moderateScale(14),
    color: "#000000",
    fontFamily: "Mulish-Bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    padding: scale(12),
    fontSize: moderateScale(14),
    backgroundColor: "#FFFFFF",
    color: "#7B7B7B",
    fontFamily: "Mulish-Regular",
  },
  button: {
    backgroundColor: "#107483",
    paddingVertical: verticalScale(14),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-Bold",
  },
  link: {
    color: "#7B7B7B",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
  },
});
