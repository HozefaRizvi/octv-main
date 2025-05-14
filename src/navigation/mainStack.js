import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './drawer';
import DrawerStack from './drawerStack';
import AuthStack from './authStack';
import SearchStack from './searchStack';
import PlayerStack from './playerStack';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="drawerNavigator"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="drawerStack"
        component={DrawerStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="authStack"
        component={AuthStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="searchStack"
        component={SearchStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="playerStack"
        component={PlayerStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
