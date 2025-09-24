// QualificationPicker.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  value?: string;
  onChange?: (val: string) => void;
};

const MAIN_OPTIONS = ['MBBS', 'MSc', 'MDS', 'BDS', 'Others'] as const;
const OTHERS_OPTIONS = ['PG Diploma', 'Diplomate', 'Fellowship'] as const;
const BACK = '__BACK__';

const QualificationPicker: React.FC<Props> = ({ value, onChange }) => {
  const [selected, setSelected] = useState<string>('');
  const [choosingOthers, setChoosingOthers] = useState(false);

  // seed from parent
  useEffect(() => {
    if (value) {
      setSelected(value);
      setChoosingOthers(false);
    }
  }, [value]);

  const items = useMemo(() => {
    return choosingOthers ? [BACK, ...OTHERS_OPTIONS] : MAIN_OPTIONS;
  }, [choosingOthers]);

  // notify parent
  useEffect(() => {
    if (selected) onChange?.(selected);
  }, [selected, onChange]);

  return (
    <View>
      <Picker
        selectedValue={selected || '__PLACEHOLDER__'}
        onValueChange={(val) => {
          const v = String(val);

          if (v === '__PLACEHOLDER__') return; // ignore placeholder clicks

          if (!choosingOthers) {
            if (v === 'Others') {
              setChoosingOthers(true);
              return;
            }
            setSelected(v);
          } else {
            if (v === BACK) {
              setChoosingOthers(false);
              return;
            }
            setSelected(v);
            setChoosingOthers(false);
          }
        }}
        mode="dropdown"
        dropdownIconColor="#7B7B7B"
      >
        {/* hidden placeholder: only visible when picker is closed */}
        <Picker.Item
          label="Select qualification"
          value="__PLACEHOLDER__"
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
