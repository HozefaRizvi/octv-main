import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PlainInput from '../inputs/plainInput';
import MultiSelectInput from '../inputs/multiSelect';
import ThemeButton from '../buttons/themeButton';
import {useAppContext} from '../../services/state/context';
import {createProfile} from '../../services/axios/apiManager';
import { useColorContext } from '../../services/state/colorsContext';
const AddProfileModal = ({openModal, setOpenModal, getProfilesList}) => {
  const {state, setState} = useAppContext();
  const {user, allRatings} = state;
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { colors } = useColorContext();
  const handleCreateProfile = async () => {
    if (name.length <= 0 || selectedCategories.length <= 0) {
      Alert.alert('Alert', 'Name and categories cannot be empty!', [
        {text: 'Close', onPress: () => {}},
      ]);
      return;
    } else {
      try {
        setLoading(true);
        const data = {
          userId: user.user_id,
          content_rating: selectedCategories,
          name: name,
        };
        const response = await createProfile(data);
        if (response?.data?.data?.id) {
          setName('');
          setSelectedCategories([]);
          getProfilesList();
        }
      } catch (error) {
        console.log('Error in Add profileModal: ', error);
      } finally {
        setLoading(false);
        setOpenModal(!openModal);
      }
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openModal}
      onRequestClose={() => {
        setOpenModal(!openModal);
      }}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView,{ color: colors.black,  backgroundColor: colors.white, shadowColor: colors.black}]}>
          <View style={styles.header}>
            <Text style={[styles.heading,{  color: colors.black,}]}>Add Profile</Text>
            <TouchableOpacity
              onPress={() => {
                setOpenModal(!openModal);
              }}>
              <IonIcon name={'close'} color={colors.black} size={26} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.inputView}>
              <Text style={[styles.label,{ color: colors.theme,}]}>Your Name :</Text>
              <PlainInput
                label={'Name'}
                value={name}
                setValue={setName}
                length={15}
              />
            </View>
            <View style={[styles.inputView]}>
              <Text style={[styles.label,{ color: colors.theme,}]}>Content Rating :</Text>
              <MultiSelectInput
                data={allRatings}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </View>
          </View>
          <View style={styles.btnView}>
            <ThemeButton
              text={'Add'}
              type={'modalBtn'}
              pressed={handleCreateProfile}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default AddProfileModal;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
   
    width: '85%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
  
    fontSize: 21.55,
    fontWeight: '500',
  },
  body: {
    flex: 1,
    marginVertical: '5%',
  },
  inputView: {
    marginTop: 7,
  },
  label: {
    fontSize: 12,
   
  },
  btnView: {
    alignItems: 'center',
  },
});
