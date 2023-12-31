// Features.jsx
import React, { useState } from 'react';
import Navbar from "./Navbar"

const Features = () => {
  const [prompt, setPrompt] = useState('');
  const [responseText, setResponseText] = useState('');

  const handleGenerateContent = async () => {
    try {
      const response = await fetch('http://localhost:3001/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Assuming the result is an array, you can join the items for a more systematic display
      const formattedText = Array.isArray(result.text) ? result.text.join('\n') : result.text;

      setResponseText(formattedText);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="chat-container">
        <link rel="stylesheet" type="text/css" href="/css/features/styles.css" />

        <div className="chat-input">
          <label>
            What's on your mind?
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <button onClick={handleGenerateContent}>Generate</button>
        </div>
        <div className="chat-response">
          <strong>Response:</strong> <pre>{responseText}</pre>
        </div>
      </div>
    </div>

  );
};

export default Features;
