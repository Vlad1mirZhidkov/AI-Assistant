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
        model: process.env.GEMINI_MODEL,
    },

    gcloudConfig: {
        client_id: process.env.GCLOUD_CLIENT_ID,
        project_id: process.env.GCLOUD_PROJECT_ID,
        auth_uri: process.env.GCLOUD_AUTH_URI,
        token_uri: process.env.GCLOUD_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GCLOUD_AUTH_PROVIDER_CERT_URL,
        client_secret: process.env.GCLOUD_CLIENT_SECRET,
        redirect_uris: process.env.REDIRECT_URIS
    }
};
