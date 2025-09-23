import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import BackArrow from "../../assets/images/back-arrow.svg";
import OtpIcon from "../../assets/icons/otp-icon.svg";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<RNTextInput[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move focus automatically
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      } else if (!text && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    setTimer(30);
    inputRefs.current[0]?.focus();
    //  call resend OTP API here
  };

  const handleContinue = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    //  call verify OTP API here
    router.push("/(auth)/userAgreement");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <BackArrow width={scale(24)} height={scale(24)} />
      </TouchableOpacity>

      {/* Otp-Icon */}
      <View style={styles.otpIcon}>
        <OtpIcon width={moderateScale(70)} height={moderateScale(70)} />
      </View>

      {/* Top Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Enter 4 digit Code</Text>
        <Text style={styles.subtitle}>
          We have sent a 4 digit code to the registered mobile number ****780
        </Text>
      </View>

      {/* OTP inputs */}
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
          <Text style={styles.timerText}>
            {timer > 0 && <Text style={{ color: "#C2D5D8" }}>Resend</Text>}
            {timer > 0 ? ` - 00:${timer < 10 ? `0${timer}` : timer}` : ""}
          </Text>

          {timer === 0 && (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
    position: "absolute", // This places it absolutely
    top: verticalScale(60), // You can adjust this value to fit your design
    left: scale(16), // This places it in the left corner
    zIndex: 1, // Ensures it stays on top of other content
  },
  textContainer: {
    gap: verticalScale(8),
    marginBottom: verticalScale(32),
  },
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
    gap: moderateScale(15),
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  otpIcon: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "#7B7B7B",
    width: scale(60),
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
  didntReceiveCodeText: {
    fontSize: moderateScale(14),
    color: "#7B7B7B",
  },
  timerText: {
    color: "#7B7B7B",
    fontSize: moderateScale(14),
  },
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
