require('dotenv').config();

module.exports = {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
    },

    botConfig: {
        idInstance: process.env.BOT_INSTANCE_ID,
        apiTokenInstance: process.env.BOT_API_TOKEN_INSTANCE
    },

    geminiConfig: {
        apiKey: process.env.API_KEY_GEMINI,
        model: "gemini-1.5-flash"
    }
};
