import React, { useState } from "react";
import { useRouter } from "expo-router";
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
import LoginCarousel from "@/src/components/authComponents/LoginCarousel";

export default function Login() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11,15}$/; // 91 + 10 digits = 12

    const trimmed = input.trim();

    if (emailRegex.test(trimmed)) {
      setError("");
      console.log("Sending Email:", trimmed);
      router.push("/(auth)/otp");
    } else if (phoneRegex.test(trimmed)) {
      const finalPhone = `+${trimmed}`;
      setError("");
      console.log("Sending Phone:", finalPhone);
      router.push("/(auth)/otp");
    } else {
      setError("Enter a valid email or phone number with country code");
    }
  };

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
          <LoginLogo width={scale(228)} height={scale(68)} />
          <Illustration width={scale(399)} height={verticalScale(202)} />

          <LoginCarousel />

          <View style={styles.form}>
            <Text style={styles.label}>Email or Phone Number</Text>

            <TextInput
              placeholder="Enter email or phone (e.g. +123456789012)"
              placeholderTextColor="#7B7B7B"
              style={[styles.input, { fontFamily: "Mulish-Regular" }]}
              value={input}
              onChangeText={setInput}
              keyboardType={/^\d/.test(input) ? "phone-pad" : "email-address"}
              autoCapitalize="none"
            />


            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={validate}>
              <Text style={styles.buttonText}>Continue </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/register")}
          >
            Not a Member? Click here
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: verticalScale(24),
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
    textAlign: "center",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  link: {
    color: "#7B7B7B",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
  },
  error: {
    color: "red",
    fontSize: moderateScale(12),
    fontFamily: "Mulish-Regular",
  },
});
