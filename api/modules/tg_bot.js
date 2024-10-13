const TelegramBot = require('node-telegram-bot-api');
const token = '#####';
const bot = new TelegramBot(token, {polling: true});

function sendMessage(text) {
    const chatId = "-1002234799030";

    bot.sendMessage(chatId, text)
        .then(() => {
            console.log('Message successfully published!');
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    sendMessage,
};
