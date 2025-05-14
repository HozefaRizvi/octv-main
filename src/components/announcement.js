import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


const AnnouncementBanner = ({text, bgColor, txtColor}) => {
  return (
    <View style={[styles.announcement, {backgroundColor: bgColor}]}>
      <Text style={[styles.announcementText, {color: txtColor}]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  announcement: {
    padding: 3,
    alignItems: 'center',
    // backgroundColor: colors.theme,
  },
  announcementText: {
    fontSize: 10,
    // color: colors.white,
  },
});

export default AnnouncementBanner;
