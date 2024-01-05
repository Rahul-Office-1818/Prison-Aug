import ping from 'ping';
import { createSocket } from 'dgram';

const client = createSocket({ type: "udp4" });

const checkConnection = async (hosts) => {
    const promise = hosts.map(host => ping.promise.probe(host))
    return (await Promise.all(promise)).map(el => { return { host: el.host, alive: el.alive } })
}

const toggleJammer = async (params) => {
    return await new Promise((resolve, reject) => {
        client.send(params.mode, Number(params.port), params.ip, (err) => {
            (err) ? reject(err)
                : client.on("message", (message, info) => {
                    resolve(message.toString());
                });
        });
    });
}


export { checkConnection, toggleJammer };