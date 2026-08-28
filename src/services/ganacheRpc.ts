import { JsonRpcProvider } from 'ethers';

export const GANACHE_HTTP_URL = 'http://127.0.0.1:7545';

// Shared provider instance
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

    // Get Ganache pre-funded accounts (unlocked by default)
    const accounts = (await provider.send('eth_accounts', [])) as string[];

    if (!accounts || accounts.length === 0) {
      console.warn('[Ganache] No accounts returned');
      return { success: false };
    }

    const from = accounts[0];
    const to = accounts[1] ?? accounts[0];

    // Get the unlocked signer for the Ganache account (no MetaMask popup!)
    const signer = await provider.getSigner(from);

    // Send real transaction — Ganache auto-mines a block immediately
    const tx = await signer.sendTransaction({
      to,
      value: 10_000_000_000_000n, // 0.00001 ETH
      data: '0x' + Buffer.from(label.slice(0, 32)).toString('hex'),
    });

    console.log(`[Ganache] TX sent: ${tx.hash}`);
    const receipt = await tx.wait();
    const blockNumber = receipt?.blockNumber ?? 1;

    console.log(`✅ [Ganache] Block #${blockNumber} mined! TX: ${tx.hash} | ${label}`);
    return { txHash: tx.hash, blockNumber, success: true };
  } catch (e) {
    console.error('[Ganache] Transaction failed:', e);
    return {
      txHash: `0x${Math.random().toString(16).substring(2)}`.padEnd(66, '0'),
      blockNumber: 0,
      success: false,
    };
  }
}

// Test connectivity to Ganache — call this on app startup
export async function testGanacheConnection(): Promise<boolean> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    console.log(`[Ganache] Connected ✅ | Current block: ${blockNumber}`);
    return true;
  } catch (e) {
    console.warn('[Ganache] Not reachable at', GANACHE_HTTP_URL, e);
    return false;
  }
}
