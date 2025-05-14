import React from 'react';
import {Modal, View, StyleSheet, ActivityIndicator, Text} from 'react-native';

import { useColorContext } from '../../services/state/colorsContext';
const Loader = ({openLoader, setOpenLoader, info = ''}) => {
  const { colors } = useColorContext();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openLoader}
      onRequestClose={() => {
        setOpenLoader(!openLoader);
      }}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView,{color: colors.black,shadowColor: colors.black,}]}>
          <ActivityIndicator size={'large'} color={colors.theme} />
          <Text style={[styles.info,{ color: colors.white,}]}>{info}</Text>
        </View>
      </View>
    </Modal>
  );
};
export default Loader;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    
    width: '100%',
    minHeight: 360,

    borderRadius: 9,
    
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
    paddingHorizontal: '5%',
    paddingVertical: '5%',
  },
  info: {
    fontSize: 20,
    fontWeight: '500',
   
    textAlign: 'center',
  },
});
