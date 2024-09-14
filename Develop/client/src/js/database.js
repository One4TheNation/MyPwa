// import { openDB } from 'idb';

// const initdb = async () =>
//   openDB('jate', 1, {
//     upgrade(db) {
//       if (db.objectStoreNames.contains('jate')) {
//         console.log('jate database already exists');
//         return;
//       }
//       db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
//       console.log('jate database created');
//     },
//   });

// // TODO: Add logic to a method that accepts some content and adds it to the database
// export const putDb = async (content) => console.error('putDb not implemented');

// // TODO: Add logic for a method that gets all the content from the database
// export const getDb = async () => console.error('getDb not implemented');

//? initdb();

import { openDB } from "idb";

// Database name and version
const DB_NAME = "jate";
const DB_VERSION = 1;

// Initialize the database
const initdb = async () =>
  openDB(DB_NAME, DB_VERSION, {
    // The upgrade callback is called when the database is first created
    // or when the version number is increased
    upgrade(db) {
      // Check if the object store already exists
      if (db.objectStoreNames.contains(DB_NAME)) {
        console.log("jate database already exists");
        return;
      }
      // If not, create a new object store
      // The keyPath 'id' will be automatically generated and incremented
      db.createObjectStore(DB_NAME, { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// Add content to the database
export const putDb = async (content) => {
  try {
    // Open a connection to the database
    const jateDb = await openDB(DB_NAME, DB_VERSION);

    // Create a new transaction. The second argument is an array of object stores
    // we want to access. In this case, we're using 'readwrite' mode.
    const tx = jateDb.transaction(DB_NAME, "readwrite");

    // Open the object store
    const store = tx.objectStore(DB_NAME);

    // Use the put method to add or update data in the database
    // We're always using id: 1, which means we'll always update the same record
    // This is suitable for a single-document editor
    const request = store.put({ id: 1, value: content });

    // Wait for the request to complete
    const result = await request;
    console.log("Data saved to the database", result);
  } catch (error) {
    console.error("Error in putDb:", error);
  }
};

// Retrieve content from the database
export const getDb = async () => {
  try {
    // Open a connection to the database
    const jateDb = await openDB(DB_NAME, DB_VERSION);

    // Create a new transaction, this time in 'readonly' mode
    const tx = jateDb.transaction(DB_NAME, "readonly");

    // Open the object store
    const store = tx.objectStore(DB_NAME);

    // Use the get method to retrieve the content with id: 1
    const request = store.get(1);

    // Wait for the request to complete
    const result = await request;

    // Return the value if it exists, otherwise return null
    return result?.value || null;
  } catch (error) {
    console.error("Error in getDb:", error);
    return null;
  }
};

// Initialize the database when this module is imported
initdb();

//!
