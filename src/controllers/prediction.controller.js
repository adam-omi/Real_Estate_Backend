const crypto = require('crypto');
const mlService = require('../services/ml.service');
const { applyManualAdjustments } = require('../services/adjustment.service');

// 🧪 TEMPORARY DATABASE: To be replaced with PostgreSQL/Redis
const temporaryDatabase = new Map();

async function createPrediction(req, res) {
    try {
        const propertyData = req.body;
        console.log("📥 Received form data for valuation.");

        // Normalize data for the AI model
        const mappedDataForAI = {
            address: propertyData.street || propertyData.address || "",
            city: propertyData.city || "Warsaw",
            area_sqm: parseFloat(propertyData.area || propertyData.areaSqm || 0),
            rooms: parseInt(propertyData.rooms || 1, 10),
            year_built: parseInt(propertyData.yearBuilt || 2000, 10)
        };

        // 1. Get Base Valuation from AI
        const aiResult = await mlService.getValuationFromAI(mappedDataForAI);
        
        // 2. Apply Business Rules / Manual Adjustments
        const { finalPrice, adjustments } = applyManualAdjustments(aiResult.estimated_value, propertyData);

        // 3. Generate ID and construct final payload
        const predictionId = crypto.randomUUID();
        const finalData = {
            id: predictionId,
            price: finalPrice,
            price_range: [
                finalPrice * 0.95, // Min price (-5%)
                finalPrice * 1.05  // Max price (+5%)
            ],
            condition_score: 8.5,
            adjustments,
            details: aiResult.explanation
        };

        // Save to temporary memory store
        temporaryDatabase.set(predictionId, finalData);

        return res.status(200).json(finalData);

    } catch (error) {
        console.error("❌ Backend Error (createPrediction):", error.message);
        return res.status(500).json({ error: "Failed to calculate valuation." });
    }
}

async function getPredictionResult(req, res) {
    try {
        const { id } = req.params;
        console.log(`🔎 Fetching result data for ID: ${id}`);

        const result = temporaryDatabase.get(id);

        if (!result) {
            return res.status(404).json({ error: "Valuation not found or expired." });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("❌ Backend Error (getPredictionResult):", error.message);
        return res.status(500).json({ error: "Server error fetching result" });
    }
}

module.exports = {
    createPrediction,
    getPredictionResult
};