import * as dotenv from 'dotenv';
import express from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { OpenAI } from "openai"; // Import OpenAI class
import { ChatCompletionMessage } from 'openai/resources';

dotenv.config();
const app = express();
const port = 3000;

// Your OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to parse JSON bodies
app.use(express.json());

// Route to interact with OpenAI API
app.post("/chat/:chatId", async (req: any, res: any) => {
  const { chatId } = req.params;
  const { message, user } = req.body;

  try {
    const response = await interactWithAI(message, user, chatId);
    res.json({ response });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      error: "An error occurred while interacting with the OpenAI API. Please check the console for more details.",
    });
  }
});

// Route to get chat history
app.get("/chat/:chatId", async (req: any, res: any) => {
  const { chatId } = req.params;

  try {
    const chatFolderPath = `./backend/chats/${chatId}`;
    const chatFilePath = `${chatFolderPath}/messages.json`;

    if (!existsSync(chatFilePath)) {
      return res.status(404).json({ error: "Chat history not found" });
    }

    const raw = readFileSync(chatFilePath, { encoding: "utf8" });
    const messageData = JSON.parse(raw || "{}");

    res.json(messageData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      error: "An error occurred while retrieving chat history. Please check the console for more details.",
    });
  }
});


// Function to interact with the OpenAI API
async function interactWithAI(userPrompt: string, user: string, chatId: string): Promise<string> {
  try {
    const chatFolderPath = `./backend/chats/${chatId}`;
    const chatFilePath = `${chatFolderPath}/messages.json`;

    // Check if the chat folder exists, if not create it
    if (!existsSync(chatFolderPath)) {
      mkdirSync(chatFolderPath, { recursive: true });
    }

    // Define the message data structure
    let messageData: { messages: { role: string; user: string, content: string; timestamp: string }[] } = { messages: [] };

    // If the chat message file exists, read and parse it
    if (existsSync(chatFilePath)) {
      const raw = readFileSync(chatFilePath, { encoding: "utf8" });
      const _messageData = JSON.parse(raw || "{}");
      if (_messageData?.messages) {
        messageData = _messageData;
      }
    }

    // Get the current timestamp
    const timestamp = new Date().toISOString();

    // Format the chat history and the new user request
    const chatHistory = messageData["messages"]?.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: `${m.user}: ${m.content}` } as ChatCompletionMessage));

    // Add the new user request to the message history
    messageData["messages"].push({ role: "user", content: userPrompt, timestamp, user });

    // Make a POST request to the OpenAI chat API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente de Minecraft Bedrock, não use markdown, nem asteriscos (*). Somente textos crus. Não envie textos gigantes." },
        ...(chatHistory ? chatHistory : []),
        { role: "user", content: userPrompt }
      ],
    });

    // Add the AI response to the message history
    messageData["messages"].push({ role: "assistant", content: response.choices[0].message.content || "", timestamp, user });

    // Write the updated message history to the chat file
    writeFileSync(chatFilePath, JSON.stringify(messageData, null, 2), { flag: "w" }); // Use flag 'w' to ensure the file is overwritten

    // Return the AI response
    return response.choices[0].message.content || "";
  } catch (e) {
    // If an error occurs, log it to the console and return an error message
    console.error("An error occurred:", e);
    return "An error occurred while interacting with the OpenAI API. Please check the console for more details.";
  }
}
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
