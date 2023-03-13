export class NFTData {
    title: string;
    symbol: string;
    uri: string;
    benefit_uri: string;

    constructor(name: string) {
        this.title = `NFT ${name}`;
        this.symbol = `${name}`;
        //this.uri = `https://raw.githubusercontent.com/ICavlek/SolanaNFT/main/assets/${name.toLowerCase()}.json`;
        this.uri = 'https://gateway.pinata.cloud/ipfs/QmS95oJiaj8raAnLR13SyowhXsrP4eaWP5rCdxzuNS6ikp'
        this.benefit_uri = "test";
    }
}