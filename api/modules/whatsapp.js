const WhatsAppBot = require('@green-api/whatsapp-bot');
const { botConfig } = require('../config/config');
const { getData, setData } = require('./firebase');
const {rewriter, check_trigger} = require('./gemini');

const bot = new WhatsAppBot(botConfig);

bot.on('message', async (ctx) => {

    let conf = await getData(`botConfig`);

    let botConf = conf ? conf : {
        query: "" +
            "You are customer support and seller and Your mission is to answer questions, " +
            "you have several rules: " +
            "Be brief. Use simple english language. " +
            "Never explain that you are a chatbot or virtual assistant, you are real man.",
        greeting: "Hello there!",
        triggers: "buy, purchase, anger, frustration, want to talk with real human"

    }

    await setData(`/botConfig`, {
        query: botConf.query,
        greeting: botConf.greeting,
        triggers: botConf.triggers
    });

    const systemMessage = botConf.query;


    const chatID = ctx.update.message.chat.id.split('@')[0];
    const message = ctx.update.message.text;
    console.log(chatID, message);

    try {
        let data = await getData(`/whatsapp/${chatID}`);

        let arr_chat = data ? data : {

            messages: [
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
            ],
            accept: true,
        };

        await setData(`/whatsapp/${chatID}`, {
            messages: arr_chat.messages,
            accept: arr_chat.accept,
        });

        if (arr_chat.accept === false) {
            return;
        }

        let result;
        if (arr_chat.messages.length === 2) {
            result = await getData(`/botConfig/greeting`)
        } else {
            result = await rewriter(message, arr_chat.messages);
        }

        console.log('Rewritten Result:', result);

        arr_chat.messages.push({
            role: 'user',
            parts: [{
                text: message
            }]
        });

        arr_chat.messages.push({
            role: 'model',
            parts: [{
                text: result
            }]
        });

        const resultTrigger = await check_trigger(arr_chat.messages);

        if (resultTrigger === "true") {

            arr_chat.messages.pop();
            arr_chat.messages.push({
                role: 'model',
                parts: [{
                    text: "Okay, we will contact with you soon!"
                }]
            });
            if (arr_chat.accept === true) {
                await ctx.reply("Okay, we will contact with you soon!")
            }
            arr_chat.accept = false;
        } else {
            await ctx.reply(result);

        }

        await setData(`/whatsapp/${chatID}`, {
            messages: arr_chat.messages,
            accept: arr_chat.accept,
        });

    } catch (error) {
        console.error(error);
    }
});

const launchBot = () => {
    bot.launch();
};

module.exports = launchBot;
