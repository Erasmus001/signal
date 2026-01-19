
import { GoogleGenAI, Type } from "@google/genai";
import { Post, ContentType } from "../types";

export async function discoverSignals(query: string, intent: string | null): Promise<Post[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a high-intent signal discovery engine for X (Twitter).
    Your task is to find real, current posts or discussions related to the user's query.
    If the intent is 'Leads', focus on people asking for recommendations or expressing pain points.
    If the intent is 'Long-form', focus on industry experts sharing deep-dives or threads.
    
    Format the output as a JSON array of post objects.
    Each object must have: 
    - authorName, authorHandle (e.g. @name)
    - content (the post text)
    - likes, replies (random realistic numbers)
    - type (one of: 'Leads', 'Threads', 'Links', 'Video')
    - timestamp (e.g. '2h ago')
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the latest activity on X (Twitter) about: ${query}. Intent category: ${intent || 'General'}. Return 4-5 high-quality matches.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              authorName: { type: Type.STRING },
              authorHandle: { type: Type.STRING },
              content: { type: Type.STRING },
              likes: { type: Type.NUMBER },
              replies: { type: Type.NUMBER },
              type: { type: Type.STRING },
              timestamp: { type: Type.STRING },
            },
            required: ["authorName", "authorHandle", "content", "likes", "replies", "type", "timestamp"]
          }
        }
      },
    });

    const jsonStr = response.text || "[]";
    const rawSignals = JSON.parse(jsonStr);
    
    // Extract grounding chunks to attach source URLs if possible
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrl = groundingChunks.length > 0 ? (groundingChunks[0] as any).web?.uri : undefined;

    return rawSignals.map((sig: any, index: number) => ({
      ...sig,
      id: `ai-${Date.now()}-${index}`,
      avatar: `https://picsum.photos/seed/${sig.authorHandle}/100/100`,
      isSaved: false,
      sourceUrl: sourceUrl // Attach the primary search source
    })) as Post[];
  } catch (error) {
    console.error("AI Signal Discovery Error:", error);
    return [];
  }
}
