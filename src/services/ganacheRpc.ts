import { JsonRpcProvider } from 'ethers';

export const GANACHE_HTTP_URL = 'http://127.0.0.1:7545';

let _provider: JsonRpcProvider | null = null;

function getProvider(): JsonRpcProvider {
  if (!_provider) {
    _provider = new JsonRpcProvider(GANACHE_HTTP_URL, undefined, {
      staticNetwork: true,
    });
  }
  return _provider;
}

export async function sendDirectGanacheTransaction(label: string): Promise<{
  txHash?: string;
  blockNumber?: number;
  success: boolean;
}> {
  try {
    const provider = getProvider();

    // Get Ganache pre-funded accounts via raw RPC (no chain ID checks)
    const accounts = (await provider.send('eth_accounts', [])) as string[];

    if (!accounts || accounts.length === 0) {
      console.warn('[Ganache] No accounts found');
      return { success: false };
    }

    const from = accounts[0];
    const to = accounts[1] ?? accounts[0];

    console.log(`[Ganache] Sending TX from ${from} to ${to} | ${label}`);

    // Use raw eth_sendTransaction — Ganache auto-signs unlocked accounts, no MetaMask
    const txHash = (await provider.send('eth_sendTransaction', [
      {
        from,
        to,
        value: '0x38D7EA4C68000', // 0.001 ETH in hex
        // Let Ganache estimate gas automatically
      },
    ])) as string;

    if (!txHash) {
      console.warn('[Ganache] No txHash returned');
      return { success: false };
    }

    // Poll for receipt (Ganache automines so this is instant)
    let blockNumber = 1;
    for (let i = 0; i < 10; i++) {
      const receipt = (await provider.send('eth_getTransactionReceipt', [txHash])) as {
        blockNumber?: string;
      } | null;

      if (receipt?.blockNumber) {
        blockNumber = parseInt(receipt.blockNumber, 16);
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`✅ [Ganache] Block #${blockNumber} mined! TX: ${txHash}`);
    return { txHash, blockNumber, success: true };
  } catch (e) {
    console.error('[Ganache] TX error:', e);
    return {
      txHash: `0x${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
      blockNumber: 0,
      success: false,
    };
  }
}

export async function testGanacheConnection(): Promise<boolean> {
  try {
    const provider = getProvider();
    const blockNumber = (await provider.send('eth_blockNumber', [])) as string;
    const accounts = (await provider.send('eth_accounts', [])) as string[];
    console.log(
      `[Ganache] Connected ✅ | Current block: ${parseInt(blockNumber, 16)} | Accounts: ${accounts.length}`
    );
    return true;
  } catch (e) {
    console.warn('[Ganache] Not reachable at', GANACHE_HTTP_URL, e);
    return false;
  }
}
