import ping from 'ping';
import { createSocket } from 'dgram';


const findItem = (arr, item) => {
    return arr.filter(el => el.host === item);
}

const checkConnection = async (jammers) => {
    const promise = jammers.map(item => ping.promise.probe(item.ipAddress));
    const resolve = (await Promise.all(promise))
        .map(item => {
            return { host: item.host, alive: item.alive };
        });

    const result = new Array();

    resolve.forEach((item) => {
        jammers.forEach((ele, index) => {
            if (item.host === ele.ipAddress) {
                result.push({
                    host: item.host,
                    jammerId: ele.id,
                    jammerName: ele.name,
                    blockId: ele.blockId,
                    alive: item.alive
                })
            }
        })
    });
    
    return result
}

const toggleJammer = (params) => {
    return new Promise((resolve, reject) => {
        const client = createSocket({ type: "udp4" });
        client.send(Buffer.from(params.mode), Number(params.port), params.ip, (err) => {
            if (err) reject(err);
            setTimeout(() => reject("connection error"), 4000);
            client.on("message", (message, info) => {
                client.close();
                resolve(message.toString());
            });

        });
    });
}


export { checkConnection, toggleJammer };