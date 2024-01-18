import ping from 'ping';
import { createSocket } from 'dgram';



const checkConnection = async (jammers) => {
    const promise = jammers.map(jammer => ping.promise.probe(jammer.ipAddress))
    return (await Promise.all(promise)).map(el => { return { host: el.host, alive: el.alive } })
}

const toggleJammer = (params) => {
    return new Promise((resolve, reject) => {
        const client = createSocket({ type: "udp4" });
        client.send(Buffer.from(params.mode), Number(params.port), params.ip, (err) => {
            if (err) reject(err)
            client.on("message", (message, info) => {
                client.close();
                resolve(message.toString());
            });

        });
    });
}


export { checkConnection, toggleJammer };