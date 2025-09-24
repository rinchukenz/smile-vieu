// app/(auth)/upload-profile-picture.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Camera from "../../assets/icons/camera.svg";
import { useRouter } from "expo-router";
import Back from "../../assets/images/back-arrow.svg";

export default function UploadProfilePicture() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const webFileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const onUploadPress = () => {
    if (Platform.OS === "web") {
      // trigger the hidden <input type="file">
      webFileInputRef.current?.click();
    } else {
      // Native (no picker): let users paste a URL
      setShowUrlModal(true);
    }
  };

  // WEB: handle file choose -> read as data URL so Image can preview it
  const onWebFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUri(reader.result);
    };
    reader.readAsDataURL(file);
    // reset the input so selecting same file again still triggers change
    e.currentTarget.value = "";
  };

  // NATIVE: URL modal handlers
  const confirmUrl = () => {
    if (!tempUrl.trim()) return;
    // optionally add a light validation
    if (!/^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(tempUrl.trim())) {
      // accept any URL if you prefer; this is just a guard
      // remove the regex check if your backend can handle more
    }
    setImageUri(tempUrl.trim());
    setShowUrlModal(false);
    setTempUrl("");
  };

  const handleBackPress = () => router.back();

  const onSkip = () => {
    console.log("Skip profile photo");
    router.push("/(auth)/profileCreated");
  };

  const onContinue = () => {
    console.log("Continue with photo:", imageUri);
    // If uploading to your API:
    // - WEB (data URL): convert to Blob before upload
    // - NATIVE (URL): send the URL or download+upload server-side
    router.push("/(auth)/profileCreated");
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backWrap}
        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        onPress={handleBackPress}
      >
        <Back />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Upload profile picture</Text>
        <Text style={styles.subTitle}>Choose a photo that represents you</Text>

        <View style={styles.previewWrap}>
          <View style={styles.previewCircle}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholder}>
                <Camera width={scale(32)} height={scale(32)} />
                <Text style={styles.placeholderText}>Image</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.outlineBtn} onPress={onUploadPress}>
          <Text style={styles.outlineBtnText}>Upload</Text>
        </TouchableOpacity>

        {/* WEB-ONLY hidden file input */}
        {Platform.OS === "web" ? (
          // @ts-ignore: this JSX tag is fine on web
          <input
            ref={webFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onWebFileChange}
          />
        ) : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.cta, styles.later]} onPress={onSkip}>
          <Text style={styles.laterText}>Do it later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cta, styles.continue]}
          onPress={onContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Native-only: paste URL modal */}
      <Modal
        visible={showUrlModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUrlModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Paste image URL</Text>
            <TextInput
              value={tempUrl}
              onChangeText={setTempUrl}
              placeholder="https://example.com/photo.jpg"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <View style={{ height: verticalScale(12) }} />
            <View style={{ flexDirection: "row", gap: scale(12) }}>
              <TouchableOpacity
                style={[styles.cta, styles.later, { flex: 1 }]}
                onPress={() => setShowUrlModal(false)}
              >
                <Text style={styles.laterText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cta, styles.continue, { flex: 1 }]}
                onPress={confirmUrl}
              >
                <Text style={styles.continueText}>Use</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const CARD_PADDING = 16;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff", paddingHorizontal: scale(16) },

  card: {
    flex: 1,
    justifyContent: "center",
  },
  backWrap: { marginTop: verticalScale(8), width: scale(40) },

  title: {
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subTitle: {
    fontSize: moderateScale(14),
    color: "#575757",
    textAlign: "center",
    fontFamily: "Mulish-Regular",
    marginBottom: verticalScale(24),
  },
  previewWrap: {
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  previewCircle: {
    width: scale(156),
    height: scale(156),
    borderRadius: scale(100),
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C2D5D8",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(6),
  },
  placeholderText: {
    color: "#575757",
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
  },

  outlineBtn: {
    alignSelf: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(48),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C2D5D8",
    backgroundColor: "#fff",
  },
  outlineBtnText: {
    color: "#000000",
    fontFamily: "Mulish-SemiBold",
    fontSize: moderateScale(16),
  },

  footer: {
    marginTop: "auto",
    paddingVertical: verticalScale(16),
    gap: verticalScale(12),
  },
  cta: {
    height: verticalScale(48),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  continue: {
    backgroundColor: "#0B7C84",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: moderateScale(14),
  },
  later: {
    backgroundColor: "#153F60",
  },
  laterText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: moderateScale(14),
  },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: scale(16),
  },
  modalCard: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: scale(16),
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E6EA",
    borderRadius: 8,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(14),
  },
});
