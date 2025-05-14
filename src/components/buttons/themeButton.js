import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';

const ThemeButton = ({text = 'Button', type = 'med', pressed, loading}) => {
   const { colors } = useColorContext();
  return (
    <TouchableOpacity
      onPress={() => {
        if (loading) {
          return;
        } else {
          pressed(buttonSizes[type]);
        }
      }}
      activeOpacity={0.8}
      style={[styles.btn, buttonSizes[type]?.btn, { backgroundColor: colors?.theme}]}>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <Text style={[styles.buttonText, buttonSizes[type].txt]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};
export default ThemeButton;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
   
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
});

const buttonSizes = {
  xl: {
    btn: {height: 50, width: '100%', borderRadius: 10},
    txt: {fontSize: 16, fontWeight: '500'},
  },
  lrg: {
    btn: {height: 50, width: '48.5%', borderRadius: 14},
    txt: {fontSize: 14, fontWeight: '700'},
  },
  med: {
    btn: {height: 37, width: '22%', borderRadius: 7},
    txt: {fontSize: 15, fontWeight: '500'},
  },
  sm: {
    btn: {height: 33, width: '14%', borderRadius: 5},
    txt: {fontSize: 12, fontWeight: '500'},
  },
  xs: {
    btn: {height: 23, width: '18%', borderRadius: 5},
    txt: {fontSize: 10, fontWeight: '500'},
  },
  modalBtn: {
    btn: {height: 37, width: '25%', borderRadius: 7},
    txt: {fontSize: 15, fontWeight: '500'},
  },
};
