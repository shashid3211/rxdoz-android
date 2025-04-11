// notificationService.js

import notifee, {
  AndroidImportance,
  AndroidStyle,
  TriggerType,
  EventType,
  AndroidCategory,
} from '@notifee/react-native';
import {navigationRef} from './NavigationService';
import {
  getMedicineByScheduleId,
  getUserDetail,
  updateMedicineStatus,
} from './DatabaseService';
import {Platform} from 'react-native';

/**
 * Schedules a notification for a specific medicine reminder
 * @param {number} medicineId - The unique ID of the medicine.
 * @param {string} medicineName - The name of the medicine.
 * @param {Date} notificationTime - The time when the notification should be triggered.
 * @param {string} time - The scheduled time for the notification.
 *
 */

const scheduleNotification = async (
  medicineId,
  scheduleId,
  medicineName,
  notificationTime,
  t,
) => {
  try {
    const sound = Platform.Version >= 33 ? 'wakeup' : 'default';
    if (
      !(notificationTime instanceof Date) ||
      isNaN(notificationTime.getTime())
    ) {
      console.error('Invalid notificationTime:', notificationTime);
      throw new Error('Invalid notification time.');
    }

    const user = await getUserDetail();
    console.log('User:', user);

    const createNotificationChannel = async () => {
      const channelId = 'alarm';
      const channels = await notifee.getChannels();

      // Check if the channel already exists
      const channelExists = channels.some(channel => channel.id === channelId);

      if (!channelExists) {
        return await notifee.createChannel({
          id: channelId,
          name: 'Firing alarms & timers',
          lights: true,
          vibration: true,
          vibrationPattern: [300, 500],
          importance: AndroidImportance.HIGH,
          sound: sound,
        });
      }

      return channelId; // Return the existing channel ID
    };
    const time = notificationTime.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const date = notificationTime.toISOString().split('T')[0];

    const channelId = await createNotificationChannel();

    console.log('Channel ID:', channelId);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notificationTime.valueOf(), // Fire at specific date/time
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    const message = t('notificationMessage', {
      time,
      date,
      medicine: medicineName,
    });

    const title = `Hello ${user.name}, Medication Reminder!`;

    const notificationOptions = {
      id: `medicine_${medicineId}_schedule_${scheduleId}`, // Unique ID combining medicineId, date, and time
      title: title,
      body: `It's time to take your medicine: ${medicineName}`,
      android: {
        channelId, // Ensure this channel exists
        sound: sound,
        largeIcon: require('../Assets/logo.jpg'), // Use the local asset
        style: {
          type: AndroidStyle.BIGTEXT,
          text: message,
        },
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        category: AndroidCategory.ALARM,
        fullScreenAction: {
          id: 'default',
        },
        lightUpScreen: true,
        loopSound: true,
        showTimestamp: true,
        actions: [
          {
            title: 'Take',
            pressAction: {
              id: 'take',
              launchActivity: 'default',
            },
          },
          {
            title: 'Skip',
            pressAction: {
              id: 'skip',
              launchActivity: 'default',
            },
          },
        ],
      },
    };

    const notificationId = await notifee.createTriggerNotification(
      notificationOptions,
      trigger,
    );
    console.log(
      `Notification scheduled for ${medicineName} at ${notificationTime}, ${notificationId}`,
    );
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

const cancelNotification = async (medicineId, scheduleId) => {
  try {
    // Generate the same notification ID used while scheduling
    const notificationId = `medicine_${medicineId}_schedule_${scheduleId}`;

    // Cancel the notification
    await notifee.cancelNotification(notificationId);

    console.log(`Notification canceled: ${notificationId}`);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

const handleNotificationPress = () => {
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id) {
      const [medicineId, scheduleId] = getMedicineAndScheduleId(
        detail.notification.id,
      );
      console.log('Notification pressed:', detail.notification.id);
      console.log('Notification pressed:', medicineId, scheduleId);
      if (medicineId && scheduleId) {
        if (detail.pressAction.id === 'take') {
          const res = await updateMedicineStatus(scheduleId, 'taken');
          console.log('Notification pressed:', res);
        } else {
          await updateMedicineStatus(scheduleId, 'missed');
        }
      }
    }
  });

  // Handle background notification events
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id) {
      const [medicineId, scheduleId] = getMedicineAndScheduleId(
        detail.notification.id,
      );

      console.log('Notification pressed Background:', detail.notification.id);
      console.log('Notification pressed:', medicineId, scheduleId);

      if (medicineId && scheduleId) {
        if (detail.pressAction.id === 'take') {
          await updateMedicineStatus(scheduleId, 'taken');
        } else {
          await updateMedicineStatus(scheduleId, 'missed');
        }
      }
    }
  });
};

export const getMedicineAndScheduleId = identifier => {
  const parts = identifier.split('_'); // Split the string by underscores
  const medicineId = parts[1]; // The second part is the medicineId
  const scheduleId = parts[3];
  return [medicineId, scheduleId];
};

export {scheduleNotification, cancelNotification, handleNotificationPress};
