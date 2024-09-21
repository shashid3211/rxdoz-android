import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {format} from 'date-fns';
import {dayDifference} from '../utils/helper';

// Open a connection to the database
// const db = SQLite.openDatabase(
//   {name: 'medicine_reminder.db', location: 'default'},
//   () => console.log('Database opened successfully'),
//   error => console.log('Database error: ', error),
// );

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
        schedule_time TEXT,
        FOREIGN KEY (prescription_id) REFERENCES prescription(id)
      );
    `);

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

// add Dose
const addDose = async (medicineId, dosageTime, taken) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();
    const todayDate = new Date().toISOString().split('T')[0];

    const results = await db.executeSql(
      `
        INSERT INTO dosage (medicine_id, dosage_time, taken, taken_date)
        VALUES (?, ?, ?, ?);
      `,
      [medicineId, dosageTime.toISOString(), taken, todayDate],
    );

    return results;
  } catch (error) {
    console.error('Error adding dose:', error);
  }
};

// Update Dose
const updateDose = async (id, medicineId, dosageTime, taken) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
        UPDATE dosage
        SET medicine_id = ?, dosage_time = ?, taken = ?
        WHERE id = ?;
      `,
      [medicineId, dosageTime.toISOString(), taken, id],
    );

    return results;
  } catch (error) {
    console.error('Error updating dose:', error);
  }
};

const getDoseTakenCount = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
        SELECT COUNT(*) AS count
        FROM dosage
        WHERE taken = 1;
      `,
      [],
    );

    if (results[0].rows.length > 0) {
      return results[0].rows.item(0).count;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error getting dose taken count:', error);
    throw error;
  }
};

const getMissedDosages = async () => {
  const db = await getDBConnection();
  await initializeDatabase();

  try {
    const medicines = await db.executeSql(`SELECT * FROM medicine;`);

    let missedDosages = [];

    for (const medicineRow of medicines[0].rows.raw()) {
      const {id, from_date, to_date, schedule_time} = medicineRow;
      const schedule = JSON.parse(schedule_time); // Assuming schedule_time is a JSON string

      const fromDate = new Date(from_date);
      const toDate = new Date(to_date);

      for (
        let currentDate = new Date(fromDate);
        currentDate <= toDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        for (const time of schedule) {
          const scheduledTime = `${formattedDate} ${time}`;

          const dosageResult = await db.executeSql(
            `SELECT * FROM dosage WHERE medicine_id = ? AND dosage_time = ? AND taken = 1;`,
            [id, scheduledTime],
          );

          if (dosageResult[0].rows.length === 0) {
            missedDosages.push({
              medicine_id: id,
              scheduledTime,
            });
          }
        }
      }
    }

    return missedDosages;
  } catch (error) {
    console.error('Error getting missed dosages:', error);
    throw error;
  }
};

// Get Dose
const getDoseNotTakenCount = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
        SELECT COUNT(*) AS count
        FROM dosage
        WHERE taken = 0;
      `,
      [],
    );

    if (results[0].rows.length > 0) {
      return results[0].rows.item(0).count;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error getting dose not taken count:', error);
    throw error;
  }
};

const getDosageDetails = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const now = new Date(); // Current date and time
    const results = await db.executeSql(
      `
      SELECT id, medicine_id, dosage_time, taken, taken_date
      FROM dosage;
      `,
    );

    const dosageRecords = [];
    const rows = results[0].rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      dosageRecords.push(row);
    }

    return dosageRecords;
  } catch (error) {
    console.error('Error fetching dosage details:', error);
    throw error;
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
) => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
      INSERT INTO medicine (prescription_id, name, description, from_date, to_date, frequency, dose, consumption, type, instruction, photo, schedule_time)
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
    await initializeDatabase();

    const results = await db.executeSql(
      `
      SELECT 
        id as medicine_id,
        name,
        description,
        from_date,
        to_date,
        frequency,
        dose,
        consumption,
        type,
        instruction,
        photo,
        schedule_time
      FROM 
        medicine
      WHERE 
        prescription_id = ?;
      `,
      [prescriptionId],
    );

    const medicines = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      medicines.push({
        id: row.medicine_id,
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
        schedule_times: JSON.parse(row.schedule_time), // Parse JSON string back to array
      });
    }

    return medicines;
  } catch (error) {
    console.error('Error fetching medicines and schedules:', error);
    throw error;
  }
};

