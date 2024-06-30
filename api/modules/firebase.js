const { initializeApp } = require ("firebase/app");
const { getDatabase, ref, get, set, child } = require("firebase/database");
const { firebaseConfig } = require ('../config/config');

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

const getData = async (path) => {
    try {
        const snapshot = await get(child(dbRef, path));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (e) {
        console.error("Error fetching data:", e);
        throw e;
    }
};

const setData = async (path, data) => {
    try {
        await set(ref(database, path), data);
    } catch (e) {
        console.error("Error setting data:", e);
        throw e;
    }
};


module.exports = {
    getData,
    setData
};
