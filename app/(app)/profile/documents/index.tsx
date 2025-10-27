import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const patients = [
  { id: "1", name: "Rahul Sharma", age: 30 },
  { id: "2", name: "Sneha Patel", age: 26 },
  { id: "3", name: "Arjun Mehta", age: 42 },
];

export default function DocumentsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#107483" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Patients</Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/profile/documents/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>Age: {item.age}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
    padding: 4,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16, color: "#000000ff" },
  card: {
    backgroundColor: "#E7F1F3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "500", color: "#107483" },
  details: { fontSize: 14, color: "#555" },
});
