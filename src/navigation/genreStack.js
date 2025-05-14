import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GenreIndex from '../screens/genre';
import StreamsByGenre from '../screens/genre/streamsByGenre';
import MultiObjects from '../screens/home/multiObjects';
import Quality from '../screens/home/qualityScr';
import Rating from '../screens/home/ratingScr';
import Detailed from '../screens/home/detailedScr';
import PersonDetail from '../screens/home/personDetail';
import Language from '../screens/home/language';
import Genre from '../screens/home/genre';
import Advisory from '../screens/home/advisory';
import Tags from '../screens/home/tags';
import AllCategory from '../screens/home/allCategory';
const Stack = createStackNavigator();
const GenreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GenreIndex"
        component={GenreIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="streamByGenre"
        component={StreamsByGenre}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MultiObjects"
        component={MultiObjects}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Quality"
        component={Quality}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rating"
        component={Rating}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detailed"
        component={Detailed}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PersonDetail"
        component={PersonDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Genre"
        component={Genre}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Advisory"
        component={Advisory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tags"
        component={Tags}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllCategory"
        component={AllCategory}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default GenreStack;
