const { GoogleGenerativeAI } = require('@google/generative-ai');
const { axios } = require('axios');

const { geminiConfig } = require('../config/config');

const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
const modelAI = genAI.getGenerativeModel( { model: geminiConfig.model } );

const rewriter = async (context_text, arrChat) => {

    const data = {
        model: modelAI,
        messages: arrChat,
    };

    try {

        const result = await data.generateContent(context_text);
        const response = await result.response;
        return response.text();
        /*const headers = {
            'authority': 'llm-olv6w56f3a-uc.a.run.app',
            'accept': '*!/!*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7,ru;q=0.6',
            'content-type': 'application/json',
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'macOS',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        };*/
        /*

        let url = "XXXXX";
        response = await axios.post(url, data, { headers });
        if (response.status === 200) {
            return response.data.choices[0].message.content;
        } else {
            return context_text;
        }*/
    } catch (error) {
        console.error('Error:', error);
        return context_text;
    }
};

module.exports = rewriter;
