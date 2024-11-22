import { useState } from "react";

const Footer = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory((prev) => [...prev, `User: ${message}`]);
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Response:', data);
  
        // Extract the message content depending on your response structure
        const botMessage = data.response || 'Bot: No response received.';
  
        setChatHistory((prev) => [...prev, `Bot: ${botMessage}`]);
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setChatHistory((prev) => [...prev, 'Bot: Error connecting to server.']);
      } finally {
        setLoading(false);
        setMessage('');
      }
    }
  };
  

  return (
    <footer style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <h3>Chat with us!</h3>
      <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {chatHistory.map((chat, index) => (
          <div key={index}>{chat}</div>
        ))}
        {loading && <div>Bot: Typing...</div>}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={handleSendMessage} disabled={loading}>
        Send
      </button>
      <p style={{ fontSize: "0.8rem", color: "#666" }}>
        Note: This chatbot is powered by OpenAI's Assistant feature.
      </p>
    </footer>
  );
};

export default Footer;
