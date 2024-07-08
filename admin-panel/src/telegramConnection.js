import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './TelegramConnection.css';
import axios from 'axios';

const TelegramConnection = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const sendCode = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:3001/telcon/code', {phone});

        } catch (e) {
            console.log(`Error: ${e}`)
        }
    };

    const telegramConnect = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:3001/telcon/accept', {phone, code});
            navigate('http://localhost:3000/');

        } catch (e) {
            console.log(`Error: ${e}`)
        }
    };

    return (
        <main className="main-content">
            <div className="form-container">
                <form id="telegramConnection">
                    <div className="form-group">
                        <label htmlFor="Phone number">Phone number</label>
                        <input type="text" id="phone" name="phone" placeholder="Enter your phone number" value={phone}
                               onChange={(e) => setPhone(e.target.value)} required={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Code">Code</label>
                        <input type="text" id="code" name="code" placeholder="Enter your code" value={code}
                               onChange={(e) => setCode(e.target.value)} required={true}/>
                    </div>
                    <button type="submit" onClick={sendCode}>Send code</button>
                    <button type="submit" onClick={telegramConnect}>Connect telegram</button>
                </form>
            </div>
        </main>

    );
};

export default TelegramConnection;

