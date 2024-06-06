const WhatsAppBot = require('@green-api/whatsapp-bot')
const axios = require('axios');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set, child } = require("firebase/database");


const firebaseConfig = {
     apiKey: process.env.API_KEY,
     authDomain: process.env.AUTH_DOMAIN,
     databaseURL: process.env.DATABASE_URL,
     projectId: process.env.PROJECT_ID,
     storageBucket: process.env.STORAGE_BUCKET,
     messagingSenderId: process.env.MESSAGING_SENDER_ID,
     appId: process.env.APP_ID  
  }
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(database);

const bot = new WhatsAppBot({
    idInstance: "XXXXXX",
    apiTokenInstance: "XXXXXX"
})
async function rewriter(context_text,arrChat) {
  const url = 'XXXXX';
  const headers = {
    'authority': 'llm-olv6w56f3a-uc.a.run.app',
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7,ru;q=0.6',
    'content-type': 'application/json',
    'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'macOS',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
  };

  
  const data = {
    model: "gpt-4", // gpt-3.5-turbo #gpt-4
    messages: arrChat,
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
      console.log(response.data);
      const result = response.data.choices[0].message.content;
      return result;
    } else {
      return context_text;
    }
  } catch (error) {
    console.error('Error:', error);
    return context_text;
  }
}
const systemMessage =  `
You are customer support and Your mission is to answer questions form this text sample conversation below:
# 
Context ....

# Be brief. Use simple english language.
# Never explain that you are a chatbot. 
`;

bot.on('message', (ctx) => 
  {
   
    const chatID=ctx.update.message.chat.id.split('@')[0]
    const message=ctx.update.message.text
    console.log(chatID)
    console.log(message)
    get(child(dbRef, "/linkGreenAPI/test/" +chatID))
    .then(async (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            const data = await snapshot.val();
            console.log(data.messages);
            let arr_chat = data.messages;
            arr_chat.push({
                role: "user",
                content: message,
            });
            console.log(arr_chat);
            set(ref(database, "linkGreenAPI/test/" + chatID), {
                messages: arr_chat,
            });
            rewriter(message,arr_chat).then(result => {
              console.log('Rewritten Result:', result);
              // message.reply(result);
              ctx.reply(result)
              arr_chat.push({
                role: "system",
                content: result,
            });
            console.log(arr_chat);
            set(ref(database, "/linkGreenAPI/test/" +chatID), {
                messages: arr_chat,
            });
            // arr_chat=[]
            
            }).catch(error => {
              console.error('Error:', error);
            });
            
        } else {

          let arr_chat=[
            {
              role: "system",
              content: systemMessage,
            }
          ]
          arr_chat.push({
              role: "user",
              content: message,
          });
          rewriter(message,arr_chat).then(result => {
            console.log('Rewritten Result:', result);
            // message.reply(result);
            ctx.reply(result)
            arr_chat.push({
              role: "system",
              content: result,
          });
          console.log(arr_chat);
          set(ref(database, "/linkGreenAPI/test/" + chatID), {
              messages: arr_chat,
          });
          // arr_chat=[]
          
          }).catch(error => {
            console.error('Error:', error);
          });
          // set(ref(database, "linksAskmech/test/" + chat.id.user), {
          //     messages: arr_chat,
          // });
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }  
   
)
bot.launch()
