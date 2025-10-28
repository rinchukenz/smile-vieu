// SimpleSearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { Ionicons } from "@expo/vector-icons";


interface SimpleSearchBarProps extends TextInputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

const SimpleSearchBar: React.FC<SimpleSearchBarProps> = ({
  placeholder = 'Search...',
  onChangeText,
  value,
  ...rest
}) => {
  const [text, setText] = useState(value ?? '');

  const handleChange = (value: string) => {
    setText(value);
    if (onChangeText) onChangeText(value);
  };

  return (
    <View style={styles.container}>
      <Ionicons name='search-outline' size={moderateScale(20)} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
        placeholderTextColor="#888"
        {...rest}
      />
    </View>
  );
};

export default SimpleSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#C2D5D8",
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10),
    //marginBottom: verticalScale(24),
  },
  
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: 'Mulish-Regular',
    color: '#000',
    marginLeft: 10,
  },
});
