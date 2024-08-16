import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on 
the given topic or content. Follow these guidelines to create the flashcards:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 12 flashcards.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

You should return in the following JSON format:

{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}

`;

export async function POST(req) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const userMessage = await req.text();

    const query = `${systemPrompt}\n\nUser: ${userMessage}`;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const chat = model.startChat()
    let result = await model.generateContent(query)

    // just changes the text from response to an actual JSON array
    const flashcards = JSON.parse(result.response.text())
    
    return NextResponse.json(flashcards.flashcards);
}