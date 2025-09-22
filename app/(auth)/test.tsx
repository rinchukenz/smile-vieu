import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
type Gender = "Male" | "Female" | "Others" | "";

export default function Test() {
  const [gender, setGender] = useState<Gender>(""); // 👈 type the state
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (value: Gender) => {
    // 👈 type the param
    setGender(value);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Profile Icon */}
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={40} color="#2a9d8f" />
      </View>

      {/* Heading */}
      <Text style={styles.title}>Enter your basic details</Text>
      <Text style={styles.subtitle}>
        Please provide your personal information to get started
      </Text>

      {/* Input Fields */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First name</Text>
        <TextInput style={styles.input} placeholder="Enter first name" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last name</Text>
        <TextInput style={styles.input} placeholder="Enter last name" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of birth</Text>
        <View style={styles.inputWithIcon}>
          <TextInput style={styles.inputFlex} placeholder="dd-mm-yyyy" />
          <Ionicons name="calendar-outline" size={22} color="#2a9d8f" />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity
          style={styles.inputWithIcon}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.inputFlex, { color: gender ? "#000" : "#aaa" }]}>
            {gender || "Select Gender"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#2a9d8f" />
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.disabledButton} disabled>
        <Text style={styles.disabledText}>Continue</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <BlurView intensity={30} tint="light" style={styles.modalOverlay}>
          <View style={styles.dropdown}>
            {(["Male", "Female", "Others"] as Gender[]).map(
              (
                option // 👈 typed array
              ) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 10,
  },
  avatar: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#e0f7f5",
    borderRadius: 50,
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputFlex: {
    fontSize: 14,
    flex: 1,
  },
  disabledButton: {
    marginTop: 20,
    backgroundColor: "#e0e0e0",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dropdown: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 80,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 16,
  },
});
