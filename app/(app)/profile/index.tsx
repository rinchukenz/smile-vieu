import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import ProfilePicture from "../../../assets/images/pro2.svg";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Add logout logic here (like clearing tokens)
    router.replace("/(auth)/login"); // Example route
  };

  return (
    <View style={styles.container}>
      {/* 🧍‍♂️ Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.imageWrapper}>
          <ProfilePicture width={scale(90)} height={scale(90)} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>Dr. Phani Kiran</Text>
          <Text style={styles.email}>phanikiran@example.com</Text>
        </View>
      </View>

      {/* ⚙️ Options List */}
      <View style={styles.optionsContainer}>
        <OptionItem
          icon="person-circle-outline"
          label="Account"
          onPress={() => router.push("/(app)/profile/account")}
        />
        <OptionItem
          icon="id-card-outline"
          label="My Details"
          onPress={() => router.push("/(app)/profile/my-details")}
        />
        <OptionItem
          icon="document-text-outline"
          label="Patient Documents"
          onPress={() => router.push("/(app)/profile/documents")}
        />
        <OptionItem
          icon="chatbox-ellipses-outline"
          label="Previous Consultations"
          onPress={() => router.push("/(app)/profile/consultation")}
        />
      </View>

      {/* 🚪 Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={moderateScale(24)} color="#FF3B30" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🧩 Reusable Option Component */
function OptionItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={moderateScale(24)} color="#107483" />
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={moderateScale(24)} color="#ccc" />
    </TouchableOpacity>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(40),
  },
  profileSection: {
    flexDirection: "row",
    gap: scale(16),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(30),
    paddingLeft: moderateScale(10),
  },
  imageWrapper: {
    width: moderateScale(105),
    height: moderateScale(105),
    borderRadius: moderateScale(55),
    borderWidth: 2,
    borderColor: "#107483",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  details: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
    color: "#000",
  },
  email: {
    fontSize: moderateScale(16),
    color: "#000",
    fontFamily: "Mulish-Regular",
  },
  optionsContainer: {
    marginTop: verticalScale(20),
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionLabel: {
    marginLeft: moderateScale(12),
    fontSize: moderateScale(16),
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    position: "absolute",
    bottom: verticalScale(20),
    left: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: "#FF3B30",
    fontWeight: "600",
  },
});
