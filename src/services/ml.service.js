const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api/v1/predict';

/**
 * Sends property data to the Python ML service and returns the prediction.
 */
async function getValuationFromAI(propertyData) {
    try {
        const payload = {
            address: propertyData.address || "",
            city: propertyData.city,
            country: "Poland", 
            area_sqm: propertyData.area_sqm,
            rooms: propertyData.rooms,
            year_built: propertyData.year_built
        };

        const response = await axios.post(ML_SERVICE_URL, payload);
        return response.data; 

    } catch (error) {
        console.error("❌ Error communicating with ML Service:", error.message);
        throw new Error("Failed to communicate with the AI model.");
    }
}

module.exports = { getValuationFromAI };