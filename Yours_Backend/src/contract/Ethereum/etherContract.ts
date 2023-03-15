import { ethers } from 'ethers';
import config from '../../config';
import deployed from './ether-deployed-address.json';
import factoryData from '../Ethereum/YoursFactory.json';
import { getDeployedAddress } from '../common/commonContract';

const factoryAddress = deployed.YoursFactory;
const etherProvider: ethers.providers.Provider =
  ethers.providers.getDefaultProvider(config.gorilRPC);
const walletObj = new ethers.Wallet(config.WalletSecretKey);
const wallet = walletObj.connect(etherProvider);
const contract = new ethers.Contract(
  factoryAddress,
  factoryData.abi,
  etherProvider,
);

const deployEtherNFT = async (
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
      gasLimit: gas,
    });
  const deployedInfo = await getDeployedAddress(transaction);
  while (typeof deployedInfo.contractAddress == 'string') {
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

const mintEtherNFT = async (nft: ethers.Contract, address: string) => {
  const transaction = await nft.connect(wallet).mint(address);
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

const setEtherBenefitURI = async (nft: ethers.Contract, uri: string) => {
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

export { deployEtherNFT, mintEtherNFT, etherProvider, setEtherBenefitURI };
