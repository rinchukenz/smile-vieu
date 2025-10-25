// app/(auth)/upload-profile-picture.tsx
import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePicture } from "@/src/api/auth";
//import { uploadProfilePicture } from "../../apis/authApi";

export default function UploadProfilePicture() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleBackPress = () => router.back();

  const onSkip = () => {
    console.log("Skip profile photo");
    router.push("/(auth)/profileCreated");
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onUploadPress = () => {
    // For native, we show URL modal OR pick from gallery
    pickImageFromGallery();
  };

  const confirmUrl = () => {
    if (!tempUrl.trim()) return;
    setImageUri(tempUrl.trim());
    setShowUrlModal(false);
    setTempUrl("");
  };

const onContinue = async () => {
  if (!imageUri) {
    console.log("No image selected");
    router.push("/(auth)/profileCreated");
    return;
  }

  try {
    setUploading(true);

    let file: { uri: string; name: string; type: string } | null = null;

    if (imageUri.startsWith("http")) {
      // If user pasted URL, you might skip upload and send URL to backend
      console.log("Using URL directly:", imageUri);
      // Optionally call API to save profile picture by URL
      router.push("/(auth)/profileCreated");
      return;
    } else {
      // Local file from ImagePicker
      const uriParts = imageUri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split(".").pop() || "jpg";

      file = {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      };
    }

    console.log("Prepared file for upload:", file);

    const response = await uploadProfilePicture(file!);

    router.push("/(auth)/profileCreated");


    
  } catch (err: any) {
    console.error("Upload error:", err.response?.data || err.message);
  } finally {
    setUploading(false);
  }
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
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.cta, styles.later]} onPress={onSkip}>
          <Text style={styles.laterText}>Do it later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cta, styles.continue]}
          onPress={onContinue}
          disabled={uploading}
        >
          <Text style={styles.continueText}>
            {uploading ? "Uploading..." : "Continue"}
          </Text>
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
