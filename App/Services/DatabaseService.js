import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {format} from 'date-fns';
import {
  dayDifference,
  convert12HourTo24Hour,
  getNextDayTimeNow,
} from '../utils/helper';
import {scheduleNotification, cancelNotification} from './NotifyService';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'medicine-reminder.db', location: 'default'});
};

// Initialize the database and create tables
const initializeDatabase = async () => {
  try {
    const db = await getDBConnection();
    await db.executeSql('PRAGMA foreign_keys = ON;');
    // console.log('database', db);

    if (!db || typeof db.executeSql !== 'function') {
      throw new Error(
        'Database not initialized or executeSql method is not available',
      );
    }
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        password TEXT,
        age INTEGER,
        gender TEXT,
        phone_number TEXT,
        wake_up_time TEXT,
        sleep_time TEXT,
        breakfast_time TEXT,
        lunch_time TEXT,
        dinner_time TEXT,
        photo TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS prescription (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        doctor_name TEXT NOT NULL,
        hospital_name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES user(id)
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS medicine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prescription_id INTEGER,
        name TEXT,
        description TEXT,
        from_date TEXT,
        to_date TEXT,
        frequency TEXT,
        dose TEXT,
        consumption TEXT,
        type TEXT,
        instruction TEXT,
        photo TEXT,
        times TEXT,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (prescription_id) REFERENCES prescription(id)
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine_id INTEGER,
        schedule_time TEXT,
        status TEXT,
        FOREIGN KEY (medicine_id) REFERENCES medicine(id))`);

    // await db.executeSql('DROP TABLE IF EXISTS schedule;');
    // await db.executeSql('DROP TABLE IF EXISTS medicine;');
    // await db.executeSql('DROP TABLE IF EXISTS dosage;');

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS dosage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicine_id INTEGER,
        dosage_time TEXT,
        taken BOOLEAN,
        taken_date TEXT,
        FOREIGN KEY (medicine_id) REFERENCES medicine(id)
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get User
const getUserDetail = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
        SELECT * FROM user;
      `,
      [],
    );

    if (results[0].rows.length > 0) {
      return results[0].rows.item(0); // Return the first user entry
    } else {
      return null; // No users found
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Add a user
const addUser = async (
  name,
  email,
  password,
  age,
  gender,
  phoneNumber,
  wakeUpTime,
  sleepTime,
  breakfastTime,
  lunchTime,
  dinnerTime,
  photo,
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const selectResults = await db.executeSql(`SELECT * FROM user;`, []);

    if (selectResults[0].rows.length > 0) {
      const id = selectResults[0].rows.item(0).id; // Return the first user entry
      console.log(id, 'id');
      console.log(name, 'name');

      const updateResults = await db.executeSql(
        `
          UPDATE user
          SET name = ?, email = ?, password = ?, age = ?, gender = ?, phone_number = ?, wake_up_time = ?, sleep_time = ?, breakfast_time = ?, lunch_time = ?, dinner_time = ?, photo = ?
          WHERE id = ?;
          `,
        [
          name,
          email,
          password,
          age,
          gender,
          phoneNumber,
          wakeUpTime.toISOString(),
          sleepTime.toISOString(),
          breakfastTime.toISOString(),
          lunchTime.toISOString(),
          dinnerTime.toISOString(),
          photo,
          id,
        ],
      );
      return updateResults;
    } else {
      const insertResults = await db.executeSql(
        `
          INSERT INTO user (name, email, password, age, gender, phone_number, wake_up_time, sleep_time, breakfast_time, lunch_time, dinner_time, photo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `,
        [
          name,
          email,
          password,
          age,
          gender,
          phoneNumber,
          wakeUpTime.toISOString(),
          sleepTime.toISOString(),
          breakfastTime.toISOString(),
          lunchTime.toISOString(),
          dinnerTime.toISOString(),
          photo,
        ],
      );
      return insertResults[0].insertId;
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Add a prescription
const addPrescription = async (
  userId,
  doctorName,
  hospitalName,
  description,
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
      INSERT INTO prescription (user_id, doctor_name, hospital_name, description)
      VALUES (?, ?, ?, ?);
    `,
      [userId, doctorName, hospitalName, description],
    );
    return results[0];
  } catch (error) {
    console.error('Error adding prescription:', error);
    throw error;
  }
};

// Add a medicine
const addMedicine = async (
  prescriptionId,
  name,
  description,
  fromDate,
  toDate,
  frequency,
  dose,
  consumption,
  type,
  instruction,
  photo,
  scheduleTime,
  t,
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();
    console.log(scheduleTime, 'fromDate');

    const results = await db.executeSql(
      `
      INSERT INTO medicine (prescription_id, name, description, from_date, to_date, frequency, dose, consumption, type, instruction, photo, times )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
      [
        prescriptionId,
        name,
        description,
        fromDate,
        toDate,
        frequency,
        dose,
        consumption,
        type,
        instruction,
        photo,
        JSON.stringify(scheduleTime), // Convert array to JSON string
      ],
    );
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const medicineId = results[0].insertId;
    const currentDate = startDate;
    while (currentDate <= endDate) {
      for (let i = 0; i < scheduleTime.length; i++) {
        const time = scheduleTime[i];
        console.log(time, 'time');
        const {hours, minutes} = convert12HourTo24Hour(time);
        const notificationTime = new Date(currentDate);
        console.log('Hours and Min: ', hours, minutes);
        console.log(notificationTime, 'notificationTime');
        notificationTime.setHours(hours, minutes, 0, 0);
        console.log(notificationTime, 'notificationTime');

        const res = await db.executeSql(
          `
          INSERT INTO schedule (medicine_id, schedule_time, status)
          VALUES (?, ?, ?);
        `,
          [medicineId, notificationTime, 'pending'],
        );
        console.log(res);
        console.log(notificationTime);
        const scheduleId = res[0].insertId;
        await scheduleNotification(
          medicineId,
          scheduleId,
          name,
          notificationTime,
          t,
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    for (let i = 0; i < scheduleTime.length; i++) {}
    return results[0].insertId;
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
};

// Get Medicine By
const getMedicinesAndSchedulesByPrescriptionId = async prescriptionId => {
  try {
    const db = await getDBConnection();

    const results = await db.executeSql(
      `
      SELECT m.id, m.name, m.description, m.from_date, m.to_date, m.frequency, 
             m.dose, m.consumption, m.type, m.instruction, m.photo, m.times,
             s.schedule_time, s.status
      FROM medicine m
      LEFT JOIN schedule s ON m.id = s.medicine_id
      WHERE m.prescription_id = ?
      ORDER BY m.id, s.schedule_time;
    `,
      [prescriptionId],
    );

    const medicines = [];

    // Process the results to group schedules by medicine
    for (let i = 0; i < results[0].rows.length; i++) {
      const row = results[0].rows.item(i);
      const medicineIndex = medicines.findIndex(m => m.id === row.id);

      if (medicineIndex === -1) {
        // If medicine is not in the array, add it
        medicines.push({
          id: row.id,
          name: row.name,
          description: row.description,
          from_date: row.from_date,
          to_date: row.to_date,
          frequency: row.frequency,
          dose: row.dose,
          consumption: row.consumption,
          type: row.type,
          instruction: row.instruction,
          photo: row.photo,
          schedule_times: JSON.parse(row.times),
          schedules: [
            {
              schedule_time: row.schedule_time,
              status: row.status,
            },
          ],
        });
      } else {
        // If medicine already exists, just add the schedule
        medicines[medicineIndex].schedules.push({
          schedule_time: row.schedule_time,
          status: row.status,
        });
      }
    }

    return medicines;
  } catch (error) {
    console.error('Error fetching medicines by prescription ID:', error);
    throw error;
  }
};

const getUpcomingMedicines = async (date, next = false) => {
  try {
    const db = await getDBConnection();

    const nextDayTime = getNextDayTimeNow(date);
    const inputDate = new Date(date);
    inputDate.setHours(23, 59, 999, 0);
    if (next) {
      nextDayTime.setHours(0, 0, 0, 0);
    }

    const query = `
      SELECT m.*, s.schedule_time, s.status, s.id as schedule_id
      FROM medicine m
      JOIN schedule s ON m.id = s.medicine_id
      ORDER BY s.schedule_time ASC
    `;

    const results = await db.executeSql(query);
    const medicines = [];

    // Loop through the results
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        const medicine = result.rows.item(i);
        console.log('Results: ', medicine);

        // Parse the schedule_time into a Date object
        const scheduleTime = new Date(medicine.schedule_time);
        if (
          new Date(scheduleTime) < inputDate &&
          new Date(scheduleTime) > nextDayTime &&
          medicine.status === 'pending'
        ) {
          medicines.push(medicine);
        }
      }
    });
    // console.log('medicines', medicines);
    return medicines;
  } catch (error) {
    console.error('Error fetching today’s upcoming medicines:', error);
    throw error;
  }
};

// Update User
const updateUser = async (
  id,
  name,
  email,
  password,
  age,
  gender,
  phoneNumber,
  wakeUpTime,
  sleepTime,
  breakfastTime,
  lunchTime,
  dinnerTime,
  photo,
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      UPDATE user SET 
        name = ?, 
        email = ?, 
        password = ?, 
        age = ?, 
        gender = ?, 
        phone_number = ?, 
        wake_up_time = ?, 
        sleep_time = ?, 
        breakfast_time = ?, 
        lunch_time = ?, 
        dinner_time = ?, 
        photo = ?
      WHERE id = ?;
    `,
      [
        name,
        email,
        password,
        age,
        gender,
        phoneNumber,
        wakeUpTime,
        sleepTime,
        breakfastTime,
        lunchTime,
        dinnerTime,
        photo,
        id,
      ],
    );
    return id;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update Prescription
const updatePrescription = async (
  id,
  userId,
  doctorName,
  hospitalName,
  description,
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      UPDATE prescription SET 
        user_id = ?, 
        doctor_name = ?, 
        hospital_name = ?, 
        description = ?
      WHERE id = ?;
    `,
      [userId, doctorName, hospitalName, description, id],
    );
    return id;
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

// Update Medicine
const updateMedicine = async (
  medicineId,
  name,
  description,
  fromDate,
  toDate,
  frequency,
  dose,
  consumption,
  type,
  instruction,
  photo,
  scheduleTime,
  t,
) => {
  try {
    console.log('scheduleTime', scheduleTime);
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      UPDATE medicine 
      SET name = ?, description = ?, from_date = ?, to_date = ?, frequency = ?, 
          dose = ?, consumption = ?, type = ?, instruction = ?, photo = ?, times = ?
      WHERE id = ?;
    `,
      [
        name,
        description,
        fromDate,
        toDate,
        frequency,
        dose,
        consumption,
        type,
        instruction,
        photo,
        JSON.stringify(scheduleTime), // Convert array to JSON string
        medicineId,
      ],
    );
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    const res = await db.executeSql(
      `SELECT * FROM schedule WHERE medicine_id =?`,
      [medicineId],
    );
    console.log(res);
    const rows = res[0].rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      const scheduleId = row.id;

      await cancelNotification(medicineId, scheduleId);
    }

    // Update schedules
    await db.executeSql(`DELETE FROM schedule WHERE medicine_id = ?;`, [
      medicineId,
    ]);

    const currentDate = startDate;
    while (currentDate <= endDate) {
      for (let i = 0; i < scheduleTime.length; i++) {
        const time = scheduleTime[i];
        console.log(time, 'time');
        const {hours, minutes} = convert12HourTo24Hour(time);
        const notificationTime = new Date(currentDate);
        console.log('Hours and Min: ', hours, minutes);
        console.log(notificationTime, 'notificationTime');
        notificationTime.setHours(hours, minutes, 0, 0);
        console.log(notificationTime, 'notificationTime');
        const resp = await db.executeSql(
          `
          INSERT INTO schedule (medicine_id, schedule_time, status)
          VALUES (?, ?, ?);
        `,
          [medicineId, notificationTime, 'pending'],
        );
        const scheduleId = resp[0].insertId;
        console.log(resp);
        console.log(notificationTime);
        await scheduleNotification(
          medicineId,
          scheduleId,
          name,
          notificationTime,
          t,
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return medicineId;
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

// Delete User
const deleteUser = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      DELETE FROM user WHERE id = ?;
    `,
      [id],
    );
    return id;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// TODO:Delete Prescription
// TODO: Delete Prescription
const deletePrescription = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await new Promise((resolve, reject) => {
      db.transaction(async tx => {
        try {
          // Fetch all medicines related to the prescription to cancel notifications
          const medicinesResult = await db.executeSql(
            `SELECT id FROM medicine WHERE prescription_id = ?;`,
            [id],
          );

          // Cancel notifications for each medicine
          for (let i = 0; i < medicinesResult[0].rows.length; i++) {
            const medicine = medicinesResult[0].rows.item(i);

            // Fetch all schedules for the current medicine
            const schedulesResult = await db.executeSql(
              `SELECT id FROM schedule WHERE medicine_id = ?;`,
              [medicine.id],
            );

            // Cancel notifications for each associated schedule
            for (let j = 0; j < schedulesResult[0].rows.length; j++) {
              const schedule = schedulesResult[0].rows.item(j);
              await cancelNotification(medicine.id, schedule.id); // Cancel the notification
            }
          }

          // Delete all schedules related to the prescription
          await db.executeSql(
            `DELETE FROM schedule WHERE medicine_id IN (SELECT id FROM medicine WHERE prescription_id = ?);`,
            [id],
          );

          console.log('Schedules deleted successfully.');

          // Delete all medicines related to the prescription
          await db.executeSql(
            `DELETE FROM medicine WHERE prescription_id = ?;`,
            [id],
          );

          console.log('Medicines deleted successfully.');

          // Now delete the prescription itself
          await db.executeSql(`DELETE FROM prescription WHERE id = ?;`, [id]);

          console.log('Prescription deleted successfully with id:', id);

          resolve(); // Resolve the promise when the transaction is complete
        } catch (error) {
          reject(error); // Reject the promise if there's an error
        }
      });
    });

    return id; // Return the deleted prescription ID after everything is completed
  } catch (error) {
    console.error('Error deleting prescription and related data:', error);
    throw error; // Rethrow the error for further handling
  }
};

// Delete Medicine
const deleteMedicine = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const schedules = await db.executeSql(
      `SELECT id FROM schedule WHERE medicine_id = ?;`,
      [id],
    );

    // Cancel notifications for each associated schedule
    for (let i = 0; i < schedules[0].rows.length; i++) {
      const schedule = schedules[0].rows.item(i);
      await cancelNotification(id, schedule.id); // Cancel the notification for the schedule
    }

    // Delete schedules associated with the medicine
    await db.executeSql(`DELETE FROM schedule WHERE medicine_id = ?;`, [id]);

    // Delete the medicine record
    await db.executeSql(`DELETE FROM medicine WHERE id = ?;`, [id]);

    return id;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};

// Get Prescription
const getPrescription = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
      SELECT * FROM prescription;
    `,
      [],
    );

    // Check if there are any results and return the rows
    if (results[0].rows.length > 0) {
      let prescriptions = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        prescriptions.push(results[0].rows.item(i));
      }
      return prescriptions;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching prescription:', error);
    throw error;
  }
};

const getMedicineNotification = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Medicine', [], (tx, results) => {
        const rows = results.rows;

        for (let i = 0; i < rows.length; i++) {
          const medicine = rows.item(i);
          const [medicineHour, medicineMinute] = medicine.time
            .split(':')
            .map(Number);

          // Check if the medicine reminder time is within 10 minutes of the current time
          if (
            (medicineHour === currentHour &&
              Math.abs(medicineMinute - currentMinute) <= 10) ||
            (medicineHour === currentHour + 1 &&
              60 - currentMinute + medicineMinute <= 10)
          ) {
            // Trigger the notification
            return medicine;
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const updateMedicineStatus = async (id, status) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `UPDATE schedule SET status = ? WHERE id = ?;`,
      [status, id],
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAllSchedulesCount = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `SELECT * FROM schedule;
      `,
      [],
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAllSchedulesCountByStatus = async status => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `SELECT * FROM schedule WHERE status = ?;
      `,
      [status],
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAllMissedSchedulesCount = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `SELECT 
          schedule.id AS schedule_id, 
          schedule.schedule_time, 
          schedule.status, 
          medicine.created_at 
       FROM schedule
       JOIN medicine ON schedule.medicine_id = medicine.id
       WHERE schedule.status != 'taken';`, // Ignore taken medicines
      [],
    );

    const schedules = result[0].rows.raw(); // Convert result to array

    const currentTime = new Date(); // Get current time

    // Filter only missed schedules that occurred AFTER the created_at time
    const missedSchedules = schedules.filter(schedule => {
      const scheduleTime = new Date(schedule.schedule_time); // Convert schedule_time to Date
      const createdAtTime = new Date(schedule.created_at); // Convert created_at to Date

      return (
        scheduleTime < currentTime && // Schedule time is in the past
        schedule.status !== 'taken' && // Not taken
        scheduleTime > createdAtTime // Only consider schedules after medicine creation
      );
    });

    console.log(`Missed Schedules Count: ${missedSchedules.length}`);

    return missedSchedules; // Return count
  } catch (error) {
    console.error('Error fetching missed schedules:', error);
    return 0;
  }
};

const getAllMedicines = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `SELECT * FROM medicine;
      `,
      [],
    );
    return result[0].rows.raw();
  } catch (error) {
    console.error(error);
  }
};

const getMedicineDoses = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `
      SELECT m.id AS medicineId, 
             m.name AS medicineName, 
             m.created_at AS medicineCreatedAt, 
             s.schedule_time, 
             s.status
      FROM medicine m
      LEFT JOIN schedule s ON m.id = s.medicine_id;
      `,
      [],
    );

    const schedules = result[0].rows.raw(); // Convert result to array

    // Get current time for comparison
    const currentTime = new Date();

    // Create an object to hold medicine data (total, taken, missed doses)
    const medicineDoses = {};

    // Loop through all schedules and filter based on status and schedule_time
    schedules.forEach(schedule => {
      const {
        medicineId,
        medicineName,
        medicineCreatedAt,
        schedule_time,
        status,
      } = schedule;

      // Convert schedule_time and medicineCreatedAt to JavaScript Date objects
      const scheduleTime = new Date(schedule_time);
      const createdAtTime = new Date(medicineCreatedAt);

      // Initialize medicine object if not already present
      if (!medicineDoses[medicineId]) {
        medicineDoses[medicineId] = {
          medicineName,
          totalDose: 0,
          takenDose: 0,
          missedDose: 0,
        };
      }

      // Add total dose
      medicineDoses[medicineId].totalDose += 1;

      // Check if the dose was taken
      if (status === 'taken') {
        medicineDoses[medicineId].takenDose += 1;
      }

      // Check if the dose is missed (status is 'missed' or time has expired)
      if (
        (status === 'missed' ||
          (scheduleTime < currentTime && status !== 'taken')) &&
        scheduleTime > createdAtTime // Ensure schedule_time is after medicineCreatedAt
      ) {
        medicineDoses[medicineId].missedDose += 1;
      }
    });

    return Object.values(medicineDoses); // Return an array of medicine doses
  } catch (error) {
    console.error('Error fetching medicine doses:', error);
  }
};

const getMedicineById = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const result = await db.executeSql(
      `SELECT * FROM medicine WHERE id = ?;
      `,
      [id],
    );
    return result[0].rows.item(0);
  } catch (error) {
    console.error(error);
  }
};

const getMedicineByScheduleId = async scheduleId => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const query = `
      SELECT m.*, s.schedule_time, s.status, s.id as schedule_id
      FROM medicine m
      JOIN schedule s ON m.id = s.medicine_id
      WHERE s.id = ?
    `;

    const result = await db.executeSql(query, [scheduleId]);

    // Check if there are any results and return the first item
    if (result[0].rows.length > 0) {
      return result[0].rows.item(0);
    } else {
      console.warn(`No schedule found with ID: ${scheduleId}`);
      return null; // Return null if no schedule is found
    }
  } catch (error) {
    console.error('Error fetching medicine by schedule ID:', error);
    return null; // Return null in case of error
  }
};

const getPendingSchedules = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    let pendingMedicines = [];

    const query = `
      SELECT m.*, 
             m.created_at AS medicineCreatedAt, 
             s.schedule_time, 
             s.status, 
             s.id AS schedule_id
      FROM medicine m
      JOIN schedule s ON m.id = s.medicine_id
      ORDER BY s.schedule_time ASC
    `;

    const results = await db.executeSql(query);
    const schedules = results[0].rows.raw();

    schedules.forEach(schedule => {
      const {schedule_time, status, medicineCreatedAt} = schedule;

      const scheduleTime = new Date(schedule_time);
      const createdAtTime = new Date(medicineCreatedAt);
      const currentTime = new Date();

      // Check if the schedule is 'pending' and the time has passed
      if (
        status === 'pending' &&
        scheduleTime < currentTime &&
        scheduleTime > createdAtTime
      ) {
        pendingMedicines.push(schedule);
      }
    });

    return pendingMedicines;
  } catch (error) {
    console.error(error);
  }
};

// Initialize the database
initializeDatabase();

export {
  initializeDatabase,
  addUser,
  getPrescription,
  updateUser,
  deleteUser,
  addPrescription,
  updatePrescription,
  deletePrescription,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getUserDetail,
  getMedicinesAndSchedulesByPrescriptionId,
  getUpcomingMedicines,
  getMedicineNotification,
  updateMedicineStatus,
  getAllSchedulesCount,
  getAllSchedulesCountByStatus,
  getAllMissedSchedulesCount,
  getAllMedicines,
  getMedicineDoses,
  getMedicineById,
  getMedicineByScheduleId,
  getPendingSchedules,
};
