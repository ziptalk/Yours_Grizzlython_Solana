import BN from 'bn.js';
export class NFTData {
    title: string;
    symbol: string;
    uri: string;
    benefit_uri: string;
    benefits: Array<BN>;

    constructor(name: string) {
        this.title = `NFT ${name}`;
        this.symbol = `${name}`;
        this.uri = 'https://gateway.pinata.cloud/ipfs/QmS95oJiaj8raAnLR13SyowhXsrP4eaWP5rCdxzuNS6ikp'
        this.benefit_uri = "test";
        const myNumberArray: Array<number> = [1, 2, 3];
        this.benefits = myNumberArray.map((n) => new BN(n));
    }
}
