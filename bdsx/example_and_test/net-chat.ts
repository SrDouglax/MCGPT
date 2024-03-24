// Chat Listening
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from "@minecraft/server-net";
import { bedrockServer } from "bdsx/launcher";

events.packetBefore(MinecraftPacketIds.Text).on(ev => {
    if (ev.message === "nochat") {
        return CANCEL; // canceling
    }

    const req = new HttpRequest("http://localhost:3000/chat");
    req.body = JSON.stringify({
        message:ev.message,
    });
    req.method = HttpRequestMethod.POST;
    req.headers = [new HttpHeader("Content-Type", "application/json"), new HttpHeader("auth", "my-auth-token")];
    try {
        http.request(req).then((res)=> {
        bedrockServer.serverInstance.getPlayers().forEach((p) => {
            p.sendMessage(res.body)
        })
    })
    } catch (error) {
        console.log(error)
    }
    ev.message = ev.message + '...';
});
