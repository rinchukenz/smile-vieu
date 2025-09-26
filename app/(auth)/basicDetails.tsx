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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Back from "../../assets/images/back-arrow.svg";
import Person from "../../assets/icons/person.svg";
import Calendar from "../../assets/icons/calendar.svg";
import { useRouter } from "expo-router";

type Gender = "Male" | "Female" | "Others" | "";

export default function BasicDetails() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Keep keyboard open + restore focus
  const firstNameRef = React.useRef<TextInput>(null);
  const lastNameRef = React.useRef<TextInput>(null);
  const kbKeeperRef = React.useRef<TextInput>(null);
  const [lastFocused, setLastFocused] = useState<"first" | "last" | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [gender, setGender] = useState<Gender>("");

  // DOB
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState("");
  const [touchedDob, setTouchedDob] = useState(false);

  const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  const formatDobInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let out = "";
    for (let i = 0; i < digits.length; i++) {
      out += digits[i];
      if (i === 1 || i === 3) out += "-";
    }
    return out;
  };
  const parseDob = (text: string): Date | null => {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text);
    if (!m) return null;
    const dd = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    if (yyyy < 1900) return null;
    const candidate = new Date(yyyy, mm - 1, dd);
    if (
      candidate.getFullYear() !== yyyy ||
      candidate.getMonth() !== mm - 1 ||
      candidate.getDate() !== dd
    )
      return null;
    const today = new Date();
    if (candidate > today) return null;
    return candidate;
  };
  const isValidDateText = (text: string) => parseDob(text) !== null;
  const dobError = useMemo(() => {
    if (!touchedDob) return "";
    if (!dobText) return "Date of birth is required";
    if (!isValidDateText(dobText)) return "Enter a valid date (dd-mm-yyyy)";
    return "";
  }, [dobText, touchedDob]);

  const onContinue = () => {
    console.log({ firstName, lastName, dob: dobText, gender });
    router.push("/(auth)/moreDetails");
  };

  const handleBackPress = () => router.back();

  // DatePicker (native)
  const openDatePicker = () => {
    const initial = parseDob(dobText) || dob || new Date(2000, 0, 1);
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initial,
        mode: "date",
        is24Hour: true,
        maximumDate: new Date(),
        onChange: (_event, selectedDate) => {
          if (selectedDate) {
            setDob(selectedDate);
            setDobText(formatDate(selectedDate));
            setTouchedDob(true);
          }
        },
      });
    } else {
      setDob(initial);
      // iOS modal logic here if needed
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[styles.pagePadding, styles.scrollContent]}
          keyboardShouldPersistTaps="always"
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
                onFocus={() => setLastFocused("first")}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#7B7B7B"
                style={[styles.input, { fontFamily: "Mulish-Regular" }]}
                returnKeyType="next"
              />
            </View>

            {/* Last name */}
            <View>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                ref={lastNameRef}
                onFocus={() => setLastFocused("last")}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#7B7B7B"
                style={[styles.input, { fontFamily: "Mulish-Regular" }]}
                returnKeyType="next"
              />
            </View>

            {/* DOB */}
            <View>
              <Text style={styles.label}>Date of birth</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  value={dobText}
                  onChangeText={(t) => {
                    const f = formatDobInput(t);
                    setDobText(f);
                    const parsed = parseDob(f);
                    if (parsed) setDob(parsed);
                  }}
                  onBlur={() => setTouchedDob(true)}
                  placeholder="dd-mm-yyyy"
                  placeholderTextColor="#7B7B7B"
                  style={[styles.input]}
                  keyboardType={Platform.select({
                    ios: "number-pad",
                    android: "numeric",
                  })}
                  maxLength={10}
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={openDatePicker}
                >
                  <Calendar width={scale(24)} height={scale(24)} />
                </TouchableOpacity>
              </View>
              {!!dobError && <Text style={styles.errorText}>{dobError}</Text>}
            </View>

            {/* Gender */}
            <View>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerBox}>
                {gender === "" && (
                  <Text pointerEvents="none" style={styles.pickerPlaceholder}>
                    Select Gender
                  </Text>
                )}
                <Picker
                  selectedValue={gender === "" ? "Male" : gender}
                  onValueChange={(v) => setGender(v as Gender)}
                  mode={Platform.OS === "android" ? "dropdown" : "dialog"}
                  dropdownIconColor="#0c5886ff"
                  style={[
                    styles.picker,
                    Platform.OS === "android" && gender === ""
                      ? { color: "transparent" }
                      : null,
                  ]}
                  itemStyle={
                    Platform.OS === "ios" && gender === ""
                      ? { color: "transparent" }
                      : { color: "#0B0B0B" }
                  }
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Others" value="Others" />
                </Picker>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Footer */}
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
    overflow: "hidden",
    position: "relative",
  },
  picker: {
    height: moderateScale(48),
    backgroundColor: "transparent",
  },
  pickerPlaceholder: {
    position: "absolute",
    left: scale(10),
    top: (moderateScale(48) - moderateScale(14)) / 2,
    fontSize: moderateScale(14),
    color: "#7B7B7B",
    fontFamily: "Mulish-Regular",
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

  footer: { paddingHorizontal: scale(16), paddingBottom: verticalScale(16) },
  cta: {
    backgroundColor: "#0B7C84",
    paddingVertical: verticalScale(14),
    borderRadius: scale(8),
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: moderateScale(14) },
});
