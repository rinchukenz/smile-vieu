import React, { useMemo, useEffect } from "react";
import { Platform, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  qualification?: string; // e.g. "MBBS", "MSc", "MDS", ...
  value?: string;         // selected specialty (controlled by parent)
  onChange?: (val: string) => void;
};

const SPECIALTIES: Record<string, string[]> = {
  MBBS: [
    "General Medicine",
    "Pediatrics",
    "Dermatology",
    "Psychiatry",
    "Radiology",
    "Anesthesiology",
    "Emergency Medicine",
    "Family Medicine",
  ],
  MSc: [
    "Orthodontics",
    "Oral Surgery",
    "Periodontology",
    "Endodontics",
    "Prosthodontics",
    "Oral Medicine & Radiology",
    "Public Health Dentistry",
  ],
  MDS: [
    "Orthodontics",
    "Oral & Maxillofacial Surgery",
    "Endodontics",
    "Periodontology",
    "Prosthodontics",
    "Pediatric Dentistry",
    "Oral Medicine & Radiology",
    "Public Health Dentistry",
  ],
  BDS: [
    "General Dentistry",
    "Endodontics",
    "Periodontics",
    "Prosthodontics",
    "Oral Surgery",
    "Orthodontics",
    "Pediatric Dentistry",
  ],
  "PG Diploma": [
    "Oral Surgery",
    "Orthodontics",
    "Implantology",
    "Endodontics",
    "Periodontology",
  ],
  Diplomate: [
    "Orthodontics",
    "Implantology",
    "Oral & Maxillofacial Surgery",
    "Endodontics",
  ],
  Fellowship: [
    "Cosmetic Dentistry",
    "Implantology",
    "Oral Oncology",
    "TMJ Disorders",
    "Cleft & Craniofacial",
  ],
};

const normalizeQualification = (
  q?: string
): keyof typeof SPECIALTIES | undefined => {
  if (!q) return undefined;
  const t = q.trim();
  const map: Record<string, keyof typeof SPECIALTIES> = {
    MBBS: "MBBS",
    "M.Sc": "MSc",
    MSC: "MSc",
    MSc: "MSc",
    MDS: "MDS",
    BDS: "BDS",
    "PG DIPLOMA": "PG Diploma",
    "PG Diploma": "PG Diploma",
    Diplomate: "Diplomate",
    Fellowship: "Fellowship",
  };
  if (map[t]) return map[t];

  const ci = t.toLowerCase();
  const fromMap = Object.keys(map).find((k) => k.toLowerCase() === ci);
  if (fromMap) return map[fromMap];

  const fromKeys = Object.keys(SPECIALTIES).find((k) => k.toLowerCase() === ci);
  return fromKeys as keyof typeof SPECIALTIES | undefined;
};

const PLACEHOLDER = "__PLACEHOLDER__";

const SpecialityPicker: React.FC<Props> = ({ qualification, value, onChange }) => {
  const normQ = normalizeQualification(qualification);
  const options = useMemo(() => (normQ ? SPECIALTIES[normQ] ?? [] : []), [normQ]);

  // Clear invalid specialty when qualification changes
  useEffect(() => {
    const valid = !!(value && options.includes(value));
    console.log(
      "[SpecialityPicker] qualification:",
      normQ,
      "current value:",
      value,
      "valid:",
      valid
    );
    if (value && !valid) {
      console.log("[SpecialityPicker] clearing invalid specialty for qualification:", normQ);
      onChange?.("");
    }
  }, [options, value, normQ, onChange]);

  const selectedValue = value && options.includes(value) ? value : PLACEHOLDER;
  const isEnabled = options.length > 0;

  return (
    <View>
      <Picker
        key={normQ || "no-qual"} // remount to reset native state when qualification changes
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          const v = String(itemValue);
          console.log("[SpecialityPicker] onValueChange ->", v);
          if (v === PLACEHOLDER) return; // ignore placeholder
          onChange?.(v);
        }}
        mode={Platform.OS === "android" ? "dialog" : "dropdown"}
        dropdownIconColor="#7B7B7B"
        enabled={isEnabled}
        testID="speciality-picker"
      >
        <Picker.Item
          label={
            !normQ
              ? "Select qualification first"
              : options.length
              ? "Select specialty"
              : "No specialties for this qualification"
          }
          value={PLACEHOLDER}
          enabled={false}
        />
        {options.map((sp) => (
          <Picker.Item key={sp} label={sp} value={sp} />
        ))}
      </Picker>
    </View>
  );
};

export default SpecialityPicker;
