const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const SESSION = new StringSession('')
const API_ID = 25960001
const API_HASH = '86da715ea0ed76925b740c209710626f'

const client = new TelegramClient(SESSION, API_ID, API_HASH, { connectionRetries: 5 })

async function sendCodeHandler (phoneNumber) {
    await client.connect();
    await client.sendCode(
        {
            apiId: API_ID,
            apiHash: API_HASH
        },
        phoneNumber
    );
}

async function clientStartHandler (phoneNumber, phoneCode) {
    try {

        await client.start({
            phoneNumber: userAuthParamCallback(phoneNumber),
            password: "",
            phoneCode: userAuthParamCallback(phoneCode),
            onError: (err) => console.log(err),
        });

        const sessionData = client.session.save();

        console.log("Successfully connected to Telegram.");
        console.log(sessionData);

        return sessionData;
    } catch (error) {
        console.error("Error in clientStartHandler:", error);
        throw error;
    }
}

function userAuthParamCallback (param) {
    return async function () {
        return await new (resolve => {
            resolve(param)
        })()
    }
}

client.addEventHandler(async (event) => {
    if (event.isMessage && !event.message.out) {
        console.log(`Received message from ${event.message.senderId}: ${event.message.text}`);

        // Echo the received message back to the user
        const message = `You said: ${event.message.text}`;
        await client.sendMessage(event.message.senderId, { message });

        console.log(`Replied to ${event.message.senderId} with: ${message}`);
    }
});

module.exports = {
    sendCodeHandler,
    clientStartHandler
}