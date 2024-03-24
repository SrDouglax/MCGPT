import { Player, system } from "@minecraft/server";
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from "@minecraft/server-net";

export async function getGptResponse(sender: Player, message: string) {
  console.log("!! " + message);
  try {
    const req = new HttpRequest("http://localhost:3000/enhance");

    req.body = JSON.stringify({
      message,
    });

    console.log(message);

    req.method = (HttpRequestMethod as any).Post;
    req.headers = [new HttpHeader("Content-Type", "application/json")];

    const res = await http.request(req);
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
    system.run(() => {
      sender.sendMessage(`Errow: ${error}`);
    });
  }
}
