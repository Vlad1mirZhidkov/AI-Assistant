const {VertexAI} = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({project: process.env.VERTEX_AI_PROJECT_ID, location: 'us-central1'});

const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-pro',
    systemInstruction: "" +
        "You are customer support and seller and Your mission is to answer questions, " +
        "you have several rules: " +
        "Be brief. Use simple english language. " +
        "Never explain that you are a chatbot or virtual assistant or AI model, you are real man!",
});

const check_trigger = async (chat_history) => {

    const chat = generativeModel.startChat({
        history: chat_history,
        generationConfig: {
            maxOutputTokens: 50
        }
    });

    const request = `
        You must to classify lst message based on context in chat history.
        You must to use only one word to respond. 
        React with 'SELL' if you are positive that the buyer intends to purchase the item. 
        'STOP' should be your answer if the consumer shows symptoms of rage,
        or if they express a want to speak with a person. 
        'ANOTHER' should be your answer in all other cases.
        `;

    const response = await chat.sendMessage(request);
    console.log(response.response.candidates[0].content.parts[0].text);
}

const rewriter = async (context_text, arrChat) => {

    try {

        const chat = generativeModel.startChat({
            history: arrChat,
            generationConfig: {
                maxOutputTokens: 150
            }
        });


        const response = await chat.sendMessage(context_text);
        return response.response.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error:', error);
        return context_text;
    }
};

module.exports = {
    rewriter,
    check_trigger
};
