import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../assets/colors';
import { useColorContext } from '../../services/state/colorsContext';

const PlainInput = ({
  label = '',
  value = '',
  setValue,
  keyBoardType = 'default',
  length = 100,
}) => {
  const { colors } = useColorContext();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.theme, colors.darkRed]}
      style={styles.linearGradient}>
      <TextInput
        value={value}
        keyboardType={keyBoardType}
        onChangeText={setValue}
        style={[styles.input,{ backgroundColor: colors.white,
    color: colors.black,}]}
        maxLength={length}
        placeholder={`Your ${label} here`}
        placeholderTextColor={colors.gray}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: 33,
    padding: 1.5,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    width: '100%',
   height: 30,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 20,
  },
});

export default PlainInput;
