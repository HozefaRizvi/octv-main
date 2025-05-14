import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserToken = async data => {
  try {
    await AsyncStorage.setItem('USER_TOKEN', JSON.stringify(data));
  } catch {
    error => {
      console.log('Error on setting User Token', error);
    };
  }
};

export const getUserToken = async () => {
  try {
    let userToken = await AsyncStorage.getItem('USER_TOKEN');
    if (userToken) {
      return JSON.parse(userToken);
    }
    return null;
  } catch (error) {
    console.log('Error on getting User Token', error);
    return null;
  }
};

export const setUserData = async data => {
  try {
    await AsyncStorage.setItem('USER_DATA', JSON.stringify(data));
  } catch {
    error => {
      console.log('Error on setting User Data', error);
    };
  }
};

export const getUserData = async () => {
  try {
    let userData = await AsyncStorage.getItem('USER_DATA');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.log('Error on getting User Data', error);
    return null;
  }
};

export const setActiveProfile = async data => {
  try {
    await AsyncStorage.setItem('ACTIVE_PROFILE', JSON.stringify(data));
  } catch {
    error => {
      console.log('Error on setting Active Profile Data', error);
    };
  }
};

export const getActiveProfile = async () => {
  try {
    let userData = await AsyncStorage.getItem('ACTIVE_PROFILE');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.log('Error on getting Active Profile Data', error);
    return null;
  }
};

export const setStreamPasswords = async data => {
  try {
    await AsyncStorage.setItem('STREAM_PASSWORDS', JSON.stringify(data));
  } catch {
    error => {
      console.log('Error on setting Active Profile Data', error);
    };
  }
};

export const getStreamPasswords = async () => {
  try {
    let userData = await AsyncStorage.getItem('STREAM_PASSWORDS');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.log('Error on getting Active Profile Data', error);
    return null;
  }
};

export const setDeviceId = async data => {
  try {
    await AsyncStorage.setItem('DEVICE_ID', JSON.stringify(data));
  } catch {
    error => {
      console.log('Error on setting Active Profile Data', error);
    };
  }
};

export const getDeviceId = async () => {
  try {
    let userData = await AsyncStorage.getItem('DEVICE_ID');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.log('Error on getting Active Profile Data', error);
    return null;
  }
};
