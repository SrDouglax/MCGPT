import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { OpenAI } from "openai"; // Import OpenAI class

const app = express();
const port = 3000;

// Your OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// Middleware to parse JSON bodies
app.use(express.json());

// Route to interact with OpenAI API
app.post("/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    const response = await interactWithAI(message, chatId);
    res.json({ response });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while interacting with the OpenAI API. Please check the console for more details." });
  }
});

// Function to interact with the OpenAI API
async function interactWithAI(userPrompt: string, chatId: string): Promise<string> {
  try {
    const chatFolderPath = `./chats/${chatId}`;
    const chatFilePath = `${chatFolderPath}/messages.json`;

    // Check if the chat folder exists, if not create it
    if (!existsSync(chatFolderPath)) {
      mkdirSync(chatFolderPath, { recursive: true });
    }

    // Define the message data structure
    let messageData: { messages: { role: string; content: string; timestamp: string }[] } = { messages: [] };

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
    const chatHistory = messageData["messages"]?.map((m) => ({ role: m.role, content: m.content }));

    // Add the new user request to the message history
    messageData["messages"].push({ role: "user", content: userPrompt, timestamp });

    // Make a POST request to the OpenAI chat API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatHistory ? [...(chatHistory as any), { role: "user", content: userPrompt }] : [{ role: "user", content: userPrompt }],
    });

    // Add the AI response to the message history
    messageData["messages"].push({ role: "assistant", content: response.choices[0].message.content || "", timestamp });

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

// Route to interact with the OpenAI API
app.post("/enhance", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message was not provided." });

  try {
    const response = await enhanceMessageWithAI(message);
    res.json({ response });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while interacting with the OpenAI API. Please check the console for more details." });
  }
});

async function enhanceMessageWithAI(message: string): Promise<string> {
  try {
    // Format the request for the API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "system", content: "Modify user messages so that they become elaborate, speak as if you were the user" },
        { role: "user", content: message },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    // Return the AI's response
    return response.choices[0].message.content || "";
  } catch (e) {
    // If an error occurs, log it to the console and return an error message
    console.error("An error occurred while enhancing the message with AI:", e);
    return "An error occurred while enhancing the message with AI. Please check the console for more details.";
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});