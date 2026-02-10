import { GoogleGenAI, Type, FunctionDeclaration, Schema } from "@google/genai";
import { SYSTEM_PROMPT, LOCATION_COORDS, getMarketPricesForLocation } from "../constants";
import { DiagnosisResult, Language, WeatherData, ForecastDay } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Real Data Helper Functions ---

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
        const state = data.address?.state;
        return city && state ? `${city}, ${state}` : "Detected Location";
    } catch (e) {
        console.error("Reverse geocoding failed", e);
        return "Detected Location";
    }
}

function getWeatherCondition(code: number): string {
    if (code === 0) return 'Sunny';
    if (code > 0 && code <= 3) return 'Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 80 && code <= 99) return 'Stormy';
    return 'Sunny';
}

function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export async function getWeather(location: string): Promise<WeatherData> {
    const coords = LOCATION_COORDS[location];
    if (!coords) {
        // Fallback
        return { 
            temp: 30, 
            condition: 'Sunny', 
            humidity: 60,
            windSpeed: 10,
            rainfallProbability: 0, 
            alert: 'No data available for this location.',
            forecast: []
        };
    }

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,weather_code,precipitation_probability_max&timezone=auto`
        );
        const data = await response.json();
        
        const current = data.current;
        const daily = data.daily;
        
        const temp = Math.round(current.temperature_2m);
        const code = current.weather_code;
        const humidity = current.relative_humidity_2m;
        const windSpeed = Math.round(current.wind_speed_10m);
        const condition = getWeatherCondition(code);
        const rainProb = daily.precipitation_probability_max[0];
        
        // Generate forecast (Next 3 days)
        const forecast: ForecastDay[] = [];
        for(let i = 1; i <= 3; i++) {
            if(daily.time[i]) {
                forecast.push({
                    day: getDayName(daily.time[i]),
                    temp: Math.round(daily.temperature_2m_max[i]),
                    code: daily.weather_code[i],
                    condition: getWeatherCondition(daily.weather_code[i])
                });
            }
        }

        let alert = undefined;
        if (rainProb > 70) alert = "Heavy rains expected. Delay spraying.";
        else if (rainProb > 40) alert = "Light rains expected. Hold fertilizer application.";
        else if (temp > 38) alert = "Heatwave alert. Irrigate crops.";
        
        return {
            temp,
            condition,
            humidity,
            windSpeed,
            rainfallProbability: rainProb,
            alert,
            forecast
        };
    } catch (e) {
        console.error("Weather fetch failed", e);
        return { 
            temp: 32, 
            condition: 'Clear', 
            humidity: 50,
            windSpeed: 12,
            rainfallProbability: 10,
            forecast: []
        };
    }
}

// --- Tool Definitions ---

const getMarketPricesTool: FunctionDeclaration = {
  name: "getMarketPrices",
  description: "Get real-time market prices (mandi rates) for crops.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: "District or Mandi name" }
    }
  }
};

const getWeatherTool: FunctionDeclaration = {
  name: "getWeather",
  description: "Get current weather and forecast for a location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: "Location name" }
    }
  }
};

// --- Helper for Tool Execution ---
async function handleToolCalls(functionCalls: any[], lang: Language) {
  const responses = [];
  for (const call of functionCalls) {
    if (call.name === "getMarketPrices") {
      const loc = call.args?.location || "Pune, Maharashtra";
      responses.push({
        name: call.name,
        response: { prices: getMarketPricesForLocation(loc, lang) }
      });
    } else if (call.name === "getWeather") {
      const loc = call.args?.location || "Pune, Maharashtra";
      const weatherData = await getWeather(loc);
      responses.push({
        name: call.name,
        response: { weather: weatherData }
      });
    }
  }
  return { functionResponses: responses };
}

// --- Main Analysis Function ---

export const analyzeCropImage = async (
  imageBase64: string, 
  promptText: string,
  lang: Language
): Promise<DiagnosisResult> => {
  const modelId = "gemini-3-pro-preview"; // Use Pro for complex reasoning

  const diagnosisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      diseaseName: { type: Type.STRING, description: `Name of the disease in ${lang}.` },
      marathiName: { type: Type.STRING, description: `Local name of disease in ${lang}.` },
      confidence: { type: Type.NUMBER, description: "Confidence score 0-100." },
      symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: `List of symptoms in ${lang}.` },
      explanation: { type: Type.STRING, description: `Explanation in ${lang}.` },
      treatment: { type: Type.ARRAY, items: { type: Type.STRING }, description: `Treatment steps in ${lang}.` },
      fertilizerAdvice: { type: Type.STRING, description: `Fertilizer advice in ${lang}.` },
    },
    required: ["diseaseName", "confidence", "treatment", "explanation", "marathiName", "fertilizerAdvice"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: `${promptText}. IMPORTANT: Respond strictly in ${lang} language.` }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
        thinkingConfig: { thinkingBudget: 1024 }, // Enable reasoning
        tools: [{ functionDeclarations: [getMarketPricesTool, getWeatherTool] }]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as DiagnosisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export type AIMode = 'fast' | 'think' | 'store';

export const askAdvisor = async (query: string, lang: Language, location: string, mode: AIMode = 'fast') => {
    let modelId = "gemini-3-flash-preview"; 
    let config: any = {
      systemInstruction: SYSTEM_PROMPT,
    };

    // Configure based on Mode
    if (mode === 'think') {
        modelId = "gemini-3-pro-preview";
        config.thinkingConfig = { thinkingBudget: 2048 }; // Enable deep thinking
    } else if (mode === 'store') {
        // Use Google Search for real stores
        modelId = "gemini-3-flash-preview";
        config.tools = [{ googleSearch: {} }];
    } else {
        // Fast / Search
        config.tools = [{ functionDeclarations: [getMarketPricesTool, getWeatherTool] }];
    }

    try {
        const fullQuery = `User Location: ${location}. Language: ${lang}. Query: ${query}. (Keep answer short, bullet points, in ${lang}).`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: fullQuery,
            config: config
        });

        // Handle Grounding (Google Search) for 'store' mode
        let responseText = response.text || "";
        
        // Extract grounding chunks if available
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks && groundingChunks.length > 0) {
            responseText += "\n\n**Sources:**\n";
            groundingChunks.forEach((chunk: any) => {
                if (chunk.web) {
                   responseText += `• [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            });
        }

        const candidates = response.candidates;
        const functionCalls = candidates?.[0]?.content?.parts?.filter(p => p.functionCall)?.map(p => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
            const toolResults = await handleToolCalls(functionCalls, lang);
             const response2 = await ai.models.generateContent({
                model: modelId,
                contents: [
                    { role: 'user', parts: [{ text: fullQuery }] },
                    { role: 'model', parts: candidates![0].content.parts },
                    { role: 'function', parts: toolResults.functionResponses }
                ],
                config: { systemInstruction: SYSTEM_PROMPT }
             });
             return response2.text;
        }

        return responseText;

    } catch (error) {
        console.error("Gemini Advisor Error:", error);
        return "Network error. Please try again.";
    }
}