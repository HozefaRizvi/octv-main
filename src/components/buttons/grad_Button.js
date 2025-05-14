import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColorContext } from '../../services/state/colorsContext';

const GradientButton = ({text = '', pressed}) => {
   const { colors } = useColorContext();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => pressed()}
      activeOpacity={0.7}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.theme, colors.darkRed]}
        style={styles.linearGradient}>
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default GradientButton;

const styles = StyleSheet.create({
  btn: {
    width: '57%',
    height: 37,
    borderRadius: 10,
    marginVertical: 10,
  },
  linearGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#ffffff',
  },
});
