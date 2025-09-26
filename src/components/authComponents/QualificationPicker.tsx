import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
};

const MAIN_OPTIONS = ["MBBS", "MSc", "MDS", "BDS", "Others"] as const;
const OTHERS_OPTIONS = ["PG Diploma", "Diplomate", "Fellowship"] as const;
const BACK = "__BACK__";
const PLACEHOLDER = "__PLACEHOLDER__";

const QualificationPicker: React.FC<Props> = ({ value, onChange }) => {
  // Only UI state (for navigating the "Others" submenu). Selection is controlled by parent.
  const [choosingOthers, setChoosingOthers] = useState(false);

  const items = useMemo(
    () => (choosingOthers ? [BACK, ...OTHERS_OPTIONS] : MAIN_OPTIONS),
    [choosingOthers]
  );

  const selectedValue = value || PLACEHOLDER;

  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(val) => {
          const v = String(val);
          console.log("[QualificationPicker] onValueChange ->", v);

          if (v === PLACEHOLDER) return;

          if (!choosingOthers) {
            if (v === "Others") {
              console.log("[QualificationPicker] entering OTHERS submenu");
              setChoosingOthers(true);
              return;
            }
            console.log("[QualificationPicker] selecting qualification:", v);
            onChange?.(v);
          } else {
            if (v === BACK) {
              console.log("[QualificationPicker] back to MAIN options");
              setChoosingOthers(false);
              return;
            }
            console.log("[QualificationPicker] selecting OTHERS qualification:", v);
            setChoosingOthers(false);
            onChange?.(v);
          }
        }}
        mode="dropdown"
        dropdownIconColor="#7B7B7B"
      >
        <Picker.Item
          label="Select qualification"
          value={PLACEHOLDER}
          enabled={false}
        />
        {items.map((it) =>
          it === BACK ? (
            <Picker.Item key={it} label="← Back" value={BACK} />
          ) : (
            <Picker.Item key={it} label={it} value={it} />
          )
        )}
      </Picker>
    </View>
  );
};

export default QualificationPicker;
