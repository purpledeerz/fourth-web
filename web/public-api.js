import { createHmac } from "crypto";
import cors from "cors";
import Web3 from "web3";

import * as ethers from "ethers";

import { useContract } from "@thirdweb-dev/react";

import { getContractAddressesFromGate } from "./api/gates.js";

const web3 = new Web3();

export function configurePublicApi(app) {
  // This should be limited to app domains that have your app installed
  const corsOptions = {
    origin: "*",
  };

  // Configure CORS to allow requests to /public from any origin
  // Enables pre-flight requests
  app.options("/public/*", cors(corsOptions));

  app.post("/public/gateEvaluation", cors(corsOptions), async (req, res) => {
    // Evaluate the gate, message, and signature
    const {
      shopDomain,
      productGid,
      address,
      message,
      signature,
      gateConfigurationGid,
    } = req.body;

    // Verify signature
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    if (recoveredAddress !== address) {
      res.status(403).send("Invalid signature");
      console.log("Invalid signature");
      return;
    }

    // Retrieve relevant contract addresses from gates
    const requiredContractAddresses = await getContractAddressesFromGate({
      shopDomain,
      productGid,
    });

    // Lookup tokens
    const unlockingTokens = await retrieveUnlockingTokens(
      address,
      requiredContractAddresses
    );
    if (unlockingTokens.length === 0) {
      res.status(403).send("No unlocking tokens");
      console.log("No unlocking tokens");
      return;
    }

    const payload = {
      id: gateConfigurationGid,
    };

    const response = { gateContext: [getHmac(payload)], unlockingTokens };
    res.status(200).send(response);
  });
}

function getHmac(payload) {
  const hmacMessage = payload.id;
  const hmac = createHmac("sha256", "secret-key");
  hmac.update(hmacMessage);
  const hmacDigest = hmac.digest("hex");
  return {
    id: payload.id,
    hmac: hmacDigest,
  };
}

function retrieveUnlockingTokens(address, contractAddresses) {
  console.log("retrieveUnlockingTokens");
  const [nfts, setNfts] = useState([]);
  const collectionAddress = contractAddresses[0];
  console.log(contractAddresses);
  console.log(collectionAddress);
  const { contract: collection } = useContract(collectionAddress);

  useEffect(() => {
    if (!collection || !address) return;
    getNFTs();
  }, [address, collection]);

  /*
    contractAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    collectionName: 'CryptoPunks',
    imageUrl:
      'https://i.seadn.io/gae/ZWEV7BBCssLj4I2XD9zlPjbPTMcmR6gM9dSl96WqFHS02o4mucLaNt8ZTvSfng3wHfB40W9Md8lrQ-CSrBYIlAFa?auto=format&w=1000',
    name: 'CryptoPunk #1719',
  */
  console.log("get NFTS");
  const getNFTs = async () => {
    try {
      const data = await collection.getAll();
      let Nfts = [];

      data.forEach((each) => {
        if (each.owner === address) {
          Nfts.push({
            contractAddress: collectionContract,
            collectionName: each.metadata.name,
            imageUrl: each.metadata.image,
            name: each.metadata.id,
          });
        }
      });

      setNfts(Nfts);
    } catch (error) {
      console.log(error);
    }
  };
  return nfts;
}

const ChainNames = [
  "mainnet",
  "ethereum",
  "goerli",
  "polygon",
  "matic",
  "mumbai",
  "fantom",
  "fantom-testnet",
  "avalanche",
  "avalanche-testnet",
  "avalanche-fuji",
  "optimism",
  "optimism-goerli",
  "arbitrum",
  "arbitrum-goerli",
  "binance",
  "binance-testnet",
  "hardhat",
  "localhost",
];

const isValidChainName = (chainName) => {
  return ChainNames.find((name) => name === chainName);
};

const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};
