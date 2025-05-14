import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {useAppContext} from '../services/state/context';
import AnnouncementBanner from './announcement';
import { useColorContext } from '../services/state/colorsContext';
import { appCode } from '../services/axios/eps';

const Header = ({logoUrl, navigation}) => {
  const {state} = useAppContext();
  const {announcement} = state;
  const { colors } = useColorContext();
  
  return (
    <View>
      <View style={[styles.header,{backgroundColor: appCode=== 'RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2'? colors.InActive : appCode=== '4lIxYy5Ac430Pfy0O0YrEzjlDpyvuPl6'  || appCode==='C4krQWIxq5Kz53l8GR62MbGJMGxJQlpA' ? colors.dull : colors.theme}]}>
        <View style={[styles.ImgCOntainer,]}>
          <Image source={{uri: logoUrl}} style={styles.logo}  resizeMode='contain'/>
        </View>
        <View style={styles.iconView}>
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => {
              navigation.navigate('searchStack', {
                screen: 'Search',
              });
            }}>
            <Feather name="search" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {announcement?.announcement && (
        <AnnouncementBanner
          text={announcement.announcement}
          bgColor={announcement.announcement_background_color}
          txtColor={announcement.announcement_text_color}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    marginTop: 5,
    
  },
  ImgCOntainer: {
    width:'35%',
    height:80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: 42,
    // aspectRatio: 16 / 9,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    marginHorizontal: 5,
  },
 
});

export default Header;
