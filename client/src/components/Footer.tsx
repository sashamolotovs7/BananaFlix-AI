// // BananaFlix/client/src/components/Footer.tsx
// import { useState } from 'react';

// const Footer = () => {
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (message.trim()) {
//       setChatHistory((prev) => [...prev, `User: ${message}`]);
//       setLoading(true);
      
//       try {
//         const response = await fetch('https://api.openai.com/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer key`, // Replace with your OpenAI API key
//           },
//           body: JSON.stringify({
//             model: 'gpt-3.5-turbo', // or the model you want to use
//             messages: [{ role: 'user', content: message }],
//           }),
//         });

//         const data = await response.json();
//         console.log(data); // Log the entire response for debugging

//         // Check if choices exist and have at least one element
//         if (data.choices && data.choices.length > 0) {
//           const botMessage = data.choices[0].message.content;
//           setChatHistory((prev) => [...prev, `Bot: ${botMessage}`]);
//         } else {
//           setChatHistory((prev) => [...prev, 'Bot: Sorry, I did not receive a valid response.']);
//         }
//       } catch (error) {
//         console.error('Error fetching data from OpenAI:', error);
//         setChatHistory((prev) => [...prev, 'Bot: Sorry, I could not process your request.']);
//       } finally {
//         setLoading(false);
//         setMessage('');
//       }
//     }
//   };

//   return (
//     <footer style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
//       <h3>Chat with us!</h3>
//       <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
//         {chatHistory.map((chat, index) => (
//           <div key={index}>{chat}</div>
//         ))}
//         {loading && <div>Bot: Typing...</div>}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Ask me anything..."
//       />
//       <button onClick={handleSendMessage} disabled={loading}>Send</button>
//     </footer>
//   );
// };

// export default Footer;