const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 3001;

const {sendCodeHandler, clientStartHandler} = require("./telecon");

app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, '/admin-panel/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });


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

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(uploadDir, req.file.filename);
    exec(`node ${path.join(uploadDir, 'excelParser.js')} ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send('Error processing file.');
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
        }
        console.log(`Script stdout: ${stdout}`);
        res.send('File uploaded and processed successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
