import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale, scale, moderateScale } from "react-native-size-matters";
import HorizontalLine from "@/src/components/common-components/HorizontalLine";
import SimpleSearchBar from "@/src/components/common-components/SimpleSearchBar";

const patients = [
  { id: "1", name: "Rahul Sharma", age: 30, gender: "Male", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "2", name: "Sneha Patel", age: 26, gender: "Female", photo: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: "3", name: "Arjun Mehta", age: 42, gender: "Male", photo: "https://randomuser.me/api/portraits/men/78.jpg" },
];

export default function DocumentsScreen() {
  const router = useRouter();

  const handleSearch = (text: string) => {
    console.log("User searched:", text);
  };

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#22466D" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Patients</Text>

      <HorizontalLine color="#C2D5D8" thickness={1} margin={verticalScale(24)} />

      <View style={styles.searchBar}>

      <SimpleSearchBar
        placeholder="Search patients..."
        onChangeText={handleSearch}
      />
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/profile/documents/${item.id}`)}
          >
            <Image source={{ uri: item.photo }} style={styles.photo} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.age} yrs • {item.gender}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(20), backgroundColor: "#fff" },
  backButton: {
    marginBottom: verticalScale(32),
    alignSelf: "flex-start",
  },
  title: { fontSize: 22, fontWeight: "600", color: "#000" },
  searchBar: {
    marginBottom: verticalScale(24),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7F1F3",
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderRadius: 12,
    marginBottom: 12,
  },
  photo: {
    width: scale(36),
    height: scale(36),
    borderRadius: 27.5,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#CFE7EA",
  },
  infoContainer: {
    flex: 1,
    display: "flex",
    gap: verticalScale(8),
  },
  name: { fontSize: moderateScale(16), fontFamily: "Mulish-Semibold", color: "#000000" },
  details: { fontSize: moderateScale(14), fontFamily: "Mulish-Regular",color: "#575757" },
});
