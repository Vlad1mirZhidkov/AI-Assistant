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
        You must to use only one word to respond. 
        React with 'SELL' if buyer intends to purchase the item and decided on a purchase. 
        'STOP' should be your answer if the consumer shows symptoms of rage,
        or if they express a want to speak with a real person. 
        'ANOTHER' should be your answer in all other cases.`,

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
            ],

            buy: false,

            call_real_human: false,
        };

        await setData(`/linkGreenAPI/test/${chatID}`, { messages: arr_chat.messages,
            buy: arr_chat.buy,
            call_real_human: arr_chat.call_real_human });

        if (arr_chat.buy || arr_chat.call_real_human) {
            return;
        }
        let result = ""
        if (arr_chat.messages.length === 2) {
            result = await getData(`/linkGreenAPI/test/botConfig/greeting`)
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

        const { flag_sell, flag_stop } = await check_trigger(arr_chat.messages);

        if (!flag_sell && !flag_stop) {

            await ctx.reply(result);
        }
        else {
            arr_chat.messages.pop()
            arr_chat.messages.push({
                role: 'model',
                parts: [{
                    text: "Okay, we will communicate with you soon!"
                }]
            });

            await ctx.reply("Okay, we will communicate with you soon!")
        }

        await setData(`/linkGreenAPI/test/${chatID}`, {
            messages: arr_chat.messages,
            buy: flag_sell,
            call_real_human: flag_stop
        });

    } catch (error) {
        console.error(error);
    }
});

const launchBot = () => {
    bot.launch();
};

module.exports = launchBot;
