
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { SOURCE_TEXT, QUIZ_QUESTIONS_COUNT } from '../constants';

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.ARRAY,
    description: `An array of ${QUIZ_QUESTIONS_COUNT} quiz questions.`,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: 'The question text.'
            },
            options: {
                type: Type.ARRAY,
                description: 'An array of 4 possible answers (strings).',
                items: {
                    type: Type.STRING
                }
            },
            correctAnswer: {
                type: Type.STRING,
                description: 'The correct answer string, which must be exactly one of the provided options.'
            }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

export const generateQuizQuestions = async (): Promise<Question[]> => {
    try {
        const prompt = `Based on the following text, create exactly ${QUIZ_QUESTIONS_COUNT} unique multiple-choice questions. Each question must have exactly 4 options, and only one option can be correct. The options should be plausible but distinct. Ensure the questions cover different aspects of the text (Benefits, Risks, and Issues). Do not repeat questions.

        TEXT:
        ---
        ${SOURCE_TEXT}
        ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        // Basic validation
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error("API returned an invalid or empty array.");
        }

        return parsedData as Question[];

    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw new Error("Failed to generate quiz questions. Please check the API key and try again.");
    }
};
