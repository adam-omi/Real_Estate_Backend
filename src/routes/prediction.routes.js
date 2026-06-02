const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPrediction, getPredictionResult } = require('../controllers/prediction.controller');

// Use memory storage to prevent filling up the server disk with temporary files
const upload = multer({ storage: multer.memoryStorage() });

// 1. Final URL: POST /api/v1/api/predict
router.post('/api/predict', upload.any(), createPrediction);

// 2. Final URL: GET /api/v1/api/result/:id
router.get('/api/result/:id', getPredictionResult);

module.exports = router;