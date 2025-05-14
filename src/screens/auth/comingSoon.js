import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import { useColorContext } from '../../services/state/colorsContext';
import { useAppContext } from '../../services/state/context';

const ComingSoon = () => {
  const { colors } = useColorContext();
   const {state} = useAppContext();
  const {logo} = state;
  return (
    <View style={[styles.container,  {backgroundColor: colors.dull}]}>
      <Image
       source={{uri:logo}}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={[styles.txt, {color: colors.theme}]}>Coming soon...</Text>
    </View>
  );
};
export default ComingSoon;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logo: {
    height: 120,
    width: 135,
  },
  txt: {
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 20,
  },
});
