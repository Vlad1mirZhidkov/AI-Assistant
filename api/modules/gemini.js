const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuth } = require('google-auth-library');
const {getData} = require("./firebase");
const {sendMessage} = require("./tg_bot")
const {checkSimilarity} = require("./distance")
let authClient = null;

async function initializeAuth() {
    try {
        if (!authClient) {
            const auth = new GoogleAuth({
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            });
            console.log('Attempting to get auth client');
            authClient = await auth.getClient();
            console.log('Auth client obtained');
        }
        return authClient;
    } catch (error) {
        console.error('Error during authentication initialization:', error);
        throw new Error('Authentication initialization failed.');
    }
}

let generativeModel = null;

const initializeVertexAI = async () => {
    const authClient = await initializeAuth();

    if (!generativeModel) {
        const vertexAI = new VertexAI({
            project: process.env.VERTEX_AI_PROJECT_ID,
            location: 'us-central1',
            authClient: authClient
        });

        generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-pro',
            systemInstruction: "You are customer support and seller. Your mission is to answer questions. " +
                "You have several rules: Be brief. Use simple English language. " +
                "Never explain that you are a chatbot or virtual assistant, you are a real person."
        });
    }
};


const check_trigger = async (chat_history, number) => {
    await initializeVertexAI();

    try {

        const chat = generativeModel.startChat({
            history: chat_history,
            generationConfig: {
                maxOutputTokens: 250
            }
        });

        const request = `
            You must to classify last message based on context in chat history from role 'user'.
            You must to use only JSON response without other words from you!
            In the JSON response, you must provide the idea that the buyer intends in his message and product which 
            customer wants to buy or interested.
            You must to use sample JSON response that below:
            {
                message: "Message from customer"
                idea: "Idea of the message"
                product: "product what will be bought"
            }
            
            `;
        const response = await chat.sendMessage(request);

        console.log(response.response.candidates[0].content.parts[0].text);

        const check_idea_req = `
            If in the field "idea" in the JSON response: ${response.response.candidates[0].content.parts[0].text} 
            has a meaning similar to at least one of the following words: ${await getData(`/botConfig/triggers`)}
            Then write only one word TRUE if similar meanings, otherwise FALSE (write it not in JSON)!
            `

        const check_idea_response = await chat.sendMessage(check_idea_req);

        console.log(check_idea_response.response.candidates[0].content.parts[0].text);

        if (check_idea_response.response.candidates[0].content.parts[0].text.toLowerCase().includes('true')) {
            let post_text = `
                        number: +${number}
                        trigger: ${String(response.response.candidates[0].content.parts[0].text).split(`"idea":`)[1].split("}")[0].trim()}
                        `;

            if (response.response.candidates[0].content.parts[0].text.toLowerCase().includes('product')) {
                const prod = await checkSimilarity(String(response.response.candidates[0].content.parts[0].text).split(`"product":`)[1].split("}")[0].trim());
                post_text = `
                        number: +${number}
                        trigger: ${String(response.response.candidates[0].content.parts[0].text).split(`"idea":`)[1].split("product")[0].trim()}
                        name of product: ${prod.name}
                        info about product: ${prod.info},
                        price of product: ${prod.price}
                  
                        `;
            }


            sendMessage(post_text);

            return 'true';
        }

        return response.response.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error:', error);
    }
};

const rewriter = async (context_text, arrChat) => {
    await initializeVertexAI();
    try {

        const chat = generativeModel.startChat({
            history: arrChat,
            generationConfig: {
                maxOutputTokens: 250
            }
        });

        const response = await chat.sendMessage(context_text);
        return response.response.candidates[0].content.parts[0].text.trim();

    } catch (error) {
        console.error('Error:', error);
        return context_text;
    }
};

module.exports = {
    rewriter,
    initializeVertexAI,
    initializeAuth,
    check_trigger
};
