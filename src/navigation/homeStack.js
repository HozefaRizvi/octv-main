import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeIndex from '../screens/home';
import Home from '../screens/home/home';
import Detailed from '../screens/home/detailedScr';
import MultiObjects from '../screens/home/multiObjects';
import Rating from '../screens/home/ratingScr';
import Quality from '../screens/home/qualityScr';
// import Player from '../screens/home/playerScr';
import PersonDetail from '../screens/home/personDetail';
import Language from '../screens/home/language';
import Advisory from '../screens/home/advisory';
import Tags from '../screens/home/tags';
import Genre from '../screens/home/genre';
// import OrderSummary from '../screens/home/orderSummary';
import SubscriptionPlans from '../screens/player/subPlans';
import CheckPassword from '../screens/player/checkPassword';
import AllCategory from '../screens/home/allCategory';
import GamifiedContent from '../screens/GamifiedContent/gamifiedContent';
import DetailedSeries from '../screens/home/detailedSeries';
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeIndex"
        component={HomeIndex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GamifiedContent"
        component={GamifiedContent}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="DetailedSeries"
        component={DetailedSeries}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeScr"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Detailed"
        component={Detailed}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MultiObjects"
        component={MultiObjects}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rating"
        component={Rating}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Quality"
        component={Quality}
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
      {/* <Stack.Screen
        name="Player"
        component={Player}
        options={{headerShown: false, tabBarVisible: false}}
      /> */}
      <Stack.Screen
        name="PersonDetail"
        component={PersonDetail}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="SubscriptionPlans"
        component={SubscriptionPlans}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckPassword"
        component={CheckPassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
