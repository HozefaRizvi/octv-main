import React from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../services/state/context';

const LoginAlert = ({onProceed}) => {
  const navigation = useNavigation();
  const {state, setState} = useAppContext();
  const {isLoggedIn} = state;

  const handleLoginPress = () => {
    setState(prev => ({...prev, pendingRoute: navigation.getState()}));
    navigation.navigate('authStack', {
      screen: 'login',
    });
  };

  const showLoginAlert = () => {
    Alert.alert('Please login to use this feature', '', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => navigation.navigate('HomeIndex'),
      },
      {
        text: 'Login',
        onPress: () => handleLoginPress(),
      },
    ]);
  };

  const handlePress = () => {
    if (isLoggedIn) {
      onProceed();
    } else {
      showLoginAlert();
    }
  };

  return {
    handlePress,
  };
};

export default LoginAlert;
