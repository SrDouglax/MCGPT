import { world } from "@minecraft/server";
import { ChatGPT } from "./modules/ChatGPT";

/**
 * Event handler for chat messages sent in the game
 * Listens for chat messages and processes them through ChatGPT
 * @param event The chat event containing message and sender information
 */
world.afterEvents.chatSend.subscribe(async (event) => {
  const message = event.message;
  const sender = event.sender;

  const gpt = new ChatGPT()
  const res = await gpt.GetResponse(sender, message);
  world.sendMessage("<MCGPT> " + res);
})