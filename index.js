/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {API_URL, SECRET_KEY} from '@env';

console.log('API_URL', API_URL);
console.log('SECRET_KEY', SECRET_KEY);
AppRegistry.registerComponent(appName, () => App);
