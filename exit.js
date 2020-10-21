const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const config = require("./config");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const provider = new Web3.providers.WebsocketProvider(
    "wss://goerli.infura.io/ws/v3/5687b932e64441e5a297a0bfba8895cd"
  );

const web3 = new Web3(provider);  

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

const txHash =
  "0x40abcbeb147eb934b3d1a3fb1403f45c80d3e63628efc4f5b844a604c92d9682";

const logEventSignature = "0x93f3e547dcb3ce9c356bb293f12e44f70fc24105d675b782bd639333aab70df7";

const execute = async () => {
  try {
    const maticPOSClient = getMaticPOSClient();
    const tx = await maticPOSClient.posRootChainManager.exit(
      txHash,
      logEventSignature
    );
    console.log(tx.transactionHash); // eslint-disable-line
  } catch (e) {
    console.error(e); // eslint-disable-line
  }
};

execute().then(() => process.exit(0));
