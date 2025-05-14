import Register from '../screens/auth/register';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/auth/login';
import Welcome from '../screens/auth/welcomeScreen';
import ForgotPassword from '../screens/auth/forgotPassword';
import EmailVerification from '../screens/auth/emailVerification';
import ProfileList from '../screens/auth/profileList';
import OTPVerification from '../screens/auth/otpVerification';
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="welcome"
        component={Welcome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="emailVerification"
        component={EmailVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="otpVerification"
        component={OTPVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="profileList"
        component={ProfileList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
