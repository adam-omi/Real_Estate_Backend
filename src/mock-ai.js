const express = require('express');
const app = express();

app.use(express.json());

// Listen on the exact route your main backend is calling
app.post('/api/v1/predict', (req, res) => {
    const data = req.body;
    console.log("🤖 MOCK AI RECEIVED DATA:", data);

    // Let's create a fake calculation based on the data sent!
    // Example: 10,000 PLN per square meter
    const fakePrice = data.area_sqm ? (data.area_sqm * 10000) : 500000;

    // We must return the exact JSON structure your main backend expects
    const fakeAiResponse = {
        estimated_value: fakePrice,
        currency: "PLN",
        confidence: 0.88, // 88% confident
        modelVersion: "v1-mock-model",
        explanation: [
            `Calculated base price for ${data.city || 'Unknown City'}`,
            `Applied multiplier for ${data.rooms || 0} rooms.`,
            `This is a MOCK response!`
        ]
    };

    // Add a tiny artificial delay (1 second) so the frontend loading spinner actually shows up
    setTimeout(() => {
        res.json(fakeAiResponse);
    }, 1000);
});

// Run this mock server on port 8000 (The port Python is supposed to use)
app.listen(8000, () => {
    console.log('🧪 MOCK AI SERVER is running on http://localhost:8000');
});