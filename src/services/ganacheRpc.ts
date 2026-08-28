export const GANACHE_HTTP_URL = 'http://127.0.0.1:7545';

export async function sendDirectGanacheTransaction(label: string): Promise<{ txHash?: string; blockNumber?: number; success: boolean }> {
  try {
    // 1. Fetch pre-funded accounts from Ganache RPC
    const accRes = await fetch(GANACHE_HTTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_accounts',
        params: [],
        id: 1,
      }),
    });

    const accJson = await accRes.json();
    if (!accJson.result || accJson.result.length === 0) {
      console.warn('No Ganache accounts found');
      return { success: false };
    }

    const fromAccount = accJson.result[0];
    const toAccount = accJson.result[1] || accJson.result[0];

    // 2. Send transaction directly to Ganache HTTP RPC to trigger automining!
    const txRes = await fetch(GANACHE_HTTP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [
          {
            from: fromAccount,
            to: toAccount,
            value: '0x38D7EA4C68000', // 0.001 ETH in hex
            gas: '0x5208',
            data: '0x' + Buffer.from(label).toString('hex').slice(0, 64),
          },
        ],
        id: 2,
      }),
    });

    const txJson = await txRes.json();
    const txHash = txJson.result;

    if (txHash) {
      // 3. Query receipt to get mined block number
      const receiptRes = await fetch(GANACHE_HTTP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 3,
        }),
      });
      const receiptJson = await receiptRes.json();
      const blockNum = receiptJson.result ? parseInt(receiptJson.result.blockNumber, 16) : 1;

      console.log(`Ganache transaction mined! Tx: ${txHash}, Block: ${blockNum}`);
      return { txHash, blockNumber: blockNum, success: true };
    }
  } catch (e) {
    console.warn('Direct Ganache RPC transaction error:', e);
  }

  return { success: false };
}
