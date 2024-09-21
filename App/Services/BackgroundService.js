// backgroundHandler.js
import notifee, {EventType} from '@notifee/react-native';
import notifyBasedOnSchedule from './NotificationService';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  switch (type) {
    case EventType.PRESS:
      // Handle the user pressing the notification
      console.log('User pressed the notification:', notification);

      await notifyBasedOnSchedule();
      break;
    // Add other event types if needed
  }
});
