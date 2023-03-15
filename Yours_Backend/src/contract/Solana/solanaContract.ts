import * as anchor from "@project-serum/anchor";
import { NFTData } from "./nftData";
import { YoursNft } from "../../target/types/yours_nft";

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
        const benefitURIAddress: anchor.web3.PublicKey = await this.createBenefitURIAddress(mintKeypair);
        const benefitsAddress: anchor.web3.PublicKey = await this.createBenefitsAddress(mintKeypair.publicKey, tokenAddress)
      
        await this.callMint(masterEditionAddress, metadataAddress, mintKeypair, tokenAddress, benefitURIAddress, benefitsAddress, nftData);
        const account = await this.program.account.benefitUriAccount.fetch(benefitURIAddress)
        return account.benefitUri;
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
        );
    }

    private createProgram(): anchor.Program<YoursNft> {
        return anchor.workspace.YoursNft as anchor.Program<YoursNft>;
    }

    private createMintKeypair(): anchor.web3.Keypair {
        const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        return mintKeypair;
    }

    private async createTokenAddress(mintKeypairPublicKey: anchor.web3.PublicKey, ownerPublicKey: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> {
        return await anchor.utils.token.associatedAddress({
            mint: mintKeypairPublicKey,
            owner: ownerPublicKey
        });
    }

    private async createMetadataAddress(mintKeypair: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
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

    private async createBenefitURIAddress(mintKeypair: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
        return (await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("benefitURI"),
                mintKeypair.publicKey.toBuffer()
            ],
            this.program.programId
        ))[0];
    }

    private async createBenefitsAddress(mintKeypairPublickey: anchor.web3.PublicKey, tokenAccountPublickey: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> {
        return (await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("benefit"),
                mintKeypairPublickey.toBuffer(),
                tokenAccountPublickey.toBuffer()
            ],
            this.program.programId
        ))[0];
    }

    private async callMint(masterEditionAddress: anchor.web3.PublicKey, metadataAddress: anchor.web3.PublicKey, mintKeypair: anchor.web3.Keypair, tokenAddress: anchor.web3.PublicKey, benefitURIAddress: anchor.web3.PublicKey, benfitsAddress: anchor.web3.PublicKey, nftData: NFTData) {
        await this.program.methods.mint(
            nftData.title, nftData.symbol, nftData.uri, nftData.benefit_uri, nftData.benefits
        )
            .accounts({
                metadata: metadataAddress,
                masterEdition: masterEditionAddress,
                mint: mintKeypair.publicKey,
                tokenAccount: tokenAddress,
                mintAuthority: this.wallet.publicKey,
                benefitInfo: benefitURIAddress,
                benefitsList: benfitsAddress,
                tokenMetadataProgram: this.tokenMetaDataProgramID,  
            })
            .signers([mintKeypair])
            .rpc();
    }
    
}
