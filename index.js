/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { enableScreens } from 'react-native-screens';
import { Platform } from 'react-native';
enableScreens(false)
AppRegistry.registerComponent(Platform.OS==='android'?appName:'OCTVRN', () => App);
