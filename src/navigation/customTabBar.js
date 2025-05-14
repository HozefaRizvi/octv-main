import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {useColorContext} from '../services/state/colorsContext';
import { appCode } from '../services/axios/eps';

const CustomTabBar = ({state, descriptors, navigation}) => {
  const {colors} = useColorContext();
  return (
    <View
      style={[
        styles.tabBarContainer,
        {backgroundColor: appCode=== 'RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2'? colors.darkRed :  appCode=== '4lIxYy5Ac430Pfy0O0YrEzjlDpyvuPl6' ? colors.dull     : colors.theme      ,    borderColor: colors.white},
      ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const icon = options?.tabBarIcon || null;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          //   const onLongPress = () => {
          //     navigation.emit({
          //       type: 'tabLongPress',
          //       target: route.key,
          //     });
          //   };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              //   onLongPress={onLongPress}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 15,
                justifyContent: 'center',
                alignItems: 'center',
                ...(isFocused && {
                  borderBottomWidth: 2,
                  borderColor: colors.white,
                }),
              }}>
              {icon && icon({focused: isFocused})}
              <Text
                style={{
                  color: isFocused ? colors.white : appCode==='54137662273ec8298e3dfd76e8d2533a' ? colors.white: colors.lightGray,
                  fontSize: 12,
                  fontWeight: isFocused ? '500' : '200',
                  marginBottom: 5,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 70,

    justifyContent: 'center',
    borderTopWidth: 0.5,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomTabBar;
