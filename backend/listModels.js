const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../.env' }); // load from root .env

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("No GEMINI_API_KEY found");
    console.log("Key found:", key.substring(0, 10) + "...");
    
    // GoogleGenerativeAI doesn't expose ListModels directly in a simple way in older versions,
    // but in 0.24.1 we can fetch it via REST if needed, or maybe it's exposed?
    // Let's do a raw fetch to the REST API to see the models.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => {
        if (m.name.includes('gemini')) {
          console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods?.join(', ')})`);
        }
      });
    } else {
      console.log("Response:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
