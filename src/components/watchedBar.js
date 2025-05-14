import React from 'react';
import {StyleSheet, View} from 'react-native';
import { useColorContext } from '../services/state/colorsContext';

const WatchedBar = ({watched = 0, total = 0, bottom = 0}) => {
  // const totalWatched = (watched / total) * 100;
    const { colors } = useColorContext();
  return (
    <View style={[styles.container, {bottom: bottom,backgroundColor: colors.white,}]}>
      <View style={[styles.watched, {width: `${watched}%`,backgroundColor: colors.theme,}]} />
    </View>
  );
};
export default WatchedBar;
const styles = StyleSheet.create({
  container: {
    
    position: 'absolute',
    borderRadius: 2.5,
    width: '100%',
    height: 5,
  },
  watched: {
    height: 5,
    borderRadius: 2,
    
  },
});
