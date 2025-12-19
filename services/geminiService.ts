
import { GoogleGenAI, Type } from "@google/genai";
import { User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCandidate = async (candidate: User): Promise<string> => {
  const prompt = `
    Analyze this candidate's profile for a futuristic tech role:
    Name: ${candidate.name}
    Domain: ${candidate.domain}
    Skills: ${candidate.skill}
    Experience: ${candidate.experience}
    
    Provide a professional, concise "AI Insight" summary (max 3 sentences). 
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No AI insight available.";
  } catch (error) {
    return "AI analysis unavailable.";
  }
};

export const correlateCandidates = async (requirement: string, candidates: User[]): Promise<any[]> => {
  const candidateData = candidates.map(c => ({
    id: c.id,
    name: c.name,
    domain: c.domain,
    skills: c.skill,
    experience: c.experience
  }));

  const prompt = `
    Act as a recruitment engine. Correlate the following project requirement with the candidate list.
    Requirement: "${requirement}"
    Candidates: ${JSON.stringify(candidateData)}

    Rank them by eligibility. For each candidate, provide a "matchScore" (0-100) and a brief "reason".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["id", "matchScore", "reason"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Correlation error:", error);
    return [];
  }
};
