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
import { useHeaderHeight } from "@react-navigation/elements";
import Back from "../../assets/images/back-arrow.svg";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Tick from "../../assets/icons/tick.svg";
import Upload from "../../assets/icons/upload.svg";
import QualificationPicker from "@/src/components/authComponents/QualificationPicker";
import { useRouter } from "expo-router";
import SpecialityPicker from "@/src/components/authComponents/SpecialityPicker";

const { width: SCREEN_W } = Dimensions.get("window");

type StepKey = "about" | "registration";

export default function MoreDetails() {
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  // normal 2 steps, plus a review "mode"
  const [stepIndex, setStepIndex] = useState(0); // 0 = About, 1 = Registration
  const [reviewMode, setReviewMode] = useState(false);

  // form state
  const [qualification, setQualification] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [about, setAbout] = useState("");
  const [regNo, setRegNo] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  // validation
  const stepValid = useMemo(() => {
    if (reviewMode) return true; // already editing everything
    if (stepIndex === 0) return !!(qualification && specialty);
    if (stepIndex === 1) return regNo.length >= 3;
    return false;
  }, [reviewMode, stepIndex, qualification, specialty, regNo]);

  const goTo = (index: number) => {
    setStepIndex(index);
    scrollRef.current?.scrollTo({ x: SCREEN_W * index, animated: true });
  };

  const onContinue = () => {
    if (!stepValid) return;

    if (!reviewMode) {
      if (stepIndex === 0) return goTo(1);
      if (stepIndex === 1) {
        setReviewMode(true);
        return;
      }
    } else {
      console.log("[MoreDetails] SUBMIT", {
        qualification,
        specialty,
        about,
        regNo,
        fileName,
      });

      router.push("/(auth)/uploadProfilePicture");
    }
  };

  const onBack = () => {
    if (reviewMode) {
      setReviewMode(false); // leave review back to registration
      return;
    }
    if (stepIndex > 0) goTo(stepIndex - 1);
  };

  const onSkip = () => {
    console.log("[MoreDetails] Skipped onboarding");
  };

  // progress colors
  const sectionColor = (i: number) => {
    if (reviewMode) return "#28A745";
    if (i < stepIndex) return "#28A745";
    if (i === stepIndex) return "#107483";
    return "#C2D5D8";
  };

  const showTick = (i: number) => {
    if (reviewMode) return true;
    return i < stepIndex;
  };

  const bottomPad = verticalScale(240);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
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

      {/* Progress */}
      <View style={styles.progressWrap}>
        {[0, 1].map((i) => (
          <View key={i} style={{ flex: 1 }}>
            <View
              style={[styles.progressSeg, { backgroundColor: sectionColor(i) }]}
            />
            {showTick(i) ? (
              <View style={styles.checkDot}>
                <Tick width={scale(14)} height={scale(14)} />
              </View>
            ) : (
              <View style={styles.checkDotGhost} />
            )}
          </View>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {reviewMode ? "Review & Edit" : "Tell us bit more about yourself"}
      </Text>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
      >
        {!reviewMode ? (
          // ===== Two-step horizontal pager (About / Registration) =====
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
              setStepIndex(idx);
            }}
          >
            {/* STEP 1 — About */}
            <View style={[styles.page, { width: SCREEN_W }]}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                keyboardDismissMode={
                  Platform.OS === "ios" ? "interactive" : "none"
                }
                contentContainerStyle={{ paddingBottom: bottomPad }}
              >
                <View style={styles.segmentTabs}>
                  <Text style={styles.tab}>Hospital</Text>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Qualification</Text>
                  <View style={styles.inputBox}>
                    <QualificationPicker
                      value={qualification}
                      onChange={(q: string) => {
                        if (q !== qualification) {
                          console.log(
                            "[MoreDetails] qualification changed:",
                            qualification,
                            "=>",
                            q,
                            " — clearing specialty"
                          );
                          setQualification(q);
                          setSpecialty("");
                        } else {
                          console.log(
                            "[MoreDetails] qualification unchanged, ignoring"
                          );
                        }
                      }}
                    />
                  </View>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>Speciality</Text>
                  <View style={styles.inputBox}>
                    <SpecialityPicker
                      qualification={qualification}
                      value={specialty}
                      onChange={(v: string) => {
                        console.log("[MoreDetails] specialty set to:", v);
                        setSpecialty(v);
                      }}
                    />
                  </View>
                </View>

                <View style={styles.fieldBlock}>
                  <Text style={styles.label}>
                    Type something about yourself in 4-5 lines{"\n"}(Optional)
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
                    <Text style={styles.counter}>
                      {about.length} / 300 (max)
                    </Text>
                  </View>
                </View>

                <View style={{ height: 8 }} />
              </ScrollView>
            </View>

            {/* STEP 2 — Registration */}
            <View style={[styles.page, { width: SCREEN_W }]}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                keyboardDismissMode={
                  Platform.OS === "ios" ? "interactive" : "none"
                }
                contentContainerStyle={{ paddingBottom: bottomPad }}
              >
                <View style={[styles.fieldBlock, { marginTop: 0 }]}>
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
                  <Upload width={scale(32)} height={scale(32)} />
                  <View style={styles.texts}>
                    <Text style={styles.uploadTitle}>
                      Upload registration certificate
                    </Text>
                    <Text style={styles.uploadSub}>
                      Drag and drop your file here, or click to browse
                    </Text>
                    <Text style={styles.uploadSub}>
                      Supports PDF, JPG, PNG files
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.browseBtn}
                    onPress={() => setFileName("certificate.pdf")}
                  >
                    <Text style={styles.browseText}>Browse Files</Text>
                  </TouchableOpacity>
                  {!!fileName && (
                    <Text style={styles.fileName}>{fileName}</Text>
                  )}
                </View>

                <View style={{ height: 8 }} />
              </ScrollView>
            </View>
          </ScrollView>
        ) : (
          // ===== Review & Edit (single vertical page) =====
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: bottomPad,
            }}
          >
            <Text style={styles.sectionTitle}>
              Tell us bit more about yourself
            </Text>

            <View style={styles.segmentTabs}>
              <Text style={styles.tab}>Hospital</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Qualification</Text>
              <View style={styles.inputBox}>
                <QualificationPicker
                  value={qualification}
                  onChange={(q: string) => {
                    if (q !== qualification) {
                      console.log(
                        "[MoreDetails][Review] qualification changed:",
                        qualification,
                        "=>",
                        q,
                        " — clearing specialty"
                      );
                      setQualification(q);
                      setSpecialty("");
                    } else {
                      console.log(
                        "[MoreDetails][Review] qualification unchanged, ignoring"
                      );
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Speciality</Text>
              <View style={styles.inputBox}>
                <SpecialityPicker
                  qualification={qualification}
                  value={specialty}
                  onChange={(v: string) => {
                    console.log("[MoreDetails][Review] specialty set to:", v);
                    setSpecialty(v);
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Type something about yourself in 4-5 lines (Optional)
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

            <View style={[styles.fieldBlock, { marginTop: verticalScale(24) }]}>
              <Text style={styles.sectionTitle}>Registration</Text>
            </View>

            <View style={[styles.fieldBlock, { marginTop: verticalScale(8) }]}>
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
              <Upload width={scale(32)} height={scale(32)} />
              <View style={styles.texts}>
                <Text style={styles.uploadTitle}>
                  Upload registration certificate
                </Text>
                <Text style={styles.uploadSub}>
                  Drag and drop your file here, or click to browse
                </Text>
                <Text style={styles.uploadSub}>
                  Supports PDF, JPG, PNG files
                </Text>
              </View>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => setFileName("certificate.pdf")}
              >
                <Text style={styles.browseText}>Browse Files</Text>
              </TouchableOpacity>
              {!!fileName && <Text style={styles.fileName}>{fileName}</Text>}
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cta} onPress={onContinue}>
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ===== styles unchanged (same as your original) ===== */
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
    alignItems: "center",
  },
  progressSeg: {
    height: moderateScale(4),
    borderRadius: 6,
    backgroundColor: "#C2D5D8",
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
    position: "absolute",
    top: verticalScale(14),
    left: 0,
  },
  checkDotGhost: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    top: verticalScale(14),
    left: 0,
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
    color: "#000000ff",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
    marginTop: verticalScale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: "Mulish-Bold",
    color: "#000",
    marginBottom: verticalScale(12),
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
  fieldBlock: { marginTop: verticalScale(16) },
  label: {
    color: "#000000",
    fontFamily: "Mulish-SemiBold",
    fontSize: moderateScale(14),
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: 8,
    backgroundColor: "#fff",
    minHeight: verticalScale(48),
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: moderateScale(14),
    fontFamily: "Mulish-Regular",
    color: "#000000",
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
    color: "#575757",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-Bold",
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#C2D5D8",
    borderRadius: scale(5),
    paddingVertical: verticalScale(32),
    alignItems: "center",
    gap: verticalScale(16),
    marginTop: verticalScale(24),
  },
  texts: { gap: verticalScale(8) },
  uploadTitle: {
    fontFamily: "Mulish-SemiBold",
    fontSize: moderateScale(16),
    color: "#000000",
    textAlign: "center",
  },
  uploadSub: {
    textAlign: "center",
    color: "#575757",
    fontFamily: "Mulish-Regular",
    fontSize: moderateScale(14),
  },
  browseBtn: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: scale(28),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C2D5D8",
    backgroundColor: "#fff",
  },
  browseText: {
    fontFamily: "Mulish-SemiBold",
    fontSize: moderateScale(16),
    color: "#000000",
  },
  fileName: { color: "#000000" },
  footer: { paddingHorizontal: scale(16), paddingBottom: verticalScale(16) },
  cta: {
    backgroundColor: "#0B7C84",
    paddingVertical: verticalScale(14),
    borderRadius: scale(6),
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "700" },
});
