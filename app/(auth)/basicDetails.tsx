import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import Back from "../../assets/images/back-arrow.svg";
import Person from "../../assets/icons/person.svg";
import Calendar from "../../assets/icons/calendar.svg";
import DownArrow from "../../assets/icons/down-arrow.svg";
import { useRouter } from "expo-router";

type Gender = "Male" | "Female" | "Others" | "";

export default function BasicDetails() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // DOB: keep both a Date (for picker) and a text (for typing)
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState(""); // dd-mm-yyyy
  const [touchedDob, setTouchedDob] = useState(false);

  const [gender, setGender] = useState<Gender>("");
  const [genderOpen, setGenderOpen] = useState(false);

  // iOS picker modal visibility
  const [iosPickerOpen, setIosPickerOpen] = useState(false);

  // --- Helpers ---
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
    // Months are 0-indexed in JS
    const candidate = new Date(yyyy, mm - 1, dd);
    // Validate round-trip (handles invalid dates like 31-02-2023)
    if (
      candidate.getFullYear() !== yyyy ||
      candidate.getMonth() !== mm - 1 ||
      candidate.getDate() !== dd
    )
      return null;
    // No future dates
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

  // const canContinue =
  //   firstName.trim().length > 0 &&
  //   lastName.trim().length > 0 &&
  //   isValidDateText(dobText) &&
  //   !!gender;

  const onContinue = () => {
    console.log({
      firstName,
      lastName,
      dob: dobText,
      gender,
    });
    //router.push("/(auth)/test");
  };

  const handleBackPress = () => {
    router.back();
  };

  // ---------- Date Picker handlers ----------
  const openDatePicker = () => {
    // If user typed a valid date, start picker from it; else a reasonable default
    const initial = parseDob(dobText) || dob || new Date(2000, 0, 1);
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initial,
        mode: "date",
        is24Hour: true,
        maximumDate: new Date(),
        onChange: (_event, selectedDate) => {
          // _event.type === 'set' when confirmed, 'dismissed' when cancelled
          if (selectedDate) {
            setDob(selectedDate);
            setDobText(formatDate(selectedDate));
            setTouchedDob(true);
          }
        },
      });
    } else {
      // iOS: show modal with inline/spinner picker
      setDob(initial);
      setIosPickerOpen(true);
    }
  };

  const onIosConfirm = () => {
    if (dob) setDobText(formatDate(dob));
    setTouchedDob(true);
    setIosPickerOpen(false);
  };

  const onIosCancel = () => {
    setIosPickerOpen(false);
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back (placeholder) / Top Container*/}
          <TouchableOpacity
            style={styles.backWrap}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={handleBackPress}
          >
            <Back />
          </TouchableOpacity>

          {/* MiddleContainer */}
          <View style={styles.middlecontainer}>
            {/* Avatar circle (placeholder) */}
            <View style={styles.avatar}>
              <Person width={scale(32)} height={scale(38)} />
            </View>

            {/* Title + subtitle */}
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

                {/* Right opens native datepicker */}
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
              <Pressable
                style={styles.dropdown}
                onPress={() => setGenderOpen(true)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !gender && { color: "#7B7B7B" }, // grey when no gender selected
                  ]}
                >
                  {gender || "Select Gender"}
                </Text>
                <DownArrow width={scale(32)} height={verticalScale(24)} />
              </Pressable>
            </View>
          </View>

          {/* Continue */}
          <TouchableOpacity style={styles.button} onPress={onContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal
        visible={genderOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setGenderOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setGenderOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            {(["Male", "Female", "Others"] as Gender[]).map((g) => {
              const selected = gender === g;
              return (
                <Pressable
                  key={g}
                  style={styles.radioRow}
                  onPress={() => {
                    setGender(g);
                    setGenderOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterActive,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.modalItemText}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* iOS DatePicker Modal */}
      {Platform.OS === "ios" && (
        <Modal
          visible={iosPickerOpen}
          transparent
          animationType="slide"
          onRequestClose={onIosCancel}
        >
          <View style={styles.iosModalWrap}>
            <Pressable style={styles.iosScrim} onPress={onIosCancel} />
            <View style={styles.iosSheet}>
              <View style={styles.iosSheetHeader}>
                <TouchableOpacity onPress={onIosCancel}>
                  <Text style={styles.iosSheetBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onIosConfirm}>
                  <Text style={styles.iosSheetBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dob || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(_e, selected) => {
                  if (selected) setDob(selected);
                }}
                style={{ backgroundColor: "#fff" }}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  pagePadding: {
    paddingHorizontal: scale(16),
  },
  scrollContent: {
    paddingBottom: verticalScale(24),
    gap: verticalScale(32),
  },
  middlecontainer: {
    gap: verticalScale(24),
  },
  backWrap: {
    paddingVertical: verticalScale(8),
    width: scale(40),
  },
  backArrow: {
    fontSize: moderateScale(24),
    color: "#0E6C73",
  },

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

  inputWithIcon: {
    position: "relative",
    justifyContent: "center",
  },
  inputFlex: {
    paddingLeft: scale(36), // space for left icon
    paddingRight: scale(40), // space for right icon (picker button)
  },
  leftIcon: {
    position: "absolute",
    left: scale(12),
    fontSize: moderateScale(16),
    opacity: 0.7,
  },
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

  dropdown: {
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(8),
  },
  dropdownText: {
    fontSize: moderateScale(14),
    color: "#0B0B0B", // normal when a gender is selected
    fontFamily: "Mulish-Regular",
  },
  dropdownChevron: {
    fontSize: moderateScale(16),
    color: "#657077",
    marginLeft: scale(8),
  },

  button: {
    backgroundColor: "#0B7C84",
    height: verticalScale(48),
    borderRadius: scale(5),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontFamily: "Mulish-SemiBold",
  },

  // Gender modal
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-start", // start from top
  },
  dropdownContainer: {
    marginHorizontal: scale(16), // same horizontal padding
    paddingHorizontal: scale(16),
    marginTop: verticalScale(400), // adjust this so it aligns below Gender field
    backgroundColor: "rgba(231, 241, 243, 0.95)",
    // backgroundColor: "#E7F1F3",
    // opacity: 55,
    borderColor: "#C2D5D8",
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: verticalScale(8),
  },
  modalSheet: {
    backgroundColor: "#fff",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderTopLeftRadius: scale(14),
    borderTopRightRadius: scale(14),
  },
  modalItem: {
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECEE",
  },
  modalItemText: {
    fontSize: moderateScale(14),
    color: "#000000",
    fontFamily: "Mulish-SemiBold",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6ECEE",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C2D5D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioOuterActive: {
    borderColor: "#0B7C84",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0B7C84",
  },

  // iOS date picker sheet
  iosModalWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iosScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  iosSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: scale(14),
    borderTopRightRadius: scale(14),
    overflow: "hidden",
  },
  iosSheetHeader: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iosSheetBtnText: {
    color: "#0B7C84",
    fontSize: moderateScale(16),
    fontFamily: "Mulish-SemiBold",
  },
});
