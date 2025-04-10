import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers } from 'ethers';

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];
const TOKEN_ADDRESS = "0x9cD80ad4fD280c00A01d98c599e0bde602e1E78A";
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');

  async function burn() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, signer);
    const tx = await token.transfer(DEAD_ADDRESS, ethers.parseUnits(amount, 18));
    await tx.wait();
    setTxHash(tx.hash);
  }

  return (
    <main>
      <h1>Burn Token - Tea Sepolia</h1>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected as {address}</p>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount to burn" />
          <button onClick={burn}>Burn</button>
          {txHash && <p>TX: <a href={`https://sepolia.tea.xyz/tx/${txHash}`} target="_blank">{txHash}</a></p>}
        </>
      )}
    </main>
  );
}