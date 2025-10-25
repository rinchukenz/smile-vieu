import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

type Props = {
  qualification?: string;
  value?: string;
  onChange?: (val: string) => void;
};

const PLACEHOLDER = "__PLACEHOLDER__";

const SpecialityPickerModal: React.FC<Props> = ({ qualification, value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Use the same options logic as before
  const normQ = qualification; // keep normalization logic outside if needed
  const SPECIALTIES: Record<string, string[]> = {
    MBBS: ["General Medicine","Pediatrics","Dermatology","Psychiatry","Radiology","Anesthesiology","Emergency Medicine","Family Medicine"],
    MSc: ["Orthodontics","Oral Surgery","Periodontology","Endodontics","Prosthodontics","Oral Medicine & Radiology","Public Health Dentistry"],
    MDS: ["Orthodontics","Oral & Maxillofacial Surgery","Endodontics","Periodontology","Prosthodontics","Pediatric Dentistry","Oral Medicine & Radiology","Public Health Dentistry"],
    BDS: ["General Dentistry","Endodontics","Periodontics","Prosthodontics","Oral Surgery","Orthodontics","Pediatric Dentistry"],
    "PG Diploma": ["Oral Surgery","Orthodontics","Implantology","Endodontics","Periodontology"],
    Diplomate: ["Orthodontics","Implantology","Oral & Maxillofacial Surgery","Endodontics"],
    Fellowship: ["Cosmetic Dentistry","Implantology","Oral Oncology","TMJ Disorders","Cleft & Craniofacial"],
  };

  const options = useMemo(() => (normQ ? SPECIALTIES[normQ] ?? [] : []), [normQ]);

  // Clear invalid specialty when qualification changes
  useEffect(() => {
    const valid = !!(value && options.includes(value));
    if (value && !valid) onChange?.("");
  }, [options, value, onChange]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => options.length && setModalVisible(true)}
      >
        <Text style={{ color: value ? "#000" : "#7B7B7B" }}>
          {value || (!options.length ? "Select qualification first" : "Select specialty")}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.option, { borderTopWidth: 1, borderColor: "#ccc" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.optionText, { color: "red", textAlign: "center" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    // borderWidth: 1,
    // borderColor: "#cf6a12ff",
    // borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    maxHeight: 300,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
});

export default SpecialityPickerModal;
