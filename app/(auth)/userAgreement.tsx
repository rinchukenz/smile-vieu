import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Doc from "../../assets/icons/doc.svg";
import Eye from "../../assets/icons/eye.svg";
import Lock from "../../assets/icons/lock.svg";
import CheckBox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/store/authStore";

export default function UserAgreement() {
  const [isChecked, setIsChecked] = useState(false);
  const [footerH, setFooterH] = useState(0); // footer height
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.userId);

  console.log("Token and userId", accessToken, userId)

  const handleContinue = () => {
    router.push("/(auth)/basicDetails");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header padded */}
      <View style={styles.pagePadding}>
        <Text style={styles.userText}>UserAgreement</Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.pagePadding,          // 👈 consistent horizontal padding
            styles.container,
            { paddingBottom: footerH + verticalScale(16) }, // make room for footer
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.secondContainer}>
            {/* Terms of Service */}
            <View style={styles.subtitleContainer}>
              <Doc width={scale(20)} height={scale(20)} />
              <Text style={styles.subtitleText}>Terms of Service</Text>
            </View>
            <Text style={styles.termsText}>
              Welcome to our application. By using our service, you agree to be
              bound by these terms and conditions. These terms apply to your use
              of our platform and all related services.
            </Text>
            <Text style={styles.termsText}>
              Our service provides you with access to a comprehensive platform
              designed to enhance your productivity and streamline your
              workflow. You are responsible for maintaining the confidentiality
              of your account credentials.
            </Text>
            <Text style={styles.termsText}>
              We reserve the right to modify these terms at any time. Continued
              use of our service following any changes constitutes acceptance of
              those changes.
            </Text>

            {/* Privacy policy */}
            <View style={styles.subtitleContainer}>
              <Eye width={scale(20)} height={scale(20)} />
              <Text style={styles.subtitleText}>Privacy Policy</Text>
            </View>
            <Text style={styles.termsText}>
              We are committed to protecting your privacy and ensuring the
              security of your personal information. This policy explains how we
              collect, use, and safeguard your data.
            </Text>
            <Text style={styles.termsText}>
              We collect information that you provide directly to us, such as
              when you create an account, use our services, or contact us for
              support. This may include your name, email address, and usage
              patterns.
            </Text>
            <Text style={styles.termsText}>
              We collect information that you provide directly to us, such as
              when you create an account, use our services, or contact us for
              support. This may include your name, email address, and usage
              patterns.
            </Text>

            {/* Data Security */}
            <View style={styles.subtitleContainer}>
              <Lock width={scale(20)} height={scale(20)} />
              <Text style={styles.subtitleText}>Data Security</Text>
            </View>
            <Text style={styles.termsText}>
              Your data security is our top priority. We employ advanced
              encryption technologies and follow best practices to ensure your
              information remains secure and confidential.
            </Text>
            <Text style={styles.termsText}>
              All data transmissions are encrypted using SSL/TLS protocols, and
              we regularly conduct security audits to identify and address
              potential vulnerabilities.
            </Text>
            <Text style={styles.termsText}>
              In the unlikely event of a security incident, we will notify
              affected users promptly and take all necessary steps to mitigate
              any potential impact.
            </Text>

            {/* Additional Terms */}
            <View style={styles.additionalContainer}>
              <Text style={styles.subtitleText}>Additional Terms</Text>
              <View style={styles.additionalTermsContainer}>
                <Text style={styles.termsText}>
                  • You must be at least 18 years old to use this service
                </Text>
                <Text style={styles.termsText}>
                  • You agree not to use the service for any illegal or
                  unauthorized purpose
                </Text>
                <Text style={styles.termsText}>
                  • We may suspend or terminate accounts that violate these
                  terms
                </Text>
                <Text style={styles.termsText}>
                  • These terms are governed by applicable law in your
                  jurisdiction
                </Text>
                <Text style={styles.termsText}>
                  • Any disputes will be resolved through a binding arbitration
                </Text>
              </View>
            </View>

            {/* Line */}
            <View style={styles.line} />

            <View style={styles.contactContainer}>
              <Text style={styles.contactContainerText}>
                Last updated: September 19, 2025{" "}
              </Text>
              <Text style={styles.contactContainerText}>Version 2.1</Text>
              <Text style={styles.contactContainerText}>
                Contact us: legal@company.com{" "}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer padded separately (same padding as content) */}
        <View style={styles.pagePadding}>
          <View
            style={styles.declarationContainer}
            onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
          >
            <View style={styles.checkBox}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#107483" : undefined}
                style={styles.checkBoxInner}
              />
              <Text style={styles.declarationText}>
                By continuing, I agree to the{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and
                acknowledge the <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, !isChecked && { opacity: 0.6 }]}
              disabled={!isChecked}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    // 👇 we moved horizontal padding out to `pagePadding`
  },

  // Reusable 16px horizontal padding used for header, scroll content, and footer
  pagePadding: {
    paddingHorizontal: scale(16),
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: verticalScale(24),
  },

  userText: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
    color: "#000000",
  },

  secondContainer: {
    width: "100%",
    gap: verticalScale(20),
  },

  subtitleContainer: {
    flexDirection: "row",
    gap: scale(10),
  },

  subtitleText: {
    fontSize: moderateScale(16),
    fontFamily: "Mulish-SemiBold",
    color: "#000000",
  },

  termsText: {
    fontFamily: "Mulish-Regular",
    fontSize: moderateScale(16),
    color: "#575757",
  },

  additionalContainer: {},
  additionalTermsContainer: {
    marginTop: verticalScale(24),
    gap: verticalScale(8),
  },

  line: {
    height: 2,
    backgroundColor: "#C2D5D8",
    width: "100%",
  },

  contactContainer: {
    gap: verticalScale(8),
  },
  contactContainerText: {
    color: "#575757",
    fontSize: moderateScale(14),
  },

  declarationContainer: {
    paddingVertical: verticalScale(12),
    gap: verticalScale(20),
    backgroundColor: "#fff",
    // 👈 no horizontal padding here; it's provided by `pagePadding`
  },

  checkBox: {
    flexDirection: "row",
    alignItems: "center", // top-align with first line of text
    gap: 10,           // space between checkbox and text
  },

  checkBoxInner: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderColor: "#C2D5D8",
    borderWidth: 1,
    borderRadius: 5,
  },

  declarationText: {
    flex: 1, // ensures wrapped lines align under the text, not under the checkbox
    fontFamily: "Mulish-Medium",
    fontSize: moderateScale(14),
  },

  linkText: {
    color: "#107483",
    fontFamily: "Mulish-Medium",
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
});
