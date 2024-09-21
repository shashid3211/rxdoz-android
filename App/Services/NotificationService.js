import notifee, {
  TriggerType,
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import moment from 'moment-timezone';
import {getUpcomingMedicinesAll, getUserDetail} from './DatabaseService';

// Create a channel during app initialization or in a separate setup file
const createNotificationChannel = async () => {
  return await notifee.createChannel({
    id: 'alarm',
    name: 'Firing alarms & timers',
    lights: false,
    vibration: true,
    importance: AndroidImportance.DEFAULT,
    sound: 'notification_ding',
  });
};

// Notification scheduling function
// const notifyBasedOnSchedule = async (t, data) => {
//   console.log('notifyBasedOnSchedule called');
//   try {
//     console.log('data', data);
//     console.log('Scheduling notifications...');
//     const medicines = await getUpcomingMedicinesAll();
//     // console.log('Medicines:', medicines);

//     // Ensure channel creation
//     const channelId = await createNotificationChannel();

//     // Process each medicine
//     for (const medicine of medicines) {
//       const schedules = medicine.upcomingSchedules.filter(Boolean); // Filter out any null or empty values

//       console.log('Schedules:', schedules);

//       // Process each schedule
//       for (const schedule of schedules) {
//         const formattedTime = extractTime(schedule);
//         console.log('Formatted Time:', formattedTime);
//         await processSchedule(formattedTime, medicine, t, channelId);
//       }
//     }
//   } catch (error) {
//     console.error('Error scheduling notifications:', error);
//   }
// };
const notifyBasedOnSchedule = async (t, medicineData) => {
  console.log('notifyBasedOnSchedule called');
  try {
    console.log('Medicine Data:', medicineData);
    console.log('Scheduling notifications...');

    // Ensure channel creation
    const channelId = await createNotificationChannel();

    // Extract relevant data from medicineData
    const {name, description, from_date, to_date, schedule_times} =
      medicineData;
    console.log('Medicine Data:', {
      name,
      description,
      from_date,
      to_date,
      schedule_times,
    });

    // Parse dates
    const startDate = moment(new Date(from_date)).tz('Asia/Kolkata');
    const endDate = moment(new Date(to_date)).tz('Asia/Kolkata');

    // Iterate through each date in the range
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      // Process each schedule time for the current date
      for (const scheduleTime of schedule_times) {
        const formattedTime = extractTime(scheduleTime);
        console.log('Formatted Time:', formattedTime);
        await processSchedule(
          formattedTime,
          currentDate,
          medicineData,
          t,
          channelId,
        );
      }
      // Move to the next day
      currentDate.add(1, 'day');
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

// Get time from schedule
const extractTime = dateString => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to process and create notification for a specific schedule
const processSchedule = async (
  schedule,
  currentDate,
  medicine,
  t,
  channelId,
) => {
  try {
    const [hour, minute] = schedule.split(':').map(Number);
    const scheduleTime = currentDate
      .clone()
      .set({hour, minute, second: 0, millisecond: 0});

    console.log('Schedule Time:', scheduleTime.format());

    // Schedule notification if time is in the future
    if (scheduleTime.isAfter(moment().tz('Asia/Kolkata'))) {
      await createNotification(scheduleTime, medicine, t, channelId);
    } else {
      console.log('Skipping notification: Time is in the past');
    }
  } catch (error) {
    console.error('Error processing schedule:', error);
  }
};

// Function to create a notification
const createNotification = async (scheduleTime, medicine, t, channelId) => {
  try {
    const user = await getUserDetail();
    console.log('User:', user);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: scheduleTime.valueOf(), // Fire at specific date/time
    };

    const dateObj = new Date(scheduleTime);
    const date = dateObj.toISOString().split('T')[0]; // "2024-08-03"
    const time = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const message = t('notificationMessage', {
      time,
      date,
      medicine: medicine.name,
    });

    const title = `Hello ${user.name}`;

    const notificationOptions = {
      title: title,
      body: message,
      android: {
        channelId, // Ensure this channel exists
        largeIcon: require('../Assets/logo.jpg'), // Use the local asset
        style: {
          type: AndroidStyle.BIGTEXT,
          text: message,
        },
        pressAction: {
          id: 'default',
        },
      },
    };

    // Create a trigger notification
    const notificationId = await notifee.createTriggerNotification(
      notificationOptions,
      trigger,
    );
    console.log(`Notification ID: ${notificationId}`);
    console.log(
      `Notification scheduled for ${medicine.name} at ${scheduleTime.format()}`,
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Set a background event handler
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS) {
    console.log('User pressed notification action:', detail.pressAction.id);
    // Handle background notification action press here
  }
});

export default notifyBasedOnSchedule;
