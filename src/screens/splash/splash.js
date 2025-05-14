import {StyleSheet, View, Image, StatusBar} from 'react-native';
import React,{useEffect} from 'react';
const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View
        style={styles.backgroundImg}
      >
      <Image
        source={require('../../assets/images/splash.png')}
        style={styles.logo}
      />
      </View> 
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImg: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});
