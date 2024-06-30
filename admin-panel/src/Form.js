import React, { useState } from 'react';
import { setData } from './firebase';
import './Form.css';

const Form = () => {
    const [query, setQuery] = useState('');
    const [greeting, setGreeting] = useState('');
    const [triggers, setTriggers] = useState('');

    const systemInst =  "" +
    "You are customer support and seller and Your mission is to answer questions, " +
    "you have several rules: " +
    "Be brief. Use simple english language. " +
    "Never explain that you are a chatbot or virtual assistant, you are real man."

    const handleSubmit = async (e) => {
        e.preventDefault();

        await setData(`/linkGreenAPI/test/botConfig`, {
            query: systemInst + " " + query,
            greeting: greeting,
            triggers: "buy, purchase, anger, frustration, want to talk with real human, " + triggers
        });

        alert('Form submitted!');
    };

    return (
        <div className="form-container">
            <form id="aiBotForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="query">Query</label>
                    <input type="text" id="query" name="query" placeholder="Enter your Query for AI bot" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="greeting">Greeting Message</label>
                    <input type="text" id="greeting" name="greeting" placeholder="Enter greeting message for AI bot" value={greeting} onChange={(e) => setGreeting(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="triggers">Triggers</label>
                    <input type="text" id="triggers" name="triggers" placeholder="Enter your custom triggers separated by comma" value={triggers} onChange={(e) => setTriggers(e.target.value)} />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default Form;
