// Button.tsx
import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useColorContext } from '../services/state/colorsContext';
import { appCode } from '../services/axios/eps';

const Button = ({onPress,text="Play Now",icon= "play"}) => {
    const { colors } = useColorContext();
  return (
    <TouchableOpacity style={[styles.button,{ backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
      <Icon name={icon} size={17} color={colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
   
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '35%',
    flexDirection:'row'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins-Regular',
  },
});

export default Button;
