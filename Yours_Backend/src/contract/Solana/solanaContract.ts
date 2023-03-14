import { ethers } from 'ethers';
import config from '../../config';
import deployed from './solana-deployed-address.json';
import factoryData from '../Solana/YoursFactory.json';
import { getDeployedAddress } from '../common/commonContract';

const factoryAddress = deployed.YoursFactory;
const solanaProvider: ethers.providers.Provider =
  ethers.providers.getDefaultProvider(config.solanaRPC);
const walletObj = new ethers.Wallet(config.WalletSecretKey);
const wallet = walletObj.connect(solanaProvider);
const contract = new ethers.Contract(
  factoryAddress,
  factoryData.abi,
  solanaProvider,
);

const deploySolanaNFT = async (
  name: string | null,
  uri: string | null,
  benefitUri: string | null,
) => {
  let transaction;
  const gas = await contract
    .connect(wallet)
    .estimateGas.deployNFT(name, '', uri, benefitUri, []);
  transaction = await contract
    .connect(wallet)
    .deployNFT(name, '', uri, benefitUri, [], {
      gasPrice: gas,
    });
  const deployedInfo = await getDeployedAddress(transaction);
  while (typeof deployedInfo == 'string') {
    const deployedInfo = await getDeployedAddress(transaction);
    return deployedInfo;
  }

  const data = {
    contractAddress: deployedInfo.contractAddress,
    transactionHash: deployedInfo.transactionHash,
    date: deployedInfo.date,
  };
  return data;
};

const mintSolanaNFT = async (nft: any, address: string) => {
  const gasFeeData = await solanaProvider.getFeeData();
  const transaction = await nft
    .connect(wallet)
    .mint(address, { gasPrice: gasFeeData.gasPrice });
  const rc = await transaction.wait();
  const event = rc.events.find((event: any) => event.event === 'Mint');
  const transactionHash = event.transactionHash;
  const block = await event.getBlock(); // check minting block timestamp
  const date = new Date(block.timestamp * 1000);

  const data = {
    transactionHash: transactionHash,
    date: date,
  };

  return data;
};

const setSolanaBenefitURI = async (nft: ethers.Contract, uri: string) => {
  const transaction = await nft.connect(wallet).setBenefitsURI(uri);
  const rc = await transaction.wait();
  const event = rc.events.find(
    (event: any) => event.event === 'ChangeBenefitsURI',
  );
  const transactionHash = event.transactionHash;
  const block = await event.getBlock(); // check minting block timestamp
  const date = new Date(block.timestamp * 1000);

  const data = {
    transactionHash: transactionHash,
    date: date,
  };

  return data;
};

export {
  deploySolanaNFT,
  mintSolanaNFT,
  solanaProvider,
  setSolanaBenefitURI,
};
