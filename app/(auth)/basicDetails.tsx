import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Back from "../../assets/images/back-arrow.svg";
import Person from "../../assets/icons/person.svg";
import Calendar from "../../assets/icons/calendar.svg";
import { useRouter } from "expo-router";

type Gender = "Male" | "Female" | "Others" | "";

export default function BasicDetails() {
  const router = useRouter();

  const firstNameRef = React.useRef<TextInput>(null);
  const lastNameRef = React.useRef<TextInput>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");

  // DOB
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState("");
  const [showIosPicker, setShowIosPicker] = useState(false);

  const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseDob = (text: string): Date | null => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!m) return null;
    const yyyy = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const dd = parseInt(m[3], 10);
    const candidate = new Date(yyyy, mm - 1, dd);
    if (
      candidate.getFullYear() !== yyyy ||
      candidate.getMonth() !== mm - 1 ||
      candidate.getDate() !== dd
    )
      return null;
    if (candidate > new Date()) return null;
    return candidate;
  };

  const dobError = useMemo(() => {
    if (!dobText) return "Date of birth is required";
    if (!parseDob(dobText)) return "Enter a valid date (yyyy-mm-dd)";
    return "";
  }, [dobText]);

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: dob || new Date(2000, 0, 1),
        mode: "date",
        maximumDate: new Date(),
        onChange: (_event, selectedDate) => {
          if (selectedDate) {
            setDob(selectedDate);
            setDobText(formatDate(selectedDate));
          }
        },
      });
    } else {
      setShowIosPicker(true);
    }
  };

  const IOSDatePicker = () => {
    if (!showIosPicker) return null;
    return (
      <DateTimePicker
        value={dob || new Date(2000, 0, 1)}
        mode="date"
        maximumDate={new Date()}
        display="spinner"
        onChange={(_, selectedDate) => {
          setShowIosPicker(false);
          if (selectedDate) {
            setDob(selectedDate);
            setDobText(formatDate(selectedDate));
          }
        }}
        style={{ width: "100%" }}
      />
    );
  };

  const onContinue = () => {
    if (!firstName || !lastName || !dob || !gender) {
      alert("Please fill all fields correctly");
      return;
    }
    console.log({ firstName, lastName, dob: dobText, gender });
    router.push("/(auth)/moreDetails");
  };

  const handleBackPress = () => router.back();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backWrap}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={handleBackPress}
          >
            <Back />
          </TouchableOpacity>

          {/* Middle */}
          <View style={styles.middlecontainer}>
            <View style={styles.avatar}>
              <Person width={scale(32)} height={scale(38)} />
            </View>

            <View>
              <Text style={styles.title}>Enter your basic details</Text>
              <Text style={styles.subtitle}>
                Please provide your personal information to get started
              </Text>
            </View>

            {/* First name */}
            <View>
              <Text style={styles.label}>First name</Text>
              <TextInput
                ref={firstNameRef}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#7B7B7B"
                style={[styles.input, { fontFamily: "Mulish-Regular" }]}
              />
            </View>

            {/* Last name */}
            <View>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                ref={lastNameRef}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#7B7B7B"
                style={[styles.input, { fontFamily: "Mulish-Regular" }]}
              />
            </View>

            {/* DOB */}
            <View>
              <Text style={styles.label}>Date of birth</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  value={dobText}
                  placeholder="yyyy-mm-dd"
                  placeholderTextColor="#7B7B7B"
                  style={[styles.input]}
                  onFocus={openDatePicker}
                />
                <TouchableOpacity style={styles.rightIcon} onPress={openDatePicker}>
                  <Calendar width={scale(24)} height={scale(24)} />
                </TouchableOpacity>
              </View>
              <IOSDatePicker />
              {!!dobText && !dob && <Text style={styles.errorText}>{dobError}</Text>}
            </View>

            {/* Gender */}
<View>
  <Text style={styles.label}>Gender</Text>
  <View style={styles.pickerBox}>
    <Picker
      selectedValue={gender}
      onValueChange={(v) => setGender(v as Gender)}
      mode={Platform.OS === "android" ? "dropdown" : "dialog"}
      dropdownIconColor="#0c5886ff"
      style={styles.picker}
    >
      <Picker.Item label="Select Gender" value="" />
      <Picker.Item label="Male" value="Male" />
      <Picker.Item label="Female" value="Female" />
      <Picker.Item label="Others" value="Others" />
    </Picker>
  </View>
</View>

          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cta} onPress={onContinue}>
            <Text style={styles.ctaText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  pagePadding: { paddingHorizontal: scale(16) },
  scrollContent: { paddingBottom: verticalScale(32), gap: verticalScale(32) },
  middlecontainer: { gap: verticalScale(24) },
  backWrap: { marginTop: verticalScale(8), width: scale(40) },

  avatar: {
    alignSelf: "center",
    width: scale(70),
    height: scale(70),
    borderRadius: scale(50),
    backgroundColor: "#E7F1F3",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
    color: "#0B0B0B",
  },
  subtitle: {
    textAlign: "center",
    color: "#657077",
    fontSize: moderateScale(16),
    fontFamily: "Mulish-Regular",
    marginTop: verticalScale(8),
  },

  label: {
    fontSize: moderateScale(14),
    color: "#1E1F20",
    fontFamily: "Mulish-Bold",
  },

  input: {
    height: moderateScale(50),
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: "#fff",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-Regular",
    color: "#000000",
  },

  pickerBox: {
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    backgroundColor: "#fff",
  },
  picker: {
    height: moderateScale(48),
    color: "#0B0B0B", // make sure text is visible
  },

  inputWithIcon: { position: "relative", justifyContent: "center" },
  rightIcon: {
    position: "absolute",
    right: scale(12),
    top: verticalScale(3),
    height: verticalScale(48),
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    marginTop: verticalScale(6),
    color: "#C83B3B",
    fontSize: moderateScale(12),
  },

  footer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    backgroundColor: "#fff",
  },
  cta: {
    backgroundColor: "#0B7C84",
    paddingVertical: verticalScale(14),
    borderRadius: scale(8),
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: moderateScale(14) },
});
