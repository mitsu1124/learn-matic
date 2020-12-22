const Web3 = require('web3');
const config = require('../config');
const fs = require('fs');
// const recieverABI = require("./abis/Receiver.json");
// const senderABI = require("./abis/Sender.json");
// const Network = require("@maticnetwork/meta/network");

// const network = new Network("testnet","mumbai");

const main = new Web3(config.root.RPC);
const matic = new Web3(config.child.RPC);

const privateKey = config.user.privateKey;

matic.eth.accounts.wallet.add(privateKey);
main.eth.accounts.wallet.add(privateKey);

const receiverAddress = '0xc75740b826776a32498cB1ECf8122494F28c9C85';
const recieverABI = fs.readFileSync('./abis/Receiver.json');
const senderAddress = '0xFb059a202C11111ced3206E841b2d177D1c6B1a1';
const senderABI = fs.readFileSync('./abis/Sender.json');

const sender = new main.eth.Contract(JSON.parse(senderABI),senderAddress);
const receiver = new matic.eth.Contract(JSON.parse(recieverABI),receiverAddress);

// data to sync
function getData(string){
    const data = matic.utils.asciiToHex(string);
    return data;
}

function getString(data) {
    const string = matic.utils.hexToAscii(data);
    return string;
}

// send data via sender
async function sendData(data) {
    console.log('- Sending string from root chain:',data);
    console.log('- Sending data from root chain:',getData(data));
    const r = await sender.methods
        .sendState(getData(data))
        .send({
            from: main.eth.accounts.wallet[0].address,
            gas: 8000000
        });
    console.log('- From address', main.eth.accounts.wallet[0].address)
    console.log('- Tx hash on root chain:', r.transactionHash);
}

// check states variable on sender
async function checkSender(){
    const r = await sender.methods
        .states()
        .call()
    console.log('- The state incremented in the sender: ', r);
}

// check last received data on receiver
async function checkReceiver() {
    const r = await receiver.methods
        .lastStateId()
        .call();
    const s = await receiver.methods
        .lastChildData()
        .call();
    console.log('- Last state id in StateSender contract:', r);
    console.log('- Received data on child chain:', s);
    console.log('- Received string on child chain:', getString(s));
}

async function test(){
    await sendData('Hello World');
    await checkSender();
    await checkReceiver();
}

test();