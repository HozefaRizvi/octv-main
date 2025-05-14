import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../services/state/context';
import {
  setActiveProfile,
  setUserData,
  setUserToken,
} from '../../services/dataManager';
import {useColorContext} from '../../services/state/colorsContext';
const AuthHeader = ({heading = '', msg = '', comingFromOtp = false}) => {
  const navigation = useNavigation();
  const {setState} = useAppContext();
  const {state} = useAppContext();
  const {colors} = useColorContext();
  const {logo} = state;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backBtn, {backgroundColor: colors.black}]}
        activeOpacity={0.7}
        onPress={async () => {
          if (comingFromOtp) {
            await Promise.all([
              setUserToken(''),
              setUserData({}),
              setActiveProfile({}),
            ]);
            setState(prev => ({
              ...prev,
              user: '',
              isLoggedIn: false,
            }));
            navigation.navigate('HomeIndex');
          } else {
            navigation.navigate('HomeIndex');
          }
        }}>
        <IonIcon name={'close'} color={colors.white} size={20} />
      </TouchableOpacity>
      <Image source={{uri: logo}} resizeMode="contain" style={styles.logo} />
      <Text style={[styles.heading, {color: colors.darkRed}]}>{heading}</Text>
      {msg && msg.length > 0 && (
        <Text style={[styles.description, {color: colors.darkRed}]}>{msg}</Text>
      )}
    </View>
  );
};
export default AuthHeader;
const styles = StyleSheet.create({
  container: {
    paddingVertical: '5%',
  },
  backBtn: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },
  logo: {
    width: '40%',
    height: 100,
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
  },
});
