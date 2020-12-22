const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const config = require("../config");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const getMaticPOSClient = () => {
  return new MaticPOSClient({
    network: "testnet", // optional, default is testnet
    version: "mumbai", // optional, default is mumbai
    parentProvider: new HDWalletProvider(
      config.user.privateKey,
      config.root.RPC
    ),
    maticProvider: new HDWalletProvider(
      config.user.privateKey,
      config.child.RPC
    ),
    posRootChainManager: config.root.POSRootChainManager,
    parentDefaultOptions: { from: config.user.address }, // optional, can also be sent as last param while sending tx
    maticDefaultOptions: { from: config.user.address }, // optional, can also be sent as last param while sending tx
  });
};

const deposit = async (from, amount) => {
  try{
    const maticPOSClient = getMaticPOSClient();
    const tx = await maticPOSClient.depositEtherForUser(from, amount, {
      from,
      gasPrice: "10000000000",
    });
    console.log(tx.transactionHash);
  } catch(e){
    console.error(e);
  }
};

deposit(config.user.address, config.user.amount).then(() => process.exit(0));
