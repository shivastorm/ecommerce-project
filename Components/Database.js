// components/Database.js

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'UserData.db',
  location: 'default',
});

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)',
      [],
      (tx, results) => {
        console.log('Table created/already exists.');
      }
    );
  });
};

const insertUserData = (name, email, onSuccess, onError) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO user (name, email) VALUES (?, ?)',
      [name, email],
      (tx, results) => {
        onSuccess();
      },
      (error) => {
        onError(error);
      }
    );
  });
};

const Database = {
  createTable,
  insertUserData,
};

export default Database;