// Get medicine details By ID
const getMedicineDetails = async medicineId => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const results = await db.executeSql(
      `
      SELECT * FROM medicine WHERE id = ?;
    `,
      [medicineId],
    );
    return results[0].rows.item(0);
  } catch (error) {
    console.error('Error fetching medicine details:', error);
    throw error;
  }
};

// Get Upcomming Medicine
const getUpcomingMedicinesAll = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const now = new Date(); // Current date and time
    const results = await db.executeSql(
      `
      SELECT id, name, description, from_date, to_date, frequency, dose, consumption, type, instruction, photo, schedule_time
      FROM medicine;
      `,
    );

    const medicines = [];
    const rows = results[0].rows;

    // Function to check if any dosage is taken for the given medicine ID and schedule time
    const isDosageTaken = async (medicineId, dosageTime) => {
      const dosageResults = await db.executeSql(
        `
        SELECT COUNT(*) AS takenCount
        FROM dosage
        WHERE medicine_id = ?
          AND dosage_time = ?
          AND taken = ?
          AND DATE(taken_date) = DATE(?);
        `,
        [
          medicineId,
          dosageTime.toISOString(),
          1,
          new Date().toISOString().split('T')[0],
        ], // Get today's date in YYYY-MM-DD format
      );

      const takenCount = dosageResults[0].rows.item(0).takenCount;
      console.log('takenCount', dosageResults[0].rows.item(0));
      return takenCount > 0;
    };

    // Function to extract time part from a date string
    const extractTimeFromDate = dateString => {
      const date = new Date(dateString);
      return date.toTimeString().split(' ')[0]; // HH:MM:SS
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      const scheduleTimes = JSON.parse(row.schedule_time); // Parse JSON string

      const upcomingSchedules = [];

      for (const scheduleTime of scheduleTimes) {
        const scheduleDate = new Date(scheduleTime);
        const scheduleTimeOnly = extractTimeFromDate(scheduleTime);

        // Check if schedule is upcoming
        if (scheduleTimeOnly >= now.toTimeString().split(' ')[0]) {
          // Check if the dosage has already been taken
          const taken = await isDosageTaken(row.id, scheduleDate);
          if (!taken) {
            upcomingSchedules.push(scheduleTime);
          }
        }
      }

      if (upcomingSchedules.length > 0) {
        medicines.push({
          ...row,
          upcomingSchedules, // Add upcoming schedules to medicine
        });
      }
    }

    // Sort medicines by the earliest upcoming schedule
    medicines.sort((a, b) => {
      const aUpcoming = a.upcomingSchedules[0]
        ? new Date(a.upcomingSchedules[0])
        : new Date(0);
      const bUpcoming = b.upcomingSchedules[0]
        ? new Date(b.upcomingSchedules[0])
        : new Date(0);
      return aUpcoming - bUpcoming;
    });

    return medicines;
  } catch (error) {
    console.error('Error fetching upcoming medicines:', error);
    throw error;
  }
};

const getUpcomingMedicines = async date => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const now = new Date();
    const inputDate = new Date(date); // Use the provided date
    const dateString = inputDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

    const results = await db.executeSql(
      `
      SELECT id, name, description, from_date, to_date, frequency, dose, consumption, type, instruction, photo, schedule_time
      FROM medicine;
      `,
    );

    const medicines = [];
    const rows = results[0].rows;

    const isDosageTaken = async (medicineId, dosageTime) => {
      const dosageResults = await db.executeSql(
        `
        SELECT COUNT(*) AS takenCount
        FROM dosage
        WHERE medicine_id = ? 
          AND dosage_time = ? 
          AND taken = ?
          AND DATE(taken_date) = DATE(?);
        `,
        [medicineId, dosageTime.toISOString(), 1, dateString],
      );

      const takenCount = dosageResults[0].rows.item(0).takenCount;
      console.log('takenCount', dosageResults[0].rows.item(0));
      return takenCount > 0;
    };

    const extractTimeFromDate = dateString => {
      const date = new Date(dateString);
      return date.toTimeString().split(' ')[0];
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      const scheduleTimes = JSON.parse(row.schedule_time);

      const upcomingSchedules = [];

      for (const scheduleTime of scheduleTimes) {
        const scheduleDate = new Date(scheduleTime);
        const scheduleTimeOnly = extractTimeFromDate(scheduleTime);

        if (
          scheduleDate > now ||
          scheduleDate.toISOString().split('T')[0] !==
            now.toISOString().split('T')[0] ||
          scheduleTimeOnly >= now.toTimeString().split(' ')[0]
        ) {
          const taken = await isDosageTaken(row.id, scheduleDate);
          if (!taken) {
            upcomingSchedules.push(scheduleTime);
          }
        }
      }

      if (upcomingSchedules.length > 0) {
        medicines.push({
          ...row,
          upcomingSchedules,
        });
      }
    }

    medicines.sort((a, b) => {
      const aUpcoming = a.upcomingSchedules[0]
        ? new Date(a.upcomingSchedules[0])
        : new Date(0);
      const bUpcoming = b.upcomingSchedules[0]
        ? new Date(b.upcomingSchedules[0])
        : new Date(0);
      return aUpcoming - bUpcoming;
    });

    return medicines;
  } catch (error) {
    console.error('Error fetching upcoming medicines:', error);
    throw error;
  }
};

