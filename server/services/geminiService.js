const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildCompatibilityPrompt } = require('../prompts/compatibilityPrompt');
const GeminiError = require('../utils/GeminiError');

const getCompatibilityScore = async (listing, tenantProfile) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new GeminiError('GEMINI_API_KEY is not defined');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildCompatibilityPrompt(listing, tenantProfile);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Gemini Raw Response]:', text);
    }

    // Clean up potential markdown formatting like ```json ... ```
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      throw new GeminiError('Failed to parse Gemini response as JSON: ' + parseErr.message);
    }

    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100) {
      throw new GeminiError('Invalid score range returned by LLM');
    }

    if (!parsed.explanation || typeof parsed.explanation !== 'string') {
      throw new GeminiError('Missing explanation in LLM response');
    }

    return parsed;
  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }
    throw new GeminiError(`Gemini API Error: ${error.message}`);
  }
};

module.exports = { getCompatibilityScore };
