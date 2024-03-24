import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { OpenAI } from "openai"; // Importar a classe OpenAI

const app = express();
const port = 3000;

// Sua chave da API do OpenAI
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// Middleware para analisar corpos JSON
app.use(express.json());

// Rota para interagir com a API do OpenAI
app.post("/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  try {
    const response = await interactWithAI(message, chatId);
    res.json({ response });
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: "Ocorreu um erro ao interagir com a API do OpenAI. Por favor, verifique o console para mais detalhes." });
  }
});

// Função para interagir com a API do OpenAI
async function interactWithAI(userPrompt: string, chatId: string): Promise<string> {
  try {
    const chatFolderPath = `./chats/${chatId}`;
    const chatFilePath = `${chatFolderPath}/messages.json`;

    // Verificar se a pasta do chat existe, senão criar
    if (!existsSync(chatFolderPath)) {
      mkdirSync(chatFolderPath, { recursive: true });
    }

    // Define a estrutura de dados da mensagem
    let messageData: { messages: { role: string; content: string; timestamp: string }[] } = { messages: [] };

    // Se o arquivo de mensagens do chat existir, ler e analisar
    if (existsSync(chatFilePath)) {
      const raw = readFileSync(chatFilePath, { encoding: "utf8" });
      const _messageData = JSON.parse(raw || "{}");
      if (_messageData?.messages) {
        messageData = _messageData;
      }
    }

    // Obtenha o timestamp atual
    const timestamp = new Date().toISOString();

    // Formate o histórico da conversa e a nova solicitação do usuário
    const chatHistory = messageData["messages"]?.map((m) => ({ role: m.role, content: m.content }));

    // Adicione a nova solicitação do usuário ao histórico de mensagens
    messageData["messages"].push({ role: "user", content: userPrompt, timestamp });

    // Faça uma solicitação POST para a API de chat do OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatHistory ? [...(chatHistory as any), { role: "user", content: userPrompt }] : [{ role: "user", content: userPrompt }],
    });

    // Adicione a resposta do AI ao histórico de mensagens
    messageData["messages"].push({ role: "assistant", content: response.choices[0].message.content || "", timestamp });

    // Escreva o histórico de mensagens atualizado no arquivo do chat
    writeFileSync(chatFilePath, JSON.stringify(messageData, null, 2), { flag: "w" }); // Utilize a flag 'w' para garantir que o arquivo seja sobrescrito

    // Retorne a resposta do AI
    return response.choices[0].message.content || "";
  } catch (e) {
    // Se ocorrer um erro, registre-o no console e retorne uma mensagem de erro
    console.error("Ocorreu um erro:", e);
    return "Ocorreu um erro ao interagir com a API do OpenAI. Por favor, verifique o console para mais detalhes.";
  }
}

// Rota para interagir com a API do OpenAI
app.post("/enhance", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "A mensagem não foi fornecida." });

  try {
    const response = await enhanceMessageWithAI(message);
    res.json({ response });
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    res.status(500).json({ error: "Ocorreu um erro ao interagir com a API do OpenAI. Por favor, verifique o console para mais detalhes." });
  }
});

async function enhanceMessageWithAI(message: string): Promise<string> {
  try {
    // Formate a solicitação para a API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "system", content: "Modify user messages so that they become elaborate, speak as if you were the user" },
        { role: "user", content: message },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    // Retorne a resposta da AI
    return response.choices[0].message.content || "";
  } catch (e) {
    // Se ocorrer um erro, registre-o no console e retorne uma mensagem de erro
    console.error("An error occurred while enhancing the message with AI:", e);
    return "An error occurred while enhancing the message with AI. Please check the console for more details.";
  }
}

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
