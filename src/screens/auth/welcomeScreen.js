import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import GradientButton from '../../components/buttons/grad_Button';
import BorderButton from '../../components/buttons/borderButton';
import {useNavigation} from '@react-navigation/native';
import { useAppContext } from '../../services/state/context';

const Welcome = () => {
  const navigation = useNavigation();
   const {state} = useAppContext();
  const {logo} = state;
  return (
    <ImageBackground
      source={require('../../assets/images/wcbg.png')}
      resizeMode="cover"
      style={styles.bgImage}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Image
          source={{uri:logo}}
          style={styles.logo}
          resizeMode='contain'
        />
        <View style={styles.btnView}>
          <GradientButton
            text={'Sign In'}
            pressed={() => {
              navigation.navigate('login');
            }}
          />
          <BorderButton
            text={'Register'}
            pressed={() => {
              navigation.navigate('register');
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    height: 129,
    width: 145,
    top: '35%',
  },
  btnView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: '56%',
  },
});
