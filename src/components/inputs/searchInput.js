import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColorContext } from '../../services/state/colorsContext';
import IonIcon from 'react-native-vector-icons/Ionicons';

const SearchInput = ({
  label = '',
  value = '',
  setValue,
  keyBoardType = 'default',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useColorContext();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={{ width: '100%', marginVertical: 10 }}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={isFocused ? [colors.theme, colors.darkRed] : [colors.disable, colors.disable]}
        style={{
          borderRadius: 10,
          height: Platform.OS==='android'? 47:40,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: colors.black,
          borderRadius: 10,
          alignItems: 'center',
        }}>
          <TextInput
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={keyBoardType}
            onChangeText={setValue}
            style={{
              flex: 1,
              backgroundColor: colors.white,
              color: colors.black,
              borderRadius: 9,
              paddingHorizontal: 20,
              fontSize: 18,
              height: Platform.OS==='android'? undefined:40,
            }}
            placeholder={value.length > 0 || isFocused ? '' : label}
            placeholderTextColor={colors.gray}
          />

          <View style={{
            position: 'absolute',
            right: 10,
            height: '100%',
            paddingHorizontal: 10,
            backgroundColor: colors.white,
            justifyContent: 'center',
          }}>
            <IonIcon name={'search'} size={25} color={colors.theme} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SearchInput;
