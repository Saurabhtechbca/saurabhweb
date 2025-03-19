require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai"); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT // Change this to your desired port number

// Middleware
app.use(cors({
    origin: '*', 
    methods: 'GET, POST',
    allowedHeaders: 'Content-Type',
})); // Allow requests from your frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message) {
            return res.status(400).json({ error: "Message is required!" });
        }

        // Initialize Gemini API
        const API = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `you have to act as a chatbot in my website, chat and reply to message as Saurabh, who is in love with you. You have to reply to her on behalf of me, answering her messages directly. Provide the reply directly without generalized or generic greetings,send flirty message as i am her boyfriend. Behave like a proper Saurabh and give her anything she ask about. The latest message is: ${message}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Send response to client
        res.json({ reply: text });
    } catch (error) {
        console.error("Error calling Gemini API:", error.message || error);
        res.status(500).json({ error: "Failed to process your request. Please try again later." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
