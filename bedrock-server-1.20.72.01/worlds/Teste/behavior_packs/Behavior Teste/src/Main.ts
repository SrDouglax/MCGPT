import { system, world } from "@minecraft/server";
import { getGptResponse } from "modules/gpt";

world.beforeEvents.chatSend.subscribe(async (event) => {
  // event.sender.sendMessage(`Making request...`);
  event.cancel = true;
  try {
    system.run(async () => {
      const res = await getGptResponse(event.sender, event.message);
      console.log(JSON.stringify(res));
      const message = JSON.parse(res.body || "{}");
      event.sender.sendMessage(`<${event.sender.name}> ${message.response}`);
    });
  } catch (error) {
    system.run(() => {
      event.sender.sendMessage(`Error: ${error}`);
    });
  }
});
