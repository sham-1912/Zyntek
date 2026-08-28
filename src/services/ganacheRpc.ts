export const GANACHE_HTTP_URL = 'http://127.0.0.1:7545';

let requestId = 1;

async function rpc(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(GANACHE_HTTP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: requestId++ }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`Ganache RPC error: ${json.error.message}`);
  return json.result;
}

export async function sendDirectGanacheTransaction(label: string): Promise<{
  txHash?: string;
  blockNumber?: number;
  success: boolean;
}> {
  try {
    // Get Ganache pre-funded accounts (no CORS issue — Ganache allows all origins)
    const accounts = (await rpc('eth_accounts')) as string[];
    if (!accounts || accounts.length === 0) {
      console.warn('No Ganache pre-funded accounts found');
      return { success: false };
    }

    const from = accounts[0];
    const to = accounts[1] ?? accounts[0]; // self-transfer if only one account

    // Encode label as hex data
    const hexData =
      '0x' +
      Array.from(new TextEncoder().encode(label.slice(0, 32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    // Ganache auto-mines and auto-signs — no MetaMask popup needed!
    const txHash = (await rpc('eth_sendTransaction', [
      {
        from,
        to,
        value: '0x2386F26FC10000', // 0.01 ETH
        gas: '0x5208',
        data: hexData,
      },
    ])) as string;

    if (txHash) {
      // Get receipt to confirm block number
      let blockNumber = 1;
      try {
        const receipt = (await rpc('eth_getTransactionReceipt', [txHash])) as {
          blockNumber?: string;
        } | null;
        if (receipt?.blockNumber) {
          blockNumber = parseInt(receipt.blockNumber, 16);
        }
      } catch {
        // receipt fallback
      }

      console.log(
        `✅ Ganache block mined! TX: ${txHash} | Block: #${blockNumber} | ${label}`
      );
      return { txHash, blockNumber, success: true };
    }
  } catch (e) {
    console.warn('Direct Ganache RPC call failed:', e);
  }

  // Graceful fallback — UI still works, just no real block
  return {
    txHash: `0x${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
    blockNumber: 0,
    success: false,
  };
}
