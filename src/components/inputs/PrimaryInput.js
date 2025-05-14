import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColorContext } from '../../services/state/colorsContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const PrimaryInput = ({
  label = '',
  value = '',
  setValue,
  keyBoardType = 'default',
  isPassword = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
        colors={
          isFocused
            ? [colors.theme, colors.darkRed]
            : [colors.disable, colors.disable]
        }
        style={{
          borderRadius: 10,
          height: 62,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {(value?.length > 0 || isFocused) && (
          <View style={{
            position: 'absolute',
            left: '6%',
            top: Platform.OS=== 'ios'?-4:-10,
            backgroundColor: colors.black,
            zIndex: 1,
            paddingHorizontal: 3,
          }}>
            <Text
              style={[
                isFocused ? { color: colors.theme, fontSize: 13 } : { color: colors.disable, fontSize: 13 },
              ]}>
              {label}
            </Text>
          </View>
        )}
        <View style={{
          flexDirection: 'row',
          width: '99%',
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
              height: 59,
              backgroundColor: colors.black,
              color: colors.white,
              borderRadius: 9,
              paddingHorizontal: 20,
              fontSize: 18,
            }}
            secureTextEntry={isPassword && !isPasswordVisible}
            placeholder={value.length > 0 || isFocused ? '' : label}
            placeholderTextColor={colors.gray}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => {
                setIsPasswordVisible(!isPasswordVisible);
              }}
              style={{
                paddingHorizontal: 20,
                backgroundColor: colors.black,
                justifyContent: 'center',
              }}>
              <MaterialIcon
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={colors.theme}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default PrimaryInput;
