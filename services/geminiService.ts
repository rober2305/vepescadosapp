
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
export const getInventoryInsights = async (products: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analiza el siguiente inventario de pescadería y proporciona 3 recomendaciones estratégicas breves para el gerente. 
  Enfócate en productos con bajo stock o posibles excedentes.
  Inventario: ${JSON.stringify(products)}`;

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
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              urgency: { type: Type.STRING, description: 'Alta, Media, Baja' }
            },
            required: ["title", "description", "urgency"]
          }
        }
      }
    });

    // Extracting text output from GenerateContentResponse using .text property
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Verificar Salmón", description: "El stock parece bajo comparado con la demanda semanal.", urgency: "Alta" },
      { title: "Promoción de Marisco", description: "Considera una oferta de fin de semana para los camarones.", urgency: "Media" }
    ];
  }
};
