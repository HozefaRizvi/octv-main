import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useColorContext } from '../../services/state/colorsContext';
const BorderButton = ({text = '', pressed}) => {
   const { colors } = useColorContext();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.theme, colors.darkRed]}
      style={styles.linearGradient}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.btn,{backgroundColor: colors.black,}]}
        onPress={() => pressed()}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
export default BorderButton;

const styles = StyleSheet.create({
  linearGradient: {
    height: 37,
    width: '57%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    marginVertical: 10,
  },
  btn: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  buttonText: {
    fontSize: 15,
    color: '#ffffff',
  },
});
