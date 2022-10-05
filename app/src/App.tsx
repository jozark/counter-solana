import "./App.css"
import { useState } from "react"
import {
  Commitment,
  ConfirmOptions,
  Connection,
  PublicKey,
} from "@solana/web3.js"
import {
  Program,
  AnchorProvider,
  web3,
  getProvider,
  Idl,
  Wallet,
} from "@project-serum/anchor"
import idl from "./idl.json"

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react"
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"
import { Button } from "@solana/wallet-adapter-react-ui/lib/types/Button"
require("@solana/wallet-adapter-react-ui/styles.css")

const wallets = [new PhantomWalletAdapter()]
const { Keypair, SystemProgram } = web3
const baseAccount = Keypair.generate()
const opts = {
  preflightCommitment: "processed",
}
const porgramId = new PublicKey(idl.metadata.address)

function App() {
  const [value, setValue] = useState<number | null>(null)
  const wallet = useWallet()

  async function getProvider(): Promise<AnchorProvider> {
    const network = "http://127.0.0.1:8899"
    const connection = new Connection(network, "processed")
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    })
    return provider
  }

  async function createCounter(): Promise<void> {
    const provider = await getProvider()
    const program = new Program(idl as Idl, porgramId, provider)
    try {
      await program.methods
        .initialize()
        .accounts({
          counterAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          system_program: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc()
    } catch (err) {
      console.log(err)
    }
    const account = await program.account.counterAccount.fetch(
      baseAccount.publicKey
    )
    setValue(Number(account.counter))
  }

  async function increaseCounter(): Promise<void> {
    const provider = await getProvider()
    const program = new Program(idl as Idl, porgramId, provider)
    try {
      await program.methods
        .increaseCounter()
        .accounts({
          counterAccount: baseAccount.publicKey,
        })
        .rpc()

      const account = await program.account.counterAccount.fetch(
        baseAccount.publicKey
      )
      setValue(Number(account.counter))
    } catch (err) {
      console.log(err)
    }
  }

  if (!(wallet as any).connected) {
    return (
      <div className="App">
        <WalletMultiButton />
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Solana Counter</h1>
      {value === null && <button onClick={createCounter}>Create Counterrr</button>}
      {value !== null && (
        <div>
          <button onClick={increaseCounter} style={{ backgroundColor: "red" }}>
            Increase Counterrr
          </button>
          <h1 style={{ marginTop: "2rem" }}>{value}</h1>
        </div>
      )}
    </div>
  )
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider
