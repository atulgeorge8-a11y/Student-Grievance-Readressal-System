require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Chatbot API Route
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return res.status(500).json({ 
                error: 'API Key not configured. Please add your Gemini API key to the .env file.' 
            });
        }

        // Construct the prompt with some context
        const promptContext = `You are an ultra-smart, general-purpose AI assistant (powered by Gemini) integrated into the Student Grievance Redressal System (SGRS).
Be concise, immensely helpful, and polite. YOU MUST ANSWER ANY TYPE OF QUESTION THE USER ASKS YOU. Whether the question is about coding, math, science, history, general trivia, or the grievance system itself—answer them all fully and smartly like Gemini.

If the user asks about the grievance portal specifically (like how to submit or track), provide a clear step-by-step guide and CRITICALLY: ALWAYS append a clickable HTML link at the end to seamlessly redirect them.
Use EXACTLY the following formats for the portal links:
- Submit Grievance: <br><br><a href="submiit.html" class="chat-action-link">Submit a Grievance ➔</a>
- Track Grievance: <br><br><a href="track.html" class="chat-action-link">Track your Grievance ➔</a>
- Login Page: <br><br><a href="login.html" class="chat-action-link">Go to Login ➔</a>
- Student Home: <br><br><a href="student.html" class="chat-action-link">Student Home ➔</a>

Use standard Markdown for bolding (**bold**). DO NOT wrap your response in markdown code blocks. Here is the user's message:\n`;

        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptContext + userMessage }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Gemini API Error:', data);
            throw new Error(data.error?.message || 'Failed to fetch response from AI');
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't formulate a response.";
        
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Chat API Error:', error.message);
        res.status(500).json({ error: 'An error occurred while communicating with the AI.' });
    }
});

// Send all requests to index.html (useful for simple routing, although this app has multiple html files)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop.`);
});
