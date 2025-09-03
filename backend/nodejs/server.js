
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const geminiApiKey = process.env.API_KEY;
const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/api/search', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const requestBody = {
        contents: [{
            parts: [{
                text: query
            }]
        }]
    };

    try {
        const response = await axios.post(geminiApiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': geminiApiKey
            }
        });

        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ response: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
