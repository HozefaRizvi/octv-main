import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import { useColorContext } from '../services/state/colorsContext';

const PremiumIcon = ({item}) => {
      const { colors } = useColorContext();
  const getIconOrLabel = () => {
    if (item.is_newly_added === 'Y') {
      return (
        <View style={[styles.labelNew,{ backgroundColor: colors.theme,}]}>
          <Text style={[styles.labelNewText,{color: colors.white,}]}>New Episode</Text>
        </View>
      );
    }
    if (item.stream_type === 'M' || item.stream_type === 'S') {
      if (item.stream_icon) {
        return (
          <Image source={{uri: item.stream_icon}} style={styles.iconImg} />
        );
      }
      if (item.global_icon) {
        return (
          <Image source={{uri: item.global_icon}} style={styles.iconImg} />
        );
      }
      if (item.monetization_type === 'F' && item.label_free) {
        return (
          <View style={[styles.labelFree,{ backgroundColor: colors.theme,}]}>
            <Text style={[styles.label,{ color: colors.white,}]}>{item.label_free}</Text>
          </View>
        );
      }
      if (
        (item.monetization_type === 'P' ||
          item.monetization_type === 'O' ||
          item.monetization_type === 'S') &&
        item.label_premium
      ) {
        return (
          <View style={[styles.labelPremium,{ backgroundColor: colors.theme,}]}>
            <Text style={[styles.labelP,{color: colors.white,}]}>{item.label_premium}</Text>
          </View>
        );
      }
    }
    if (item.stream_type === 'A' && item.label_ad) {
      return (
        <View style={[styles.labelContainer,{  backgroundColor: colors.theme,}]}>
          <Text style={[styles.label,{ color: colors.white,}]}>{item.label_ad}</Text>
        </View>
      );
    }
    return null;
  };

  return <View style={styles.premium}>{getIconOrLabel()}</View>;
};

export default PremiumIcon;

const styles = StyleSheet.create({
  premium: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 23,
    width: 23,
    top: 5,
    zIndex: 3,
    position: 'absolute',
    left: 0,
    marginHorizontal: '5%',
  },
  iconImg: {
    height: '100%',
    width: '100%',
  },
  labelPremium: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 3,
   
  },
  labelFree: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 3,
   
  },
  labelContainer: {
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 3,
  
  },
  label: {
   
    fontSize: 10,
    fontWeight: '600',
  },
  labelP: {
    
    fontSize: 9,
    fontWeight: '600',
  },
  labelNew: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
    borderRadius: 3,
   
    marginLeft:48,
    bottom:5
  },
  labelNewText: {
    
    fontSize: 10,
    fontWeight: '700',
  },
});
