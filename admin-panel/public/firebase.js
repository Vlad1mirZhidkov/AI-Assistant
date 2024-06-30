import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, child } from "firebase/database";
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

export const getData = async (path) => {
    try {
        const snapshot = await get(child(dbRef, path));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (e) {
        console.error("Error fetching data:", e);
        throw e;
    }
};

export const setData = async (path, data) => {
    try {
        await set(ref(database, path), data);
    } catch (e) {
        console.error("Error setting data:", e);
        throw e;
    }
};
