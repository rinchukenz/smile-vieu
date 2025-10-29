import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import BackArrow from "../../assets/images/back-arrow.svg";
import OtpIcon from "../../assets/icons/otp-icon.svg";
import { verifyOtp, resendOtp } from "@/src/api/auth";
import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";

export default function Otp() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<RNTextInput[]>([]);
  const router = useRouter();

  // Correct way to get requestId from search params
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  //console.log("Request ID:", requestId);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) inputRefs.current[index + 1]?.focus();
      else if (!text && index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!requestId) {
      Alert.alert("Error", "Request ID missing. Please go back and try again.");
      return;
    }

    setOtp(Array(6).fill(""));
    setTimer(30);
    inputRefs.current[0]?.focus();

    try {
      const res = await resendOtp(requestId);
      console.log("Resend OTP Response:", res);
      Alert.alert("Success", "OTP resent successfully");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", "Failed to resend OTP. Try again.");
    }
  };

  // Dummy Function
  const dummyGo = () => {
    router.push("/(auth)/userAgreement");
  }

  const handleContinue = async () => {
    if (!requestId) {
      Alert.alert("Error", "Request ID missing. Please go back and try again.");
      return;
    }

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP");
      return;
    }

    try {
      console.log("RequestId and otp ", requestId, enteredOtp);
      const res = await verifyOtp(requestId, enteredOtp);
      console.log("Verify OTP Response:", res);

      const setAuth = useAuthStore.getState().setAuth;
      await setAuth({
        userId: res.userId,
        accessToken: res.tokens.accessToken,
        refreshToken: res.tokens.refreshToken,
      });

      router.push("/(auth)/userAgreement"); // Navigate after success
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", "OTP verification failed. Try again.");
    }
  };

  const handleBackPress = () => router.back();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={scale(24)} color="#22466D" />      
      </TouchableOpacity>

      {/* OTP Icon */}
      <View style={styles.otpIcon}>
        <OtpIcon width={moderateScale(70)} height={moderateScale(70)} />
      </View>

      {/* Title & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Enter 6 digit Code</Text>
        <Text style={styles.subtitle}>
          We have sent a 6 digit code to your registered mobile number
        </Text>
      </View>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.otpInput}
          />
        ))}
      </View>

      {/* Timer + Resend */}
      <View style={styles.timerContainer}>
        <Text style={styles.didntReceiveCodeText}>Didn't receive code?</Text>
        <View style={styles.resendOtpContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend - 00:{timer < 10 ? `0${timer}` : timer}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={dummyGo}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: verticalScale(60),
    left: scale(16),
    zIndex: 1,
  },
  textContainer: { gap: verticalScale(8), marginBottom: verticalScale(32) },
  title: {
    fontSize: moderateScale(18),
    fontFamily: "Mulish-Bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
    color: "#7B7B7B",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(12),
    alignItems: "center",
    marginBottom: verticalScale(24),

  },
  otpIcon: { alignItems: "center", marginBottom: verticalScale(24) },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "#7B7B7B",
    width: moderateScale(45),
    fontSize: moderateScale(24),
    fontFamily: "Mulish-Bold",
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    gap: verticalScale(8),
    marginBottom: verticalScale(64),
  },
  resendOtpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  didntReceiveCodeText: { fontSize: moderateScale(14), color: "#7B7B7B" },
  timerText: { color: "#7B7B7B", fontSize: moderateScale(14) },
  resendText: {
    color: "#22466D",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  button: {
    backgroundColor: "#107483",
    paddingVertical: verticalScale(14),
    borderRadius: scale(8),
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
