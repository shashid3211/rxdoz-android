import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

const tableName = 'Prescriptions';
const tableName1 = 'Medicines';
const tableName2 = 'Dosage';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'MedicineReminder.db', location: 'default'});
};

export const createTable = async db => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        docName TEXT NOT NULL,
        hospName TEXT NOT NULL
    );`;

  const query1 = `CREATE TABLE IF NOT EXISTS ${tableName1}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prescriptionId INTEGER,
        docName TEXT NOT NULL,
        hospName TEXT NOT NULL,
        medImage TEXT NOT NULL,
        medName TEXT NOT NULL,
        fromDate TEXT NOT NULL,
        toDate TEXT NOT NULL,
        medDose INTEGER NOT NULL,
        medType TEXT NOT NULL,
        medFrequency INTEGER NOT NULL,
        medConsumption TEXT NOT NULL,
        medSchedule1 TEXT NOT NULL,
        medSchedule2 TEXT,
        medSchedule3 TEXT,
        medSchedule4 TEXT
    );`;

  const query2 = `CREATE TABLE IF NOT EXISTS ${tableName2}(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prescriptionId INTEGER,
      docName TEXT NOT NULL,
      hospName TEXT NOT NULL,
      medImage TEXT NOT NULL,
      medName TEXT NOT NULL,
      fromDate TEXT NOT NULL,
      toDate TEXT NOT NULL,
      medDose INTEGER NOT NULL,
      medType TEXT NOT NULL,
      medFrequency INTEGER NOT NULL,
      medConsumption TEXT NOT NULL,
      consumptionTime TEXT NOT NULL,
      consumed TEXT NOT NULL
  );`;

  await db.executeSql(query);
  await db.executeSql(query1);
  await db.executeSql(query2);
};

export const getPrescriptions = async db => {
  try {
    const medItems = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        medItems.push(result.rows.item(index));
      }
    });
    return medItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Items !!!');
  }
};

export const getMedicinesId = async (db, id) => {
  try {
    const medItems = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tableName1} where prescriptionId = ${id}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        medItems.push(result.rows.item(index));
      }
    });
    return medItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Items !!!');
  }
};

export const getMedicines = async db => {
  try {
    const medItems = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName1}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        medItems.push(result.rows.item(index));
      }
    });
    return medItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Items !!!');
  }
};

export const getDosage = async db => {
  try {
    const medItems = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName2}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        medItems.push(result.rows.item(index));
      }
    });
    return medItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Items !!!');
  }
};

export const getDosageTotal = async db => {
  try {
    const medItems = [];
    const results = await db.executeSql(
      `SELECT * FROM ${tableName2} WHERE consumed = 'true'`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        medItems.push(result.rows.item(index));
      }
    });
    return medItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Items !!!');
  }
};

export const savePrescriptions = async (db, medItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(id, docName, hospName) values` +
    medItems.map(i => `(${i.id}, '${i.docName}','${i.hospName}')`).join(',');

  return db.executeSql(insertQuery);
};

export const saveMedicines = async (db, medItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName1}(id,prescriptionId, docName, hospName,
        medImage,
        medName,
        fromDate,
        toDate,
        medDose,
        medType,
        medFrequency,
        medConsumption,
        medSchedule1,
        medSchedule2,
        medSchedule3,
        medSchedule4) values` +
    medItems
      .map(
        i =>
          `(${i.id}, '${i.prescriptionId}','${i.docName}','${i.hospName}','${i.medImage}','${i.medName}','${i.fromDate}','${i.toDate}','${i.medDose}','${i.medType}','${i.medFrequency}','${i.medConsumption}','${i.medSchedule1}','${i.medSchedule2}','${i.medSchedule3}','${i.medSchedule4}')`,
      )
      .join(',');

  return db.executeSql(insertQuery);
};

export const saveDosage = async (db, medItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName2}(id,prescriptionId, docName, hospName,
        medImage,
        medName,
        fromDate,
        toDate,
        medDose,
        medType,
        medFrequency,
        medConsumption,
        consumptionTime,
        consumed) values` +
    medItems
      .map(
        i =>
          `(${i.id}, '${i.prescriptionId}','${i.docName}','${i.hospName}','${i.medImage}','${i.medName}','${i.fromDate}','${i.toDate}','${i.medDose}','${i.medType}','${i.medFrequency}','${i.medConsumption}','${i.consumptionTime}','${i.consumed}')`,
      )
      .join(',');

  return db.executeSql(insertQuery);
};

export const UpdateDosage = async (db, id, p_id) => {
  const updateQuery = `
  UPDATE ${tableName2}
  SET consumed = 'true'
  WHERE id = ${id} AND prescriptionId = ${p_id}`;

  await db.executeSql(updateQuery);
};

export const deletePrescriptionItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteMedicineItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName1} where prescriptionId = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteDosageItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName2} where prescriptionId = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async db => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};

export const deleteTable1 = async db => {
  const query = `drop table ${tableName1}`;

  await db.executeSql(query);
};

export const deleteTable2 = async db => {
  const query = `drop table ${tableName2}`;

  await db.executeSql(query);
};
