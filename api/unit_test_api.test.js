// Tests of the work of the database module
const { getData } = require('./modules/firebase');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database');
const { firebaseConfig } = require('./config/config');

jest.mock('firebase/app');
jest.mock('firebase/database');

describe('Firebase module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getData function', async () => {
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const dbRef = ref(database);
        const snapshot = {
            exists: jest.fn(() => true),
            val: jest.fn(() => 'test data'),
        };

        get.mockImplementation(() => Promise.resolve(snapshot));

        const result = await getData('test/path');

        expect(get).toHaveBeenCalledWith(child(dbRef, 'test/path'));
        expect(result).toBe('test data');
    });
});

// Tests of the work of the Gemini module
const { initializeAuth, initializeVertexAI, check_trigger, rewriter } = require('./modules/gemini');
const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuth } = require('google-auth-library');

jest.mock('@google-cloud/vertexai');
jest.mock('google-auth-library');

describe('Gemini module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('initializeAuth function', async () => {
        const auth = new GoogleAuth({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
        const authClient = await auth.getClient();
        const result = await initializeAuth();

        expect(result).toEqual(authClient);
    });

    test('initializeVertexAI function', async () => {
        const vertexAI = new VertexAI({
            project: process.env.VERTEX_AI_PROJECT_ID,
            location: 'us-central1',
            authClient: await initializeAuth()
        });
        const generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-pro',
            systemInstruction: "You are customer support and seller. Your mission is to answer questions. " +
                "You have several rules: Be brief. Use simple English language. " +
                "Never explain that you are a chatbot or virtual assistant, you are a real person."
        });
        const result = await initializeVertexAI();

        expect(result).toEqual(generativeModel);
    });

    test('rewriter function', async () => {
        const context_text = 'test context text';
        const arrChat = 'test arrChat';
        const result = await rewriter(context_text, arrChat);

        expect(result).toBe(context_text);
    });
});
