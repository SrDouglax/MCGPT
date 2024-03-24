import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import * as http from 'http'

events.packetBefore(MinecraftPacketIds.Text).on((ev,ni)=> {
    if (ev.message === "nochat") {
        return CANCEL; // canceling
    }

    ni.getActor()

    const requestBody = JSON.stringify({ message: ev.message }); // Corpo da requisição

    const req = http.request({
        hostname: 'localhost',
        path: '/chat',
        port: '3000',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody) // Definir o tamanho do corpo da requisição
        }
    }, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
            bedrockServer.serverInstance.getPlayers().forEach((p) => {
                p.sendMessage("MCGPT: " + JSON.parse(data || "{}")?.response)
            })
            console.log(data);
        });
    });

    req.on('error', (error) => {
        console.error('Error:', error.message);
    });

    // Enviar o corpo da requisição
    req.write(requestBody);

    req.end();
});
