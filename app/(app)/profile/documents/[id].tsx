import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PatientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#107483" />
      </TouchableOpacity>

      <Text style={styles.title}>Patient Details</Text>

      <View style={styles.card}>
        <Text style={styles.info}>ID: {id}</Text>
        <Text style={styles.info}>Name: Example Patient</Text>
        <Text style={styles.info}>Age: 35</Text>
        <Text style={styles.info}>Diagnosis: Hypertension</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
    padding: 5, // gives small tap area without border
  },

  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, color: "#107483" },

  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 16,
  },
  info: { fontSize: 16, marginBottom: 6 },
});
