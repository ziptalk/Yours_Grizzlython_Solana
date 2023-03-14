import { ethers } from 'ethers';
import config from '../../config';
import deployed from './ploygon-deployed-address.json';
import factoryData from '../Polygon/YoursFactory.json';
import { getDeployedAddress } from '../common/commonContract';

const factoryAddress = deployed.YoursFactory;
const polygonProvider: ethers.providers.Provider =
  ethers.providers.getDefaultProvider(config.polygonRPC);
const walletObj = new ethers.Wallet(config.WalletSecretKey);
const wallet = walletObj.connect(polygonProvider);
const contract = new ethers.Contract(
  factoryAddress,
  factoryData.abi,
  polygonProvider,
);

const deployPolygonNFT = async (
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

const mintPolygonNFT = async (nft: any, address: string) => {
  const gasFeeData = await polygonProvider.getFeeData();
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

const setPolygonBenefitURI = async (nft: ethers.Contract, uri: string) => {
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
  deployPolygonNFT,
  mintPolygonNFT,
  polygonProvider,
  setPolygonBenefitURI,
};
