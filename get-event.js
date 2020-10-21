const ethers = require('ethers');
const config = require("./config");

const topicTransfer= ethers.utils.id("Data(address,bytes)") //This is the interface for your event
console.log("topic ID for your event", topicTransfer);
const providerURL = config.root.RPC;
const provider = new ethers.providers.JsonRpcProvider(providerURL);

const main = async () => { 
    await provider.getLogs({
    fromBlock: 0,
    address: "0x11a445414208e1aa119248a95e3fdf6f3e136f16", 
    toBlock: 'latest',
    topics: [topicTransfer]
}).catch(() => [])
}

main();
