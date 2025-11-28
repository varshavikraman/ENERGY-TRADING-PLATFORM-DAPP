import { createPublicClient, parseAbiItem, webSocket } from "viem";
import { hoodi } from "viem/chains";
import ET from "../assets/ET.json" with { type: "json" };

const client = createPublicClient({
    chain: hoodi,
    transport: webSocket("wss://eth-hoodi.g.alchemy.com/v2/EiqbQeR07jisXLKzHBO7x")
});


console.log("Listening for Energy Marketplace events...");

client.watchEvent({
    address: ET.Hoodi_MARKETPLACE_ADDRESS,
    event: parseAbiItem(
        "event EnergyListed(uint256 indexed listingId, address indexed producer, uint256 amount, uint256 price)"
    ),
    onLogs: (logs) => {
        console.log("===============================================================");
        console.log("EVENT: Energy Listed");
        console.log("Listing ID:", logs[0].args.listingId);
        console.log("Producer:", logs[0].args.producer);
        console.log("Amount:", logs[0].args.amount);
        console.log("Price per Token:", logs[0].args.price);
        console.log("Raw Logs:", logs);
        console.log("===============================================================");
    }
});

client.watchEvent({
    address: ET.Hoodi_MARKETPLACE_ADDRESS,
    event: parseAbiItem(
        "event EnergyPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalCost)"
    ),
    onLogs: (logs) => {
        console.log("===============================================================");
        console.log("EVENT: Energy Purchased");
        console.log("Listing ID:", logs[0].args.listingId);
        console.log("Buyer:", logs[0].args.buyer);
        console.log("Amount Bought:", logs[0].args.amount);
        console.log("Total Cost (ETH):", logs[0].args.totalCost);
        console.log("Raw Logs:", logs);
        console.log("===============================================================");
    }
});

