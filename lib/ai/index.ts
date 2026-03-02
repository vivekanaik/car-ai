import { GoogleGenAI } from '@google/genai';
import { Car } from '@/lib/car-data';

// Initialize the AI client lazily to ensure environment variables are loaded
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });

export async function generateChatResponseStream(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userMsg: string,
  contextCars: Car[],
  allCars: Car[]
) {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are an expert car comparison assistant. 
    You MUST ONLY use the following structured car data to answer questions.
    DO NOT hallucinate or invent specifications. If the data is not provided, say "I don't have that information."
    
    Currently Selected Cars for Comparison Context:
    ${JSON.stringify(contextCars, null, 2)}
    
    All Available Cars in Database:
    ${JSON.stringify(allCars, null, 2)}
    
    CRITICAL FORMATTING RULES:
    1. When a user asks for a COMPARISON between two or more cars, you MUST use a Markdown table.
       Example Table Format:
       | Feature | Car A | Car B |
       |---|---|---|
       | Price | ₹10,00,000 | ₹12,50,000 |
       | Mileage | 18 kmpl | 16 kmpl |
    2. When a user asks for SPECIFICATIONS of a single car, use a clean bulleted list with bold labels.
       Example:
       - **Make & Model:** Tata Nexon
       - **Price:** ₹8,15,000
       - **Engine:** 1.2L Turbo Revotron
    3. Keep answers concise, professional, and directly address the user's question.
  `;

  const contents = [
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    { role: 'user', parts: [{ text: userMsg }] }
  ];

  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: contents as any,
    config: {
      systemInstruction,
      temperature: 0.2, // Low temperature to prevent hallucination
    }
  });
}

export async function generateCarRecommendation(
  answers: {
    budget: string;
    purpose: string;
    commute: string;
    fuel: string;
    longevity: string;
    safety: string;
    brand: string;
  },
  allCars: Car[]
) {
  const ai = getAIClient();
  
  const prompt = `
    You are an expert car matchmaker. Based on the user's profile, recommend the SINGLE BEST car and specific variant from the provided database.
    
    User Profile:
    - Budget: ${answers.budget}
    - Primary Purpose: ${answers.purpose}
    - Daily Commute: ${answers.commute}
    - Fuel Preference: ${answers.fuel}
    - Planned Ownership Duration: ${answers.longevity}
    - Safety Priority: ${answers.safety}
    - Preferred Brand: ${answers.brand}
    
    Available Cars in Database:
    ${JSON.stringify(allCars, null, 2)}
    
    Instructions:
    1. Analyze the user's needs against the available cars and their specific variants.
    2. Select the ONE best matching variant.
    3. Format the response STRICTLY as follows:
       # [Make] [Model] - [Variant Name]
       
       **Why this is your perfect match:**
       [2-3 paragraphs explaining the fit based on their specific answers]

       **Key Details:**
       - **Price:** [Price]
       - **Fuel Type:** [Fuel]
       - **Safety Rating:** [Rating]

       **Technical Specifications:**
       - **Engine:** [Engine]
       - **Horsepower:** [HP]
       - **Mileage:** [Mileage]
       - **Key Features:** [Features list]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.4 }
  });

  return response.text;
}
