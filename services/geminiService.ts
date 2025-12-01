
import { GoogleGenAI, GenerateContentResponse, Type, Schema } from "@google/genai";
import { Product, Trip, Language, TripPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to give the AI context about its role
const SYSTEM_INSTRUCTION = `
You are Trackifly, an expert AI shopping assistant and travel planner.
Your goal is to help users save money, track prices, and plan trips efficiently.
You have access to the user's tracked products and current trip plans.
Always be concise, helpful, and money-conscious.
If asked about price trends, analyze the provided history.
`;

export const getShoppingAdvice = async (
  userQuery: string,
  products: Product[],
  trips: Trip[]
): Promise<string> => {
  try {
    const context = `
    User's Tracked Products: ${JSON.stringify(products.map(p => ({ name: p.name, current: p.currentPrice, target: p.targetPrice })))}
    User's Planned Trips: ${JSON.stringify(trips.map(t => ({ destination: t.destination, budget: t.budget })))}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: ${context}\n\nUser Query: ${userQuery}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the server right now. Please check your API key.";
  }
};

export const analyzeProductValue = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      Analyze the price history of this product: ${product.name}.
      Current Price: $${product.currentPrice}.
      Original Price: $${product.originalPrice}.
      History: ${JSON.stringify(product.history)}.
      Is this a good time to buy? Give a 2-sentence verdict.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (e) {
    return "Could not analyze price.";
  }
};

export const generateTripItinerary = async (
  tripDetails: Partial<Trip>,
  language: Language
): Promise<TripPlan | null> => {
  try {
    const { origin, destination, startDate, endDate, budget, currency, travelers, preferences, tripType } = tripDetails;
    
    const prompt = `
      Plan a detailed trip for ${travelers} people.
      From: ${origin}
      To: ${destination}
      Flight Type: ${tripType === 'one-way' ? 'One Way (No Return Flight needed)' : 'Round Trip'}
      Dates: ${startDate} ${tripType === 'round-trip' ? `to ${endDate}` : ''}
      Total Budget: ${budget} ${currency}
      
      Requirements:
      - Hotel Required: ${preferences?.needsHotel}
      - Car Rental: ${preferences?.needsCar}
      - Dietary Restrictions: ${preferences?.dietaryRestrictions || 'None'}
      - Language: ${language} (Ensure all text fields are in this language)
      
      Generate a structured JSON response with realistic options.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "A 2-sentence enthusiastic summary of the trip." },
        totalEstimatedCost: { type: Type.STRING, description: "Total estimated cost formatted with currency." },
        flights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              airline: { type: Type.STRING },
              price: { type: Type.STRING },
              duration: { type: Type.STRING },
              departureTime: { type: Type.STRING }
            }
          }
        },
        hotels: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              pricePerNight: { type: Type.STRING },
              rating: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        },
        carRentals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              carType: { type: Type.STRING },
              dailyRate: { type: Type.STRING }
            }
          }
        },
        food: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              cuisine: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              description: { type: Type.STRING },
              mustTry: { type: Type.STRING }
            }
          }
        },
        dailyItinerary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              title: { type: Type.STRING, description: "Theme of the day" },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    location: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      },
      required: ["summary", "flights", "hotels", "dailyItinerary"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TripPlan;
    }
    return null;
  } catch (e) {
    console.error("Failed to generate itinerary:", e);
    return null;
  }
};

export const findCoupons = async (url: string): Promise<string[]> => {
  try {
    const prompt = `
      The user is shopping at this website: ${url}.
      List 3-5 common, likely active, or generic coupon codes for this retailer (e.g., WELCOME10, SAVE20).
      Return ONLY a JSON array of strings, for example: ["SAVE10", "WELCOME20"].
      Do not include any other text.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    const text = response.text;
    if (!text) return ["SAVE10", "WELCOME", "FREESHIP"];
    return JSON.parse(text);
  } catch (e) {
    console.error(e);
    return ["SAVE10", "WELCOME", "FREESHIP"]; // Fallback codes
  }
};
