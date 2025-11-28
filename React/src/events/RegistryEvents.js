import { createPublicClient, parseAbiItem, webSocket } from "viem";
import { hoodi } from "viem/chains";
import ET from "../assets/ET.json" with { type: "json" };

const client = createPublicClient({
    chain: hoodi,
    transport: webSocket("wss://eth-hoodi.g.alchemy.com/v2/EiqbQeR07jisXLKzHBO7x")
});

console.log("Listening for ProducerRegistry events...");

client.watchEvent({
    address: ET.Hoodi_REGISTRY_ADDRESS,
    event: parseAbiItem(
        "event ProducerRequested(address producer)"
    ),
    onLogs: (logs) => {
        console.log("===============================================================");
        console.log("EVENT: Producer Requested");
        console.log("Producer:", logs[0].args.producer);
        console.log("Raw Log:", logs);
        console.log("===============================================================");
    }
});


client.watchEvent({
    address: ET.Hoodi_REGISTRY_ADDRESS,
    event: parseAbiItem(
        "event ProducerApproved(address producer)"
    ),
    onLogs: (logs) => {
        console.log("===============================================================");
        console.log("EVENT: Producer Approved");
        console.log("Producer:", logs[0].args.producer);
        console.log("Raw Log:", logs);
        console.log("===============================================================");
    }
});

client.watchEvent({
    address: ET.Hoodi_REGISTRY_ADDRESS,
    event: parseAbiItem(
        "event ProducerRejected(address producer)"
    ),
    onLogs: (logs) => {
        console.log("===============================================================");
        console.log("EVENT: Producer Rejected");
        console.log("Producer:", logs[0].args.producer);
        console.log("Raw Log:", logs);
        console.log("===============================================================");
    }
});