const getMissedMedicines = async date => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    const now = new Date();
    const inputDate = new Date(date); // Use the provided date
    const dateString = inputDate.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'

    const results = await db.executeSql(
      `
        SELECT id, name, description, from_date, to_date, frequency, dose, consumption, type, instruction, photo, schedule_time
        FROM medicine;
        `,
    );

    const medicines = [];
    const rows = results[0].rows;

    const isDosageTaken = async (medicineId, dosageTime) => {
      const dosageResults = await db.executeSql(
        `
          SELECT COUNT(*) AS takenCount
          FROM dosage
          WHERE medicine_id = ? 
            AND dosage_time = ? 
            AND taken = ?
            AND DATE(taken_date) = DATE(?);
          `,
        [medicineId, dosageTime.toISOString(), 1, dateString],
      );

      const takenCount = dosageResults[0].rows.item(0).takenCount;
      console.log('takenCount', dosageResults[0].rows.item(0));
      return takenCount > 0;
    };

    const extractTimeFromDate = dateString => {
      const d = new Date(dateString);
      return d.toTimeString().split(' ')[0];
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      const scheduleTimes = JSON.parse(row.schedule_time);

      const upcomingSchedules = [];

      for (const scheduleTime of scheduleTimes) {
        const scheduleDate = new Date(scheduleTime);
        const scheduleTimeOnly = extractTimeFromDate(scheduleTime);
        console.log('Misside Condition: ', now >= new Date(row.from_date));

        if (
          now >= new Date(row.from_date) &&
          scheduleTimeOnly < now.toTimeString().split(' ')[0]
        ) {
          console.log('missed', scheduleTime);
          const taken = await isDosageTaken(row.id, scheduleDate);
          if (!taken) {
            upcomingSchedules.push(scheduleTime);
          }
        }
      }

      if (upcomingSchedules.length > 0) {
        medicines.push({
          ...row,
          upcomingSchedules,
        });
      }
    }

    medicines.sort((a, b) => {
      const aUpcoming = a.upcomingSchedules[0]
        ? new Date(a.upcomingSchedules[0])
        : new Date(0);
      const bUpcoming = b.upcomingSchedules[0]
        ? new Date(b.upcomingSchedules[0])
        : new Date(0);
      return aUpcoming - bUpcoming;
    });

    return medicines;
  } catch (error) {
    console.error('Error fetching upcoming medicines:', error);
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
  id,
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
  schedule_time,
) => {
  console.log(
    'Data For Update: ',
    id,
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
    schedule_time,
  );
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      UPDATE medicine SET 
        prescription_id = ?, 
        name = ?, 
        description = ?, 
        from_date = ?, 
        to_date = ?, 
        frequency = ?, 
        dose = ?, 
        consumption = ?, 
        type = ?, 
        instruction = ?, 
        photo = ?,
        schedule_time = ?
      WHERE id = ?;
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
        JSON.stringify(schedule_time), // Convert array to JSON string
        id,
      ],
    );
    return id;
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

// Delete Prescription
const deletePrescription = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.transaction(tx => {
      // Delete all medicines related to the prescription
      tx.executeSql(
        `DELETE FROM medicine WHERE prescription_id = ?;`,
        [id],
        (tx, result) => {
          console.log('Medicine Delete Response: ', result);

          // Now delete the prescription itself
          tx.executeSql(
            `DELETE FROM prescription WHERE id = ?;`,
            [id],
            (tx, result) => {
              console.log('Prescription Delete Response: ', result);
              console.log('Successfully deleted prescription with id: ', id);
            },
            (tx, error) => {
              console.error('Error deleting prescription:', error);
              throw error;
            },
          );
        },
        (tx, error) => {
          console.error('Error deleting medicines:', error);
          throw error;
        },
      );
    });

    return id;
  } catch (error) {
    console.error('Error deleting prescription and related medicines:', error);
    throw error;
  }
};

