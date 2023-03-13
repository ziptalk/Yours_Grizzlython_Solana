import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { YoursNft } from "../target/types/yours_nft";

describe("YoursNFT", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.YoursNft as Program<YoursNft>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
