/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import './App/Services/BackgroundService.js';
import {notifyBasedOnSchedule} from './App/Services/BackgroundService.js';

notifee.onForegroundEvent(({type, detail}) => {
  const {notification, pressAction} = detail;

  switch (type) {
    case EventType.PRESS:
      // Handle the user pressing the notification
      notifyBasedOnSchedule();
      console.log('User pressed the notification:', notification);
      break;
    // Add other event types if needed
  }
});
AppRegistry.registerComponent(appName, () => App);
