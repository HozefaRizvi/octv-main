import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Search from '../screens/search/search';
const Stack = createStackNavigator();
const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
