const Trip = require('../models/Trip');

// Resilience helper: Exponential backoff for API limits
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(url, options, retries - 1, delay * 2);
            }
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
    }
}

// Reusable function to call Gemini API
async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    // Using gemini-flash models for high-speed, cost-effective JSON generation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const data = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Invalid LLM response format");
    return JSON.parse(textResponse);
}

exports.generateTrip = async (req, res) => {
    try {
        const { destination, durationDays, budgetTier, interests } = req.body;
        const userId = req.user.id; // Securely extracted from JWT middleware

        // Prompt 1: Core Itinerary and Budget
        const itineraryPrompt = `
      Create a detailed travel plan for a ${durationDays}-day trip to ${destination}.
      Budget preference is ${budgetTier}. Interests: ${interests.join(', ')}.
      Output ONLY valid JSON matching this structure:
      {
        "itinerary": [
          { "dayNumber": 1, "activities": [ { "title": "String", "description": "String", "estimatedCostUSD": Number, "timeOfDay": "Morning|Afternoon|Evening" } ] }
        ],
        "hotels": [
          { "name": "String", "tier": "String", "estimatedCostNightUSD": Number, "rating": "String" }
        ],
        "estimatedBudget": { "transport": Number, "accommodation": Number, "food": Number, "activities": Number, "total": Number }
      }
    `;

        // Prompt 2: Weather-Aware Packing Assistant (Our Creative Feature)
        const packingPrompt = `
      Act as a smart packing assistant. The user is traveling to ${destination} for ${durationDays} days.
      Consider the general climate for this location. Output ONLY valid JSON:
      {
        "packingList": [
          { "item": "String", "category": "Documents|Clothing|Gear|Other", "isPacked": false }
        ]
      }
    `;

        // PARALLEL PROCESSING: Execute both GenAI calls simultaneously
        const [tripData, packingData] = await Promise.all([
            callGemini(itineraryPrompt),
            callGemini(packingPrompt)
        ]);

        // Construct and save the final user-isolated document
        const newTrip = await Trip.create({
            userId,
            destination,
            durationDays,
            budgetTier,
            interests,
            itinerary: tripData.itinerary,
            hotels: tripData.hotels,
            estimatedBudget: tripData.estimatedBudget,
            packingList: packingData.packingList
        });

        res.status(201).json(newTrip);
    } catch (error) {
        console.error("GenAI Generation Error:", error);
        res.status(500).json({ message: "Failed to generate AI itinerary. Please try again." });
    }
};