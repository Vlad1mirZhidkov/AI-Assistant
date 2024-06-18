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
    },

    gcloudConfig: {
        client_id:"1076250762043-6jl15qdj5lpjce0fgfkk7fra3jm8a61o.apps.googleusercontent.com",
        project_id:"whatsapp-426813",
        auth_uri:"https://accounts.google.com/o/oauth2/auth",
        token_uri:"https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
        client_secret:"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",
        redirect_uris:["http://localhost"]
    }
};
