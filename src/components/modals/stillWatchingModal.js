import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';


const StillWatchingModal = ({visible, onStay, onLeave}) => {
  const { colors } = useColorContext();
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent,{ backgroundColor: colors.white,}]}>
          <Text style={[styles.modalText,{  color:colors.black,}]}>Are you still watching?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton,{backgroundColor: colors.theme,}]} onPress={onStay}>
              <Text style={[styles.buttonText,{color: colors.white,}]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButtonNo,{ backgroundColor: colors.white,borderColor:colors.theme}]} onPress={onLeave}>
              <Text style={[styles.buttonTextNo,{color: colors.black,}]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
   
    padding: 20,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent:'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600',
  
    textAlign: 'center',
    marginBottom:20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:'center'
  },
  modalButtonNo: {
   
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent:'center',
    borderWidth:1,
    
  },
  buttonText: {
    
    fontSize: 15,
    fontWeight:'500'
  },
  buttonTextNo: {
    
    fontSize: 15,
    fontWeight:'500'
  },
});

export default StillWatchingModal;
