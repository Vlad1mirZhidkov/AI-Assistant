import React, {useState} from 'react';
import './Refresh-bot.css';
import { setData, getData } from './firebase';

const Refresh = () => {
    const [platform, setPlatform] = useState('');
    const [phone, setPhone] = useState('');

    const refreshOne = async (e) => {
        e.preventDefault();
        try {

            let chat = await getData(`/${platform}/${phone}`);

            await setData(`/${platform}/${phone}`, {
                accept: true,
                messages: chat.messages,
            })

        } catch (e) {
            console.log(`Error: ${e}`)
        }
    };

    const refreshAll = async (e) => {
        e.preventDefault();
        try {
            const phones = await getData("/whatsapp");
            phones.forEach((element) => setData(`/whatsapp/${element}`, {
                accept: true,
                messages: getData(`/whatsapp/${element}/messages`),
            }));

            const phonesTelegram = await getData("/telegram");
            phonesTelegram.forEach((element) => setData(`/telegram/${element}`, {
                accept: true,
                messages: getData(`/whatsapp/${element}/messages`),
            }));

            console.log("will working soon")

        } catch (e) {
            console.log(`Error: ${e}`)
        }
    };

    return (
        <main className="main-content">
            <div className="form-container">
                <form id="telegramConnection">
                    <div className="form-group">
                        <label htmlFor="Platform">Platform</label>
                        <input type="text" id="platform" name="platform" placeholder="Enter platform (telegram or whatsapp)"
                               value={platform}
                               onChange={(e) => setPlatform(e.target.value)} required={true}/>
                        <label htmlFor="Phone number">Phone number</label>
                        <input type="text" id="phone" name="phone" placeholder="Enter phone number for refresh"
                               value={phone}
                               onChange={(e) => setPhone(e.target.value)} required={true}/>
                    </div>
                    <button type="submit" onClick={refreshOne}>Refresh one number</button>
                </form>
                <button type="submit" onClick={refreshAll}>Refresh all numbers</button>
            </div>
        </main>

    );
};

export default Refresh;

