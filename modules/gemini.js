const {VertexAI} = require('@google-cloud/vertexai');

const vertexAI = new VertexAI({project: process.env.VERTEX_AI_PROJECT_ID, location: 'us-central1'});

const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-pro',
    systemInstruction: "" +
        "You are customer support and seller and Your mission is to answer questions, " +
        "you have several rules: " +
        "Be brief. Use simple english language. " +
        "Never explain that you are a chatbot or virtual assistant, you are real man.",
});

const rewriter = async (context_text, arrChat) => {

    try {

        const chat = generativeModel.startChat({
            history: arrChat,
            generationConfig: {
                maxOutputTokens: 200
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
    rewriter
};
