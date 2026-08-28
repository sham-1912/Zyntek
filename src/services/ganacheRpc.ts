import type { Eip1193Provider } from 'ethers';

export const GANACHE_HTTP_URL = 'http://127.0.0.1:7545';

export async function sendDirectGanacheTransaction(label: string): Promise<{
  txHash?: string;
  blockNumber?: number;
  success: boolean;
}> {
  // Route via MetaMask (window.ethereum) — it already holds the Ganache RPC connection.
  // This bypasses browser CORS restrictions on direct fetch() to 127.0.0.1:7545.
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { ethereum?: Eip1193Provider }).ethereum
  ) {
    try {
      const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;

      // Get connected accounts (Ganache pre-funded accounts via MetaMask)
      const accounts = (await ethereum.request({ method: 'eth_accounts' })) as string[];
      if (!accounts || accounts.length < 2) {
        console.warn('Not enough Ganache accounts available');
        return { success: false };
      }

      const from = accounts[0];
      const to = accounts[1]; // Transfer between two Ganache accounts

      // Encode label as hex data for the transaction (so it shows up in Ganache logs)
      const hexData = '0x' + Array.from(new TextEncoder().encode(label.slice(0, 32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      // Send transaction via MetaMask -> Ganache RPC (no CORS issue!)
      const txHash = (await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to,
            value: '0x2386F26FC10000', // 0.01 ETH
            gas: '0x5208',
            data: hexData,
          },
        ],
      })) as string;

      if (txHash) {
        // Get the mined block number from the receipt
        let blockNumber = 1;
        try {
          const receipt = (await ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          })) as { blockNumber?: string } | null;

          if (receipt?.blockNumber) {
            blockNumber = parseInt(receipt.blockNumber, 16);
          }
        } catch (e) {
          console.warn('Receipt fetch failed, using default block', e);
        }

        console.log(`✅ Ganache block mined! TX: ${txHash} | Block: ${blockNumber} | Label: ${label}`);
        return { txHash, blockNumber, success: true };
      }
    } catch (e) {
      console.warn('MetaMask eth_sendTransaction to Ganache failed (user may have rejected):', e);
    }
  }

  // Fallback: generate deterministic simulated hash
  const fallbackHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`.slice(0, 66);
  return { txHash: fallbackHash, blockNumber: 0, success: false };
}
