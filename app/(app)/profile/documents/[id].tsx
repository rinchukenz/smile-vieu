import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Patient1 from "../../../../assets/images/patientpic1.svg";
import SimpleSearchBar from "@/src/components/common-components/SimpleSearchBar";

export default function PatientDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("images");

  const imageData = [
    {
      id: "1",
      name: "dental-xray-001.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "2",
      name: "dental-xray-002.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "3",
      name: "dental-xray-003.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "4",
      name: "dental-xray-001.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "5",
      name: "dental-xray-002.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "6",
      name: "dental-xray-003.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "7",
      name: "dental-xray-001.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "8",
      name: "dental-xray-002.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
    {
      id: "9",
      name: "dental-xray-003.png",
      src: require("../../../../assets/images/image1.jpg"),
    },
  ];

  const documentData = [
    { id: "1", name: "Medical Summary.pdf" },
    { id: "2", name: "Prescription.docx" },
    { id: "3", name: "Insurance.pdf" },
  ];

  const handleSearch = (text: string) => {
    console.log("User searched:", text);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topIconContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#22466D" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#22466D" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <View style={styles.imageWrapper}>
          <Patient1 width={scale(90)} height={scale(90)} />
        </View>
        <Text style={styles.name}>Smrithi</Text>
        <Text style={styles.age}>28 yrs • Female</Text>
        <Text style={styles.info}>Last opened: 10 Mar 2025</Text>
      </View>

      {/* Middle Section */}
      <View style={styles.middleContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(60) }}
        >
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "images" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("images")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "images" && styles.activeTabText,
                ]}
              >
                Images
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "documents" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("documents")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "documents" && styles.activeTabText,
                ]}
              >
                Documents
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <SimpleSearchBar
            placeholder="Search ..."
            onChangeText={handleSearch}
          />

          {/* Add and Sort */}
          <View style={styles.addContainer}>
            <Ionicons
              name="add-circle-outline"
              size={scale(36)}
              color="#000000ff"
            />

            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>Sort By</Text>
              <Ionicons name="chevron-down" size={scale(16)} color="#000" />
            </TouchableOpacity>
          </View>

          {/* List Content */}
          {activeTab === "images"
            ? imageData.map((item) => (
                <View key={item.id} style={styles.docCard}>
                  <View style={styles.docCardDetails}>
                    <Image source={item.src} style={styles.imageSmall} />
                    <View style={styles.imageDetails}>
                      <Text style={styles.docName}>{item.name}</Text>
                      <Text style={styles.uploadDate}>
                        Uploaded on 13/02/2025
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="#22466D"
                    />
                  </TouchableOpacity>
                </View>
              ))
            : documentData.map((item) => (
                <View key={item.id} style={styles.docCard}>
                  <View style={styles.docCardDetails}>
                    <Ionicons
                      name="document-text-outline"
                      size={40}
                      color="#FF3B30"
                      style={{ marginRight: moderateScale(10) }}
                    />
                    <View style={styles.imageDetails}>
                      <Text style={styles.docName}>{item.name}</Text>
                      <Text style={styles.uploadDate}>
                        Uploaded on 13/02/2025
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={24}
                      color="#22466D"
                    />
                  </TouchableOpacity>
                </View>
              ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(24),
    backgroundColor: "#D7F1F5",
  },
  topIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(24),
    paddingHorizontal: moderateScale(15),
  },
  profileContainer: {
    alignItems: "center",
    gap: verticalScale(8),
    marginBottom: verticalScale(18),
  },
  imageWrapper: {
    width: moderateScale(105),
    height: moderateScale(105),
    borderRadius: moderateScale(55),
    borderWidth: 2,
    borderColor: "#107483",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: moderateScale(20),
    fontFamily: "Mulish-Bold",
  },
  age: {
    fontSize: moderateScale(16),
    fontFamily: "Mulish-Regular",
  },
  info: {
    fontSize: moderateScale(14),
    fontFamily: "Mulish-Regular",
  },
  middleContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: moderateScale(15),
    paddingBottom: verticalScale(10),
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: verticalScale(16),
  },
  tabButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(10),
    borderRadius: 30,
    backgroundColor: "#F2F4F7",
    borderWidth: 1,
    borderColor: "#C2D5D8",
    width: "45%",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#107483",
  },
  tabText: {
    color: "#000000",
    fontFamily: "Mulish-Regular",
    textAlign: "center",
    fontSize: moderateScale(16),
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "Mulish-Bold",
  },
  addContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(16),
    paddingHorizontal: moderateScale(10),
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(14),
    borderWidth: 1,
    borderColor: "#C2D5D8",
    borderRadius: 5,
  },

  sortButtonText: {
    color: "#000",
    fontFamily: "Mulish-Bold",
    fontSize: moderateScale(14),
    marginRight: moderateScale(6),
    textAlign: "center",
  },

  imageSmall: {
    width: moderateScale(65),
    height: moderateScale(65),
    borderRadius: 8,
    marginRight: moderateScale(10),
  },
  imageDetails: {
    gap: verticalScale(4),
  },
  size: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  uploadDate: {
    fontFamily: "Mulish-Regular",
    fontSize: moderateScale(14),
  },
  itemType: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: moderateScale(8),
    backgroundColor: "#E8E8E8",
    fontFamily: "Mulish-Bold",
    fontSize: moderateScale(14),
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F4F7",
    padding: moderateScale(12),
    marginBottom: verticalScale(8),
    borderRadius: 10,
  },
  docCardDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  docName: {
    fontFamily: "Mulish-Regular",
    fontSize: moderateScale(16),
  },
});
