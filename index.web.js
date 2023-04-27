import {AppRegistry} from 'react-native';
import App from './App';
import {Platform} from 'react-native';

// Define isWeb property on Platform object
Object.defineProperty(Platform, 'isWeb', {
  get: () => true,
});

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
