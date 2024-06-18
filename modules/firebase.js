const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set, child } = require("firebase/database");
const { firebaseConfig } = require('../config/config');

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

const getData = async (path) => {
    try {
        const snapshot = await get(child(dbRef, path));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

const setData = async (path, data) => {
    try {
        await set(ref(database, path), data);
    } catch (error) {
        console.error("Error setting data:", error);
        throw error;
    }
};

module.exports = {
    getData,
    setData
};
