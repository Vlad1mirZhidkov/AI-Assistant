import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Form from './Form';
import './App.css';

const App = () => (
    <div className="App">
        <Header />
        <main className="main-content">
            <Form />
        </main>
        <Footer />
    </div>
);

export default App;
