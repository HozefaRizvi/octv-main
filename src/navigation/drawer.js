import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from './bottomTabs';
import CustomDrawerContent from './customDrawerContent';
import {colors} from '../assets/colors';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        swipeEnabled: false,
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.black,
        },
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="BottomTabs"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
