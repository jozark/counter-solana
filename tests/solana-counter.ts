import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaCounter } from "../target/types/solana_counter";

describe("solana-counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaCounter as Program<SolanaCounter>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
