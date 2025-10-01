
import { GoogleGenAI } from "@google/genai";
import { ReferenceImage } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImage(prompt: string): Promise<ReferenceImage> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return {
                data: base64ImageBytes,
                mimeType: 'image/png',
            };
        } else {
            throw new Error("Received no images from the API.");
        }

    } catch(error) {
        console.error("Error calling Imagen API:", error);
        throw new Error("Failed to communicate with the Imagen API.");
    }
}


export async function generateVeoPrompt(
    template: string,
    values: { [key: string]: string },
    negativePrompt: string,
    image: ReferenceImage | null,
    styleName: string | null
): Promise<string> {
    const userValuesForPrompt = { ...values };
    
    // Convert multiline text into JSON arrays for placeholders that suggest lists
    for (const key in userValuesForPrompt) {
        if (userValuesForPrompt[key].includes('\n')) {
             userValuesForPrompt[key] = JSON.stringify(userValuesForPrompt[key].split('\n').map(s => s.trim()).filter(Boolean));
        }
    }

    const negativePromptSection = (negativePrompt && negativePrompt.trim())
        ? `
        **Negative Prompt (Exclusions):**
        The user has specified the following elements, styles, or concepts MUST BE AVOIDED in the output:
        - ${negativePrompt.trim()}
        Ensure none of these appear in the final JSON. This is a strict requirement.
        `
        : '';

    const visualStyleSection = (styleName && styleName.trim())
        ? `
        **Visual Style Mandate (CRITICAL):**
        The user has selected the '${styleName}' visual style. You MUST infuse the entire output with the aesthetic, mood, and characteristics of this artistic movement.
        - All descriptions of lighting, environment, color, texture, and motion must strongly reflect the core principles of ${styleName}.
        - For example, if the style is 'Film Noir', expect high-contrast lighting, deep shadows, and a gritty, urban mood. If 'Impressionism', use language that evokes soft, broken brushstrokes, natural light, and a focus on feeling over precise detail.
        This is a primary instruction that overrides any conflicting generalities in the template.
        `
        : '';

    let prompt = `
        You are a world-class creative director and Google Veo 3 JSON prompt architect. Your mission is to transform a basic JSON template and user inputs into a complete, visually stunning, and cinematic video prompt.
        ${visualStyleSection}
        ${negativePromptSection}
        **Creative Mandate: Strive for Excellence**
        1.  **Cinematic & Sensory Language:** Every description must be rich and evocative. Instead of "good lighting," write "soft golden-hour sunlight streaming through tall trees, casting long shadows." Describe textures, motion, and atmosphere.
        2.  **Emulate the Best:** Your output should mirror the premium, high-end aesthetic of iconic brand ads from Apple (minimalist, precise, elegant), Dior (ethereal, magical, luxurious), and Tesla (futuristic, clean, powerful). The goal is Hollywood-level visual storytelling.
        3.  **Fill in the Blanks Creatively:** When replacing placeholders, if the user input is simple (e.g., "a car"), enrich it within the context of the scene (e.g., "a gleaming obsidian-black sports car, rain cascading off its aerodynamic curves").

        **Technical & Formatting Rules (CRITICAL):**
        1.  **Strict Schema Adherence:** You MUST use the exact structure from the provided JSON template. DO NOT add, remove, or rename any keys. The structure is non-negotiable.
        2.  **Placeholder Replacement:** Replace all placeholders (e.g., {{PLACEHOLDER}}) with the corresponding user values, creatively enhancing them as instructed above.
        3.  **Data Formatting:** If a user value is a JSON array string (from a multi-line input), parse it correctly into the JSON array. For comma-separated keywords, format them as a JSON array of strings.
        4.  **RAW JSON OUTPUT ONLY:** Your entire response must be a single, raw, valid JSON object. DO NOT wrap it in markdown fences (\`\`\`json), and do not include any explanatory text, comments, or apologies before or after the JSON.

        **JSON Template:**
        \`\`\`json
        ${template}
        \`\`\`

        **User-Provided Values:**
        \`\`\`json
        ${JSON.stringify(userValuesForPrompt)}
        \`\`\`

        Generate the final, cinematic JSON output now.
    `;
    
    const parts: any[] = [];

    if (image) {
        const visualInstruction = `
        **Visual Reference (CRITICAL):**
        An image of the product has been provided. You MUST use this image as the primary visual reference for "{{PRODUCT_NAME}}". Ensure all generated descriptions of the product precisely match the appearance, style, materials, and specific details shown in the provided image.
        `;
        prompt = visualInstruction + prompt;

        parts.push({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        });
    }

    parts.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
        });

        if (response && response.text) {
            return response.text;
        } else {
            throw new Error("Received an empty response from the API.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
}
