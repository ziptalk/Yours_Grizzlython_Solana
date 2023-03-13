import * as anchor from "@project-serum/anchor";
import { YoursNft } from "../../target/types/yours_nft";
import { NFTData } from "../NFTData/NFTData";

export class NFTOwner {
    wallet: anchor.Wallet;
    tokenMetaDataProgramID: anchor.web3.PublicKey;
    program: anchor.Program<YoursNft>;

    constructor() {
        this.wallet = this.createWallet();
        this.tokenMetaDataProgramID = this.createTokenMetaDataProgramID();
        this.program = this.createProgram();
    }

    async mint(nftData: NFTData) {
        const mintKeypair: anchor.web3.Keypair = this.createMintKeypair();
        const tokenAddress: anchor.web3.PublicKey = await this.createTokenAddress(mintKeypair.publicKey, this.wallet.publicKey);
        const metadataAddress: anchor.web3.PublicKey = await this.createMetadataAddress(mintKeypair);
        const masterEditionAddress: anchor.web3.PublicKey = await this.createMasterEditionAddress(mintKeypair);
        const benefitAddress: anchor.web3.PublicKey = await this.createBenefitAddress(mintKeypair);
        console.log("benefit address:  ", benefitAddress);
        await this.callMint(masterEditionAddress, metadataAddress, mintKeypair, tokenAddress, benefitAddress, nftData);
        console.log(benefitAddress)
        const account = await this.program.account.benefitUriAccount.fetch(benefitAddress)
        console.log("result: ", account.benefitUri);
    }

    async sell(nftPublicKey: anchor.web3.PublicKey, keypairJohn: anchor.web3.Keypair) {
        const saleAmount: number = 0.0005 * anchor.web3.LAMPORTS_PER_SOL;
        const ownerTokenAddress: anchor.web3.PublicKey = await this.createTokenAddress(nftPublicKey, this.wallet.publicKey);
        const buyerTokenAddress: anchor.web3.PublicKey = await this.createTokenAddress(nftPublicKey, keypairJohn.publicKey);
        await this.callSell(saleAmount, nftPublicKey, ownerTokenAddress, buyerTokenAddress, keypairJohn);
    }

    private createWallet(): anchor.Wallet {
        const provider = anchor.AnchorProvider.env();
        const wallet = provider.wallet as anchor.Wallet;
        anchor.setProvider(provider);
        return wallet;
    }

    private createTokenMetaDataProgramID(): anchor.web3.PublicKey {
        return new anchor.web3.PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        ); // Don't know what that is, googled and extracted from metaplex
    }

    private createProgram(): anchor.Program<YoursNft> {
        //console.log("test", anchor.workspace.YoursNft)
        return anchor.workspace.YoursNft as anchor.Program<YoursNft>;
    }

    private createMintKeypair(): anchor.web3.Keypair {
        console.log("Generating mint keypair...");
        const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        console.log(`New token: ${mintKeypair.publicKey}`);
        return mintKeypair;
    }

    private async createTokenAddress(mintKeypairPublicKey: anchor.web3.PublicKey, ownerPublicKey: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> {
        console.log("Creating token address...");
        return await anchor.utils.token.associatedAddress({
            mint: mintKeypairPublicKey,
            owner: ownerPublicKey
        });
    }

    private async createMetadataAddress(mintKeypair: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
        console.log("Initializing metadata...");
        return (await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                this.tokenMetaDataProgramID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
            ],
            this.tokenMetaDataProgramID
        ))[0];
    }

    private async createMasterEditionAddress(mintKeypair: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
        console.log("Initializing master edition address...");
        return (await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("metadata"),
                this.tokenMetaDataProgramID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
                Buffer.from("edition"),
            ],
            this.tokenMetaDataProgramID
        ))[0];
    }

    private async createBenefitAddress(mintKeypair: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
        console.log("create benefit address...");
        return (await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("benefitURI"),
                mintKeypair.publicKey.toBuffer()
            ],
            this.program.programId
        ))[0];
    }

    private async callMint(masterEditionAddress: anchor.web3.PublicKey, metadataAddress: anchor.web3.PublicKey, mintKeypair: anchor.web3.Keypair, tokenAddress: anchor.web3.PublicKey, benefitAddress: anchor.web3.PublicKey, nftData: NFTData) {
        await this.program.methods.mint(
            nftData.title, nftData.symbol, nftData.uri, nftData.benefit_uri
        )
            .accounts({
                metadata: metadataAddress,
                masterEdition: masterEditionAddress,
                mint: mintKeypair.publicKey,
                tokenAccount: tokenAddress,
                mintAuthority: this.wallet.publicKey,
                benefitInfo: benefitAddress,
                tokenMetadataProgram: this.tokenMetaDataProgramID,  
            })
            .signers([mintKeypair])
            .rpc();
    }

    private async callSell(saleAmount: number, nftPublicKey: anchor.web3.PublicKey, ownerTokenAddress: anchor.web3.PublicKey, buyerTokenAddress: anchor.web3.PublicKey, keypairBuyer: anchor.web3.Keypair) {
        await this.program.methods.sell(
            new anchor.BN(saleAmount)
        )
            .accounts({
                mint: nftPublicKey,
                ownerTokenAccount: ownerTokenAddress,
                ownerAuthority: this.wallet.publicKey,
                buyerTokenAccount: buyerTokenAddress,
                buyerAuthority: keypairBuyer.publicKey,
            })
            .signers([keypairBuyer])
            .rpc();
    }

    
}