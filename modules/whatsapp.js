const WhatsAppBot = require('@green-api/whatsapp-bot');
const { botConfig } = require('../config/config');
const { getData, setData } = require('./firebase');
const {rewriter} = require('./gemini');
const {check_trigger} = require('./gemini')

const bot = new WhatsAppBot(botConfig);

const systemMessage = "" +
    "You are customer support and seller and Your mission is to answer questions, " +
    "you have several rules: " +
    "Be brief. Use simple english language. " +
    "Never explain that you are a chatbot or virtual assistant, you are real man.";

bot.on('message', async (ctx) => {
    const chatID = ctx.update.message.chat.id.split('@')[0];
    const message = ctx.update.message.text;
    console.log(chatID, message);

    try {
        let data = await getData(`/linkGreenAPI/test/${chatID}`);

        let arr_chat = data ? data.messages : [
            {
                role: 'user',
                parts: [{
                    text: systemMessage
                }]
            },

            {
                role: 'model',
                parts: [{
                    text: "Ok, let's go!"
                }]
            },

        ];


        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat });

        const result = await rewriter(message, arr_chat);
        console.log('Rewritten Result:', result);

        arr_chat.push({
            role: 'user',
            parts: [{
                text: message
            }]
        });

        arr_chat.push({
            role: 'model',
            parts: [{
                text: result
            }]
        });

        await check_trigger(arr_chat);

        await ctx.reply(result);

        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat });
    } catch (error) {
        console.error(error);
    }
});

const launchBot = () => {
    bot.launch();
};

module.exports = launchBot;
