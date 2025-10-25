import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
};

const MAIN_OPTIONS = ["MBBS", "MD", "MDS", "BDS", "Others"];
const OTHERS_OPTIONS = ["PG Diploma", "Diplomate", "Fellowship"];

const QualificationPicker: React.FC<Props> = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [choosingOthers, setChoosingOthers] = useState(false);

  const BACK = "__BACK__";
  const options = choosingOthers ? [BACK, ...OTHERS_OPTIONS] : MAIN_OPTIONS;
  

  const handleSelect = (val: string) => {
    if (val === "Others") {
      setChoosingOthers(true);
      return;
    }
    if (val === BACK) {
      setChoosingOthers(false);
      return;
    }
    onChange?.(val);
    setChoosingOthers(false);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: value ? "#000" : "#7B7B7B" }}>
          {value || "Select qualification"}
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
                  <Text style={styles.optionText}>
                    {item === BACK ? "← Back" : item}
                  </Text>
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
    // borderColor: "#C2D5D8",
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

export default QualificationPicker;
