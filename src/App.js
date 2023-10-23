import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [superheroName, setSuperheroName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const name = prompt('Chat with anyone you like, just enter a name:') || 'Batman';
    setSuperheroName(name);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, inputValue]);

  const sendMessage = async () => {
    const userMessage = {
      author: 'You',
      text: inputValue,
      type: 'user'
    };
    setMessages([...messages, userMessage]);

    const data = {
      superhero: superheroName,
      message: inputValue
    };
    const response = await fetch(window.location.href, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseData = await response.json();

    const aiMessage = {
      author: superheroName,
      text: responseData.response.trim(),
      type: 'superhero'
    };
    setMessages([...messages, userMessage, aiMessage]);

    setInputValue('');
  };

  return (
    <div id="chat-box">
      <h1>Chat with <span>{superheroName}</span></h1>
      <div id="messages" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <b>{msg.author}:</b> {msg.text}
          </div>
        ))}
      </div>
      <textarea
        id="input"
        ref={inputRef}
        value={inputValue}
        placeholder="Type your message..."
        onChange={e => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
