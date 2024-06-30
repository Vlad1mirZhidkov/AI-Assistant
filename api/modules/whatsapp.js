const WhatsAppBot = require('@green-api/whatsapp-bot');
const { botConfig } = require('../config/config');
const { getData, setData } = require('./firebase');
const {rewriter} = require('./gemini');
const {check_trigger} = require('./gemini')

const bot = new WhatsAppBot(botConfig);

bot.on('message', async (ctx) => {

    let conf = await getData(`/linkGreenAPI/test/botConfig`);

    let botConf = conf ? conf : {
        query: "" +
            "You are customer support and seller and Your mission is to answer questions, " +
            "you have several rules: " +
            "Be brief. Use simple english language. " +
            "Never explain that you are a chatbot or virtual assistant, you are real man.",
        greeting: "Hello.",
        triggers: "buy, purchase, anger, frustration, want to talk with real human"

    }

    await setData(`/linkGreenAPI/test/botConfig`, {
        query: botConf.query,
        greeting: botConf.greeting,
        triggers: botConf.triggers
    });

    const systemMessage = botConf.query;


    const chatID = ctx.update.message.chat.id.split('@')[0];
    const message = ctx.update.message.text;
    console.log(chatID, message);

    try {
        let data = await getData(`/linkGreenAPI/test/${chatID}`);

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
            ]
        };

        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat.messages});

        if (arr_chat.messages[arr_chat.messages.length-1].parts === "Okay, we will contact with you soon!") {
            return;
        }

        let result;
        if (arr_chat.messages.length === 2) {
            result = await getData(`/linkGreenAPI/test/botConfig/greeting`)
            result += `

                 **FOR TESTING** 
                 Basic configuration of the bot: 
                { 
                    query:${await getData(`/linkGreenAPI/test/botConfig/query`)}, 
                    greeting:${await getData(`/linkGreenAPI/test/botConfig/greeting`)}, 
                    triggers:${await getData(`/linkGreenAPI/test/botConfig/triggers`)},
                }`
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
            await ctx.reply(`**DYNAMIC TRIGGERS FOR TESTING**
            ${resultTrigger}`);
            arr_chat.messages.pop();
            arr_chat.messages.push({
                role: 'model',
                parts: [{
                    text: "Okay, we will contact with you soon!"
                }]
            });
            await ctx.reply("Okay, we will contact with you soon!")
        } else {
            await ctx.reply(result + ` 

            **DYNAMIC TRIGGERS FOR TESTING**
            ${resultTrigger}`);

        }

        await setData(`/linkGreenAPI/test/${chatID}`, {
            messages: arr_chat.messages
        });

    } catch (error) {
        console.error(error);
    }
});

const launchBot = () => {
    bot.launch();
};

module.exports = launchBot;
