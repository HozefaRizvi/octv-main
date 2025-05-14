import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Platform, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MultiSelect} from 'react-native-element-dropdown';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useColorContext } from '../../services/state/colorsContext';
const MultiSelectInput = ({
  selectedCategories,
  setSelectedCategories,
  bgc = '#ffffff',
  data = [],
}) => {
   const { colors } = useColorContext();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.theme, colors.darkRed]}
      style={[styles.linearGradient,{height: 80}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MultiSelect
          style={[styles.dropdown, {backgroundColor: bgc,color: colors.black,}]}
          placeholderStyle={[styles.placeholderStyle,{ color: colors.lightGray,}]}
          selectedTextStyle={[styles.selectedTextStyle,{ color: colors.lightGray,}]}
          itemTextStyle={[styles.itemTextStyle,{  color: colors.black,}]}
          data={data}
          labelField="title"
          valueField="code"
          placeholder="Select"
          value={selectedCategories}
          renderRightIcon={false}
          onChange={item => {
            setSelectedCategories(item);
          }}
          selectedStyle={[styles.selectedStyle,{ borderColor: colors.theme,}]}
          alwaysRenderSelectedItem={false}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={[styles.selectedStyle,{ borderColor: colors.white,}]}>
                <Text style={[styles.textSelectedStyle,{color: colors.white}]}>{item.title}</Text>
                <AntDesignIcon
                  color={colors.error}
                  name="minuscircleo"
                  size={11}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: 35,
    padding: 1.5,
    borderRadius: 5,
    marginVertical: 10,
  },
  dropdown: {
    height: 32,
    borderRadius: 5,
    paddingLeft: 20,
    paddingRight: 10,
    
  },
  itemTextStyle: {
  
  },
  placeholderStyle: {
    fontSize: 16,
   
  },
  selectedTextStyle: {
    fontSize: 12,
   
    fontWeight: '700',
    marginHorizontal: 2,
  },
  selectedStyle: {
    borderRadius: 6,
    borderWidth: 1,
   
    paddingVertical: 3,
    marginHorizontal: 3,
    paddingHorizontal: 5,
    marginVertical: 2,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    marginTop:10,
  },
  textSelectedStyle: {
  
    marginLeft:3
  },
});

export default MultiSelectInput;
