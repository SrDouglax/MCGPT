"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@minecraft/server");
const ChatGPT_1 = require("./modules/ChatGPT");
/**
 * Event handler for chat messages sent in the game
 * Listens for chat messages and processes them through ChatGPT
 * @param event The chat event containing message and sender information
 */
server_1.world.afterEvents.chatSend.subscribe(async (event) => {
    const message = event.message;
    const sender = event.sender;
    const gpt = new ChatGPT_1.ChatGPT();
    const res = await gpt.GetResponse(sender, message);
    server_1.world.sendMessage("<MCGPT> " + res);
});
//# sourceMappingURL=main.js.map