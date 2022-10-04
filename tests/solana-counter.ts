import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { SolanaCounter } from "../target/types/solana_counter"
import assert from "assert"

const { SystemProgram } = anchor.web3

describe("solana-counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.SolanaCounter as Program<SolanaCounter>
  let globalCounter

  it("should initialize counter!", async () => {
    const solana_counter = anchor.web3.Keypair.generate()
    await program.methods
      .initialize()
      .accounts({
        counterAccount: solana_counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([solana_counter])
      .rpc()

    const account = await program.account.counterAccount.fetch(
      solana_counter.publicKey
    )
    assert.ok(account.counter == 0)

    globalCounter = solana_counter
  })

  it("should increase the counter by 2", async () => {
    const globalCounterAccount = globalCounter
    await program.methods
      .increaseCounter()
      .accounts({
        counterAccount: globalCounterAccount.publicKey,
      })
      .rpc()
    await program.methods
      .increaseCounter()
      .accounts({
        counterAccount: globalCounterAccount.publicKey,
      })
      .rpc()

    const account = await program.account.counterAccount.fetch(
      globalCounterAccount.publicKey
    )
      
    assert.equal(account.counter, 2)
  })
})