// Delete Medicine
const deleteMedicine = async id => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    await db.executeSql(
      `
      DELETE FROM medicine WHERE id = ?;
    `,
      [id],
    );
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

// Count
const getTotalCountOfScheduleTimes = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();
    // const fromDate = new Date().toDateString();
    // console.log('fromDate', fromDate);
    const today = new Date();
    const isoToday = today.toISOString().split('T')[0];

    // Query to get records where today's date is between from_date and to_date
    const results = await db.executeSql(
      `
      SELECT * FROM medicine
     ;
    `,
      [],
    );

    let totalCount = 0;

    // Iterate through results and count schedule_times
    const rows = results[0].rows;

    for (let i = 0; i < rows.length; i++) {
      const record = rows.item(i);
      const fromDate = new Date(record.from_date).toISOString().split('T')[0];
      const toDate = new Date(record.to_date).toISOString().split('T')[0];

      console.log(fromDate, toDate);
      console.log(isoToday);

      // Check if today's date is between fromDate and toDate
      if (isoToday >= fromDate && isoToday <= toDate) {
        const scheduleTimesJSON = record.schedule_time;
        const totalDays = dayDifference(isoToday, fromDate);
        console.log('Total Days: ', totalDays);

        if (scheduleTimesJSON) {
          try {
            // Parse the JSON data
            const scheduleTimes = JSON.parse(scheduleTimesJSON);

            // Count the number of schedules

            totalCount +=
              totalDays * Array.isArray(scheduleTimes)
                ? scheduleTimes.length
                : 0;
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
        console.log(scheduleTimesJSON);
      }
    }
    console.log(totalCount);
    return totalCount;
  } catch (error) {
    console.error('Error getting total count of schedule times:', error);
    throw error;
  }
};

const getMedicineWiseTakenReport = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    // Fetch all dosages
    const dosageResults = await db.executeSql(
      `
      SELECT medicine_id, dosage_time, taken
      FROM dosage;
      `,
    );

    // Fetch all medicines
    const medicineResults = await db.executeSql(
      `
      SELECT id, name, description
      FROM medicine;
      `,
    );

    const dosages = [];
    const medicines = [];

    // Process dosage results
    const dosageRows = dosageResults[0].rows;
    for (let i = 0; i < dosageRows.length; i++) {
      const row = dosageRows.item(i);
      dosages.push(row);
    }

    // Process medicine results
    const medicineRows = medicineResults[0].rows;
    for (let i = 0; i < medicineRows.length; i++) {
      const row = medicineRows.item(i);
      medicines.push(row);
    }

    return {dosages, medicines};
  } catch (error) {
    console.error('Error fetching dosages and medicines:', error);
    throw error;
  }
};

// Missed Med Count
const getMissedDosagesCount = async () => {
  const db = await getDBConnection();
  await initializeDatabase();

  try {
    const medicines = await db.executeSql(`SELECT * FROM medicine;`);

    let missedDosagesCount = 0;
    const currentDate = new Date();

    for (const medicineRow of medicines[0].rows.raw()) {
      const {id, from_date, schedule_time} = medicineRow;
      const schedule = JSON.parse(schedule_time); // Assuming schedule_time is a JSON string

      const fromDate = new Date(from_date);

      for (
        let date = new Date(fromDate);
        date <= currentDate;
        date.setDate(date.getDate() + 1)
      ) {
        const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        // Format as HH:MM:SS
        const formattedCurrentTime = new Date()
          .toISOString()
          .split('T')[1]
          .split('.')[0];

        for (const time of schedule) {
          // const scheduledTime = `${formattedDate} ${time}`;
          // Format Time as HH:MM:SS
          // const scheduledTime = `${formattedDate} ${time}`;
          // Format Time as HH:MM:SS
          const formattedTime = new Date(time)
            .toISOString()
            .split('T')[1]
            .split('.')[0];

          const dosageResult = await db.executeSql(
            `SELECT * FROM dosage WHERE medicine_id = ? AND dosage_time = ? AND taken_date = ? AND taken = 1;`,
            [id, time, formattedDate],
          );

          if (
            dosageResult[0].rows.length === 0 &&
            formattedTime < formattedCurrentTime
          ) {
            missedDosagesCount++;
          }
        }
      }
    }

    return missedDosagesCount;
  } catch (error) {
    console.error('Error getting missed dosages count:', error);
    throw error;
  }
};

