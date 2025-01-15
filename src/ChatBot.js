import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null); // Reference to scroll the chat container

  // Scroll to the bottom of the chat container when a new message is added
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  // Function to send the user message
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add the user's message to the chat
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);

    try {
      // Send the user message to the backend (your API)
      const response = await axios.post('https://openai-bot-api.onrender.com/chat', { message: userInput });

      // Extract the response text from the API response
      const { response: botReply } = response.data;

      // Add the bot's reply to the chat
      setMessages([
        ...newMessages,
        { sender: 'bot', text: botReply },
      ]);
    } catch (error) {
      // Handle any errors from the backend
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Error processing request.' },
      ]);
    }

    // Clear the user input field
    setUserInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <div
        ref={chatContainerRef} // Attach the reference here
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '10px',
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            width: '80%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
