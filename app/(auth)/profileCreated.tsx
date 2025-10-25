import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import successAnim from "../../assets/animations/success.json"; // your Lottie file

const ProfileCreated = () => {
  const lottieRef = useRef<LottieView>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        {/* Lottie Animation */}
        <LottieView
          ref={lottieRef}
          source={successAnim}
          autoPlay
          loop={false}
          style={{ width: scale(300), height: scale(300), alignSelf: "center" }}
        />

        <Text style={styles.text}>Profile Created</Text>
        <Text style={styles.subtext}>
          Great job, Alex! Your profile has been successfully created. You're
          all set to get started.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cta, styles.continue]}
          onPress={() => {
            // navigate to next screen here
          }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileCreated;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: scale(16) },
  card: {
    flex: 1,
    justifyContent: "center",
  },
  cta: {
    height: verticalScale(48),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  continue: {
    backgroundColor: "#0B7C84",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: moderateScale(14),
  },
  footer: {
    marginTop: "auto",
    paddingVertical: verticalScale(16),
    gap: verticalScale(12),
  },
  text: {
    marginTop: verticalScale(24),
    color: "#000000",
    fontFamily: "Mulish-Bold",
    fontSize: moderateScale(20),
    textAlign: "center",
  },
  subtext: {
    marginTop: verticalScale(8),
    fontFamily: "Mulish-Regular",
    fontSize: moderateScale(14),
    color: "#000000",
    textAlign: "center",
  },
});
