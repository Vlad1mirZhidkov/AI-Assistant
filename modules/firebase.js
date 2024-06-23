const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set, child } = require("firebase/database");
const { firebaseConfig } = require('../config/config');

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

const getData =  (path) => {
        const snapshot = get(child(dbRef, path)).then(snap=>{
            return snapshot.exists() ? snapshot.val() : null;
        }).catch(e=>{
            console.error("Error fetching data:", e);
            throw e;
        });
        return snapshot
};

const setData =  (path, data) => {
    set(ref(database, path), data).then().catch(e=>{
        console.error("Error setting data:", e);
        throw e;
    });
};

module.exports = {
    getData,
    setData
};
