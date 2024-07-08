const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const {sendCodeHandler, clientStartHandler} = require("./telecon");

app.use(express.json());
app.use(cors());


app.post('/telcon/code', async (req, res) => {

    await sendCodeHandler(req.body.phone);

    res.status(200).send('Received query successfully');
});

app.post('/telcon/accept', async (req, res) => {
    try {
        await clientStartHandler(req.body.phone, req.body.code);
        res.status(200).send('Successfully connected to Telegram');
    } catch (error) {
        console.error('Error connecting to Telegram:', error);
        res.status(500).send('Failed to connect to Telegram');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