const getGroupedMedicineStats = async () => {
  try {
    const db = await getDBConnection();
    await initializeDatabase();

    // Fetch all medicines within the date range
    const [totalMedicinesResult] = await db.executeSql(`
      SELECT id, name, from_date, to_date, schedule_time
      FROM medicine;
    `);

    const medicines = totalMedicinesResult.rows.raw();
    let groupedStats = {};

    for (const medicine of medicines) {
      const schedules = JSON.parse(medicine.schedule_time);

      if (!groupedStats[medicine.name]) {
        groupedStats[medicine.name] = {
          total: 0,
          taken: 0,
          missed: 0,
          notUpdated: 0,
        };
      }

      const fromDate = new Date(medicine.from_date).toISOString().split('T')[0];
      const toDate = new Date(medicine.to_date).toISOString().split('T')[0];

      const now = new Date();
      console.log('Now: ', now);
      console.log('From Date: ', fromDate);
      console.log('To Date: ', toDate);
      const nw = now.toISOString().split('T')[0];

      // Loop from from_date to to_date for total and taken counts
      for (
        let d = new Date(fromDate);
        d <= new Date(toDate);
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.toISOString().split('T')[0];
        for (const schedule of schedules) {
          // Formt to HH:MM:SS

          const scheduleDateTime = new Date(schedule)
            .toTimeString()
            .split('T')[0];
          const nwTime = now.toTimeString().split('T')[0];
          // if (scheduleDateTime >= fromDate && scheduleDateTime <= toDate) {
          groupedStats[medicine.name].total++;

          if (day <= nw && scheduleDateTime <= nwTime) {
            console.log('Schedule: ', scheduleDateTime);
            console.log('Now: ', nwTime);
            const [dosageResult] = await db.executeSql(
              `SELECT * FROM dosage WHERE medicine_id = ? AND dosage_time = ? AND taken_date = ? OR taken=1;`,
              [medicine.id, schedule, day],
            );
            console.log('Dosage Result: ', dosageResult);

            if (dosageResult.rows.length > 0) {
              const dosage = dosageResult.rows.item(0);
              if (dosage.taken) {
                groupedStats[medicine.name].taken++;
              }
            }
          }
        }
      }

      // Loop from from_date to now for missed and not updated counts
      for (
        let d = new Date(fromDate);
        d <= new Date(toDate);
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.toISOString().split('T')[0];
        // const nw = now.toISOString().split('T')[0];
        for (const schedule of schedules) {
          const scheduleTime = new Date(schedule).toTimeString().split(' ')[0];
          const scheduleDateTime = new Date(`${day}T${scheduleTime}`);
          const nwDate = now.toISOString().split('T')[0];
          const nwTime = now.toTimeString().split(' ')[0];
          const nwDateTime = new Date(`${nwDate}T${nwTime}`);
          console.log('Schedule Time Now: ', nwDateTime, scheduleDateTime);

          if (scheduleDateTime <= nwDateTime) {
            console.log('Missed Time Now: ', nwTime);
            const [dosageResult] = await db.executeSql(
              `SELECT * FROM dosage WHERE medicine_id = ? AND dosage_time = ? AND taken_date = ? OR taken=0;`,
              [medicine.id, schedule, day],
            );

            if (dosageResult.rows.length > 0) {
              const dosage = dosageResult.rows.item(0);
              if (!dosage.taken) {
                groupedStats[medicine.name].missed++;
              }
            } else {
              // if(scheduleDateTime)
              groupedStats[medicine.name].notUpdated++;
            }
          }
        }
      }
    }

    const result = Object.keys(groupedStats).map(name => ({
      description: medicines.find(med => med.name === name).description,
      name: name,
      notTakenCount: groupedStats[name].missed + groupedStats[name].notUpdated,
      takenCount: groupedStats[name].taken,
      totalDosages: groupedStats[name].total,
    }));

    return result;
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
  addDose,
  updateDose,
  getDosageDetails,
  getDoseNotTakenCount,
  getDoseTakenCount,
  getTotalCountOfScheduleTimes,
  getMedicineWiseTakenReport,
  getMissedMedicines,
  getMissedDosages,
  getMissedDosagesCount,
  getUpcomingMedicinesAll,
  getGroupedMedicineStats,
};
