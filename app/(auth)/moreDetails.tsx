// MoreDetails.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Back from "../../assets/images/back-arrow.svg";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Tick from "../../assets/icons/tick.svg";

const { width: SCREEN_W } = Dimensions.get("window");

type StepKey = "about" | "registration";

export default function MoreDetails() {
  const scrollRef = useRef<ScrollView>(null);

  const insets = useSafeAreaInsets();

  const [stepIndex, setStepIndex] = useState(0); // 0 = About, 1 = Registration
  const steps: StepKey[] = ["about", "registration"];

  // Simple form state (replace with your form lib if needed)
  const [qualification, setQualification] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [about, setAbout] = useState("");
  const [regNo, setRegNo] = useState("");
  const [fileName, setFileName] = useState<string | null>(null); // placeholder

  // Validation (tweak to your needs)
  const stepValid = useMemo(() => {
    if (stepIndex === 0) {
      return qualification && specialty; // about text optional
    }
    if (stepIndex === 1) {
      return regNo.length >= 3; // and maybe file required in future
    }
    return false;
  }, [stepIndex, qualification, specialty, regNo]);

  const goTo = (index: number) => {
    setStepIndex(index);
    scrollRef.current?.scrollTo({ x: SCREEN_W * index, animated: true });
  };

  const onContinue = () => {
    if (!stepValid) return;
    if (stepIndex < steps.length - 1) {
      goTo(stepIndex + 1);
    } else {
      // final submit
      console.log({
        qualification,
        specialty,
        about,
        regNo,
        fileName,
      });
    }
  };

  const onBack = () => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  };

  const onSkip = () => {
    // your skip behavior (navigate away etc.)
    console.log("Skipped onboarding");
  };

  // Progress bar coloring
  const sectionColor = (i: number) => {
    if (i < stepIndex) return "#0BB07B"; // completed (green like your check state)
    if (i === stepIndex) return "#0B7C84"; // active teal
    return "#CFE1E4"; // inactive
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Nav */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Back />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented progress with optional check icon */}
      <View style={styles.progressWrap}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={[styles.progressSeg, { backgroundColor: sectionColor(i) }]}
          />
        ))}
      </View>

      {/* Title row */}
      <View style={styles.header}>
        {stepIndex > 0 ? (
          <View style={styles.checkDot}>
            <Tick width={scale(14)} height={scale(14)} />
          </View>
        ) : (
          <View style={styles.checkDotGhost} />
        )}
      </View>

      <Text style={styles.title}>Tell us bit more about yourself</Text>

      {/* Carousel */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled // allow swiping
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setStepIndex(idx);
          }}
        >
          {/* STEP 1 — About */}
          <View style={[styles.page, { width: SCREEN_W }]}>
            <View style={styles.segmentTabs}>
              <Text style={styles.tab}>Hospital</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Qualification</Text>
              <View style={styles.inputBox}>
                <TextInput
                  value={qualification}
                  onChangeText={setQualification}
                  placeholder="Select qualification"
                  placeholderTextColor="#7B7B7B"
                  style={styles.input}
                />
                <Text style={styles.dropIcon}>▾</Text>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Speciality</Text>
              <View style={styles.inputBox}>
                <TextInput
                  value={specialty}
                  onChangeText={setSpecialty}
                  placeholder="Select specialty"
                  placeholderTextColor="#7B7B7B"
                  style={styles.input}
                />
                <Text style={styles.dropIcon}>▾</Text>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Type something about yourself in 4–5 lines{"\n"}(Optional)
              </Text>
              <View
                style={[styles.textAreaBox, { height: verticalScale(140) }]}
              >
                <TextInput
                  value={about}
                  onChangeText={(t) => {
                    if (t.length <= 300) setAbout(t);
                  }}
                  placeholder="Tell us about your experience and expertise..."
                  placeholderTextColor="#7B7B7B"
                  style={[
                    styles.input,
                    { height: "100%", textAlignVertical: "top" },
                  ]}
                  multiline
                />
                <Text style={styles.counter}>{about.length} / 300 (max)</Text>
              </View>
            </View>
          </View>

          {/* STEP 2 — Registration */}
          <View style={[styles.page, { width: SCREEN_W }]}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Registration Number</Text>
              <View style={styles.inputBox}>
                <TextInput
                  value={regNo}
                  onChangeText={setRegNo}
                  placeholder="Enter your registration number"
                  placeholderTextColor="#7B7B7B"
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.uploadBox}>
              <Text style={styles.uploadTitle}>
                Upload registration certificate
              </Text>
              <Text style={styles.uploadSub}>
                Drag and drop your file here, or click to browse{"\n"}Supports
                PDF, JPG, PNG files
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => {
                  // hook your file picker here
                  setFileName("certificate.pdf");
                }}
              >
                <Text style={styles.browseText}>Browse Files</Text>
              </TouchableOpacity>
              {!!fileName && <Text style={styles.fileName}>{fileName}</Text>}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.cta} onPress={onContinue}>
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 8, android: 8 }),
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  backArrow: { fontSize: 26, color: "#0B0B0B" },
  skip: {
    color: "#22466D",
    fontSize: moderateScale(16),
    fontFamily: "Mulish-SemiBold",
  },

  progressWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    gap: 8,
  },
  progressSeg: {
    height: 6,
    borderRadius: 6,
    flex: 1,
    backgroundColor: "#CFE1E4",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  checkDot: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: "#28A745",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(24),
  },
  checkDotGhost: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B0B0B",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },

  page: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: verticalScale(24),
  },

  segmentTabs: {
    alignContent: "center",
    borderRadius: 6,
    backgroundColor: "#0B7C84",
    height: verticalScale(50),
    paddingVertical: verticalScale(15),
  },
  tab: {
    color: "#fff",
    fontFamily: "Mulish-Bold",
    fontSize: moderateScale(16),
    textAlign: "center",
  },

  tabInactive: {
    color: "transparent",
    backgroundColor: "#E1EFF0",
  },

  fieldBlock: {},
  label: { color: "#1E1F20", fontWeight: "700", marginBottom: 8 },

  inputBox: {
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: 48,
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: 14,
    color: "#0B0B0B",
  },
  dropIcon: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 18,
    color: "#657077",
  },

  textAreaBox: {
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 8,
  },
  counter: {
    position: "absolute",
    right: 10,
    bottom: 8,
    color: "#7B7B7B",
    fontSize: 12,
  },

  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  uploadTitle: { fontWeight: "700", color: "#0B0B0B" },
  uploadSub: { textAlign: "center", color: "#657077" },
  browseBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C2D5D8",
    backgroundColor: "#fff",
  },
  browseText: { fontWeight: "600", color: "#0B0B0B" },
  fileName: { marginTop: 6, color: "#0B0B0B" },

  progressRow: {
    marginBottom: 16,
    marginHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  footer: { paddingHorizontal: scale(16), paddingBottom: verticalScale(24) },
  cta: {
    backgroundColor: "#0B7C84",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    //marginBottom: verticalScale(24),
  },
  ctaText: { color: "#fff", fontWeight: "700" },
});
