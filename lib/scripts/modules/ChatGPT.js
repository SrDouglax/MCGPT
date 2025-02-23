"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPT = void 0;
const server_1 = require("@minecraft/server");
const server_net_1 = require("@minecraft/server-net");
/**
 * Class to handle ChatGPT API interactions
 */
class ChatGPT {
    /**
     * Gets a response from the ChatGPT API
     * @param sender The player who sent the message
     * @param message The message to send to ChatGPT
     * @returns The response from ChatGPT
     */
    async GetResponse(sender, message, chatId = 'default') {
        try {
            const req = new server_net_1.HttpRequest(`http://localhost:3000/chat/${chatId}`);
            req.body = JSON.stringify({
                message,
                user: sender.name
            });
            req.method = server_net_1.HttpRequestMethod.Post;
            req.headers = [new server_net_1.HttpHeader("Content-Type", "application/json")];
            const res = await server_net_1.http.request(req);
            return JSON.parse(res.body).response;
        }
        catch (error) {
            console.log(error);
            server_1.system.run(() => {
                sender.sendMessage(`Errow: ${error}`);
            });
        }
    }
}
exports.ChatGPT = ChatGPT;
//# sourceMappingURL=ChatGPT.js.map