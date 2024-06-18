const WhatsAppBot = require('@green-api/whatsapp-bot');
const { botConfig } = require('../config/config');
const { getData, setData } = require('./firebase');
const rewriter = require('./gemini');

const bot = new WhatsAppBot(botConfig);

const systemMessage = `
You are customer support and Your mission is to answer questions form this text sample conversation below:
# 
Context ....
# Be brief. Use simple english language.
# Never explain that you are a chatbot. 
`;

bot.on('message', async (ctx) => {
    const chatID = ctx.update.message.chat.id.split('@')[0];
    const message = ctx.update.message.text;
    console.log(chatID, message);

    try {
        let data = await getData(`/linkGreenAPI/test/${chatID}`);
        let arr_chat = data ? data.messages : [{ role: "system", content: systemMessage }];
        arr_chat.push({ role: "user", content: message });

        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat });

        const result = await rewriter(message, arr_chat);
        console.log('Rewritten Result:', result);

        await ctx.reply(result);
        arr_chat.push({ role: "system", content: result });

        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat });
    } catch (error) {
        console.error(error);
    }
});

const launchBot = () => {
    bot.launch();
};

module.exports = launchBot;
