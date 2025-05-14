import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../../services/state/context';
import { useColorContext } from '../../services/state/colorsContext';

const ContentNotAvailable = () => {
  const navigation = useNavigation();
   const { state } = useAppContext();
     const { isLoggedIn,logo,slug } = state;
      const {colors} = useColorContext();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.header}
        onPress={() => {
          navigation.goBack();
        }}>
        <IonIcon name={'chevron-back'} color={colors.white} size={30} />
      </TouchableOpacity>
      <View style={styles.body}>
        <Image
          source={{uri:logo}}
          style={styles.img}
          resizeMode='contain'
        />
        <Text style={[styles.msg,{ color: colors.white,}]}>
          Sorry this content is not available in your country
        </Text>
      </View>
    </View>
  );
};
export default ContentNotAvailable;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '5%',
  },
  header: {
    justifyContent: 'center',
    marginTop: '10%',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 150,
    width: 170,
    marginVertical: 20,
  },
  msg: {
    lineHeight: 40,
    fontSize: 32,
    fontWeight: '700',
   
    textAlign: 'center',
    marginHorizontal: '10%',
  },
});
