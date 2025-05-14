import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Linking} from 'react-native';
import {useAppContext} from '../services/state/context';
import CustomTabBar from './customTabBar';
import GenreStack from './genreStack';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appCode} from '../services/axios/eps';
import { useColorContext } from '../services/state/colorsContext';
const Tab = createBottomTabNavigator();

const renderTabBarIcon = (iconUri, focused, activeColor, inactiveColor) => {
  const [error, setError] = useState(false);
   
  if (error) {
    return (
      <MCIcon
        name="apps" // You can change this to any fallback icon
        size={30}
        color={focused ? appCode==='54137662273ec8298e3dfd76e8d2533a'? 'white': activeColor : appCode==='54137662273ec8298e3dfd76e8d2533a'? 'white':  inactiveColor}
        style={{width: 35, height: 30}}
      />
    );
  }
  return (
    <Image
      source={{uri: iconUri}}
      style={{
        width: 35,
        height: 30,
        tintColor: focused ? activeColor : inactiveColor,
      }}
      resizeMode="contain"
      onError={() => setError(true)}
    />
  );
};

const BottomTabNavigator = () => {
  const {state, setState} = useAppContext();
  const {menus, menuTabsOptions} = state;
   const { colors } = useColorContext();

  const handleTabPress = (menuTitle, externalLink) => {
    if (externalLink) {
      Linking.openURL(externalLink);
    } else {
      const menuSlug = menus?.find(f => f.menu_title === menuTitle).menu_slug;
      setState(prev => ({...prev, slug: menuSlug, isPaused: true}));
      setState(prev => ({...prev, isTrailerPaused: true}));
    }
  };

  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      {menus &&
        menus
          .filter(
            m =>
              m.menu_title !== 'My Fav' &&
              m.menu_title !== 'Settings' &&
              m.menu_title !== 'My Favorites' &&
              m.menu_title !== 'TV Guide' &&
              m.menu_title !== 'About Us' &&
              m.menu_title !== 'My Favorite',
          )
          .map(m => {
            const isExternalLink = m.menu_type === 'E';
            const externalLink = isExternalLink ? m.menu_link : null;
            const isGenreOrVibe =
              m.menu_title === 'Genre' || m.menu_title === 'Vibe';
            const Component = isGenreOrVibe
              ? GenreStack
              : menuTabsOptions[m.menu_title];
            if (isExternalLink) {
              return (
                <Tab.Screen
                  key={m.menu_index}
                  name={m.menu_title}
                  options={{
                    tabBarIcon: ({focused}) => {
                      if (isExternalLink) {
                        if (m.menu_title === 'Shop') {
                          return (
                            <AntDesign
                              name="shoppingcart"
                              size={25}
                              color={focused ? colors.white : appCode==='54137662273ec8298e3dfd76e8d2533a' ?  colors.white:colors.InActive}
                            />
                          );
                        } else if (m.menu_title === 'Advertise') {
                          return (
                            <MCIcon
                              name="advertisements"
                              size={25}
                              color={focused ? colors.white :appCode==='54137662273ec8298e3dfd76e8d2533a' ?  colors.white:colors.InActive}
                            />
                          );
                        } else {
                          return (
                            <MCIcon
                              name="share"
                              size={25}
                              color={focused ? colors.white : appCode==='54137662273ec8298e3dfd76e8d2533a' ?  colors.white:colors.InActive}
                            />
                          );
                        }
                      }
                      renderTabBarIcon(
                        m.tv_menu_icon_active,
                        focused,
                        appCode === 'ece3f29faaa8501b708eaf9cb192e546'
                          ? null
                          : colors.white,
                        appCode === 'ece3f29faaa8501b708eaf9cb192e546'
                          ? null
                          : colors.InActive,
                      );
                    },
                    headerShown: false,
                  }}
                  listeners={{
                    tabPress: e => {
                      e.preventDefault();
                      handleTabPress(m.menu_title, externalLink);
                    },
                  }}>
                  {() => null}
                </Tab.Screen>
              );
            } else if (Component) {
              return (
                <Tab.Screen
                  key={m.menu_index}
                  name={m.menu_title}
                  component={Component}
                  options={{
                    tabBarIcon: ({focused}) =>
                      renderTabBarIcon(
                        m.tv_menu_icon_active,
                        focused,
                        appCode === 'ece3f29faaa8501b708eaf9cb192e546' || '1BVSyXnxnMB3gdnTauVsZTAdtTooujtn'
                          ? null
                          : colors?.white,
                        appCode === 'ece3f29faaa8501b708eaf9cb192e546' || '1BVSyXnxnMB3gdnTauVsZTAdtTooujtn'
                          ? null
                          : colors?.InActive,
                      ),
                    headerShown: false,
                    freezeOnBlur: true,
                  }}
                    listeners={{
              tabPress: () => {
                if (isGenreOrVibe) {
                  setState(prev => ({...prev, categoryType: m?.menu_title?.toLowerCase()}));
                }
                handleTabPress(m.menu_title);
              },
            }}
                />
              );
            } else {
              return null;
            }
          })}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
