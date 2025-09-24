// SpecialtyPicker.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  qualification?: string; // e.g. "MBBS", "MSc", "MDS", "BDS", "PG Diploma", "Diplomate", "Fellowship"
  value?: string; // selected specialty
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

const PLACEHOLDER = "__PLACEHOLDER__";

const SpecialtyPicker: React.FC<Props> = ({
  qualification,
  value,
  onChange,
}) => {
  const [selected, setSelected] = useState<string>("");

  const options = useMemo(() => {
    if (!qualification) return [];
    return SPECIALTIES[qualification] ?? [];
  }, [qualification]);

  // seed from parent
  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  // reset when qualification changes
  useEffect(() => {
    setSelected("");
  }, [qualification]);

  // notify parent
  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const selectedValue = selected || PLACEHOLDER;

  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(val) => {
          const v = String(val);
          if (v === PLACEHOLDER) return; // ignore placeholder
          setSelected(v);
        }}
        mode="dropdown"
        dropdownIconColor="#7B7B7B"
        enabled={!!qualification && options.length > 0}
      >
        {/* Placeholder: shown as the closed label; disabled so it can't be picked */}
        <Picker.Item
          label={
            !qualification
              ? "Select qualification first"
              : options.length
              ? "Select specialty"
              : "No specialties for this qualification"
          }
          value={PLACEHOLDER}
          enabled={false}
        />

        {/* Actual options only */}
        {options.map((sp) => (
          <Picker.Item key={sp} label={sp} value={sp} />
        ))}
      </Picker>
    </View>
  );
};

export default SpecialtyPicker;
