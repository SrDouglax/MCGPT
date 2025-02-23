import { Player, system } from "@minecraft/server";
import { HttpHeader, HttpRequest, HttpRequestMethod, http } from "@minecraft/server-net";

/**
 * Class to handle ChatGPT API interactions
 */
export class ChatGPT {
  /**
   * Gets a response from the ChatGPT API
   * @param sender The player who sent the message
   * @param message The message to send to ChatGPT
   * @returns The response from ChatGPT
   */
  async GetResponse(sender: Player, message: string, chatId = 'default'): Promise<string | undefined> {
    try {
      const req = new HttpRequest(`http://localhost:3000/chat/${chatId}`);

      req.body = JSON.stringify({
        message,
        user: sender.name
      });

      req.method = (HttpRequestMethod as any).Post;
      req.headers = [new HttpHeader("Content-Type", "application/json")];

      const res = await http.request(req);
      return JSON.parse(res.body).response
    } catch (error) {
      console.log(error);
      system.run(() => {
        sender.sendMessage(`Errow: ${error}`);
      });
    }
  }
}