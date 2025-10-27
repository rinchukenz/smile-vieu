import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function PatientDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Details</Text>
      <Text style={styles.text}>Patient ID: {id}</Text>
      {/* You can fetch more details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "600", color: "#107483" },
  text: { fontSize: 16, marginTop: 12 },
});
