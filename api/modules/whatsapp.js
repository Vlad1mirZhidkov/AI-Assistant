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
        triggers: `
            You must to classify last message based on context in chat history.
            You must to use only JSON response without other words from you!
            In the JSON response, you must provide the idea that the buyer intends in his message.
            You must to use sample JSON response that below:
            {
                message: "Message from customer"
                idea: "Idea of the message"
            }
            `,

    }

    await setData(`/linkGreenAPI/test/botConfig`, {
        query: botConf.query,
        greeting: botConf.greeting,
        triggers: botConf.triggers,
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

        if (arr_chat.buy || arr_chat.call_real_human) {
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
                    triggers:${await getData(`/linkGreenAPI/test/botConfig/triggers`)}
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


        await ctx.reply(result + ` 

            **DYNAMIC TRIGGERS FOR TESTING**
            ${resultTrigger}`);


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
