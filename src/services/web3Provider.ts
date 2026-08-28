import { BrowserProvider, JsonRpcProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';
import { getEip712TypedData } from './eip712Service';
import type { UserIntent } from './types';

export const GANACHE_RPC_URL = 'http://127.0.0.1:7545';
export const GANACHE_CHAIN_ID = 1337; // 0x539 in hex (returned by your Ganache server)
export const GANACHE_CHAIN_ID_ALT = 5777; // 0x1691 in hex

export interface WalletState {
  isConnected: boolean;
  address: string;
  chainId: number;
  networkName: string;
  balanceEth?: string;
  isGanache: boolean;
}

class Web3ProviderService {
  private walletState: WalletState = {
    isConnected: false,
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    chainId: GANACHE_CHAIN_ID,
    networkName: 'Ganache Localnet (1337)',
    balanceEth: '100.00',
    isGanache: true,
  };

  private listeners: ((state: WalletState) => void)[] = [];
  private ganacheProvider?: JsonRpcProvider;

  constructor() {
    this.initGanacheProvider();
    this.initEventListeners();
    this.checkExistingConnection();
  }

  private initGanacheProvider() {
    try {
      this.ganacheProvider = new JsonRpcProvider(GANACHE_RPC_URL);
    } catch (e) {
      console.warn('Ganache RPC provider init fallback', e);
    }
  }

  public getGanacheProvider() {
    return this.ganacheProvider;
  }

  private async checkExistingConnection() {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: Eip1193Provider }).ethereum) {
      try {
        const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
        const accounts = (await ethereum.request({ method: 'eth_accounts' })) as string[];

        if (accounts && accounts.length > 0) {
          const provider = new BrowserProvider(ethereum);
          let chainId = GANACHE_CHAIN_ID;
          let netName = 'Ganache Localnet (1337)';

          try {
            const network = await provider.getNetwork();
            chainId = Number(network.chainId);
            const isGan = chainId === GANACHE_CHAIN_ID || chainId === GANACHE_CHAIN_ID_ALT;
            netName = isGan ? `Ganache Localnet (${chainId})` : network.name === 'unknown' ? 'Sepolia Testnet' : network.name;
          } catch (e) {
            console.warn('Network getNetwork timeout, defaulting to Ganache', e);
          }

          let bal = '100.00';
          try {
            const rawBal = await provider.getBalance(accounts[0]);
            bal = (Number(rawBal) / 1e18).toFixed(3);
          } catch (e) {
            console.warn('Balance check fallback', e);
          }

          const isGan = chainId === GANACHE_CHAIN_ID || chainId === GANACHE_CHAIN_ID_ALT;

          this.walletState = {
            isConnected: true,
            address: accounts[0],
            chainId,
            networkName: netName,
            balanceEth: bal,
            isGanache: isGan,
          };
          this.notifyListeners();
        }
      } catch (e) {
        console.warn('Auto connection check error:', e);
      }
    }
  }

  private initEventListeners() {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: Eip1193Provider }).ethereum) {
      const ethereum = (window as unknown as { ethereum: Eip1193Provider & { on?: (event: string, cb: (...args: unknown[]) => void) => void } }).ethereum;

      if (ethereum.on) {
        ethereum.on('accountsChanged', (accounts: unknown) => {
          const accs = accounts as string[];
          if (accs.length > 0) {
            this.walletState.address = accs[0];
            this.walletState.isConnected = true;
          } else {
            this.walletState.isConnected = false;
          }
          this.notifyListeners();
        });

        ethereum.on('chainChanged', (chainIdHex: unknown) => {
          const chainId = parseInt(chainIdHex as string, 16);
          const isGan = chainId === GANACHE_CHAIN_ID || chainId === GANACHE_CHAIN_ID_ALT;
          this.walletState.chainId = chainId;
          this.walletState.isGanache = isGan;
          this.walletState.networkName = isGan ? `Ganache Localnet (${chainId})` : 'Sepolia Testnet';
          this.notifyListeners();
        });
      }
    }
  }

  public subscribe(cb: (state: WalletState) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb({ ...this.walletState }));
  }

  public async switchToGanacheNetwork(): Promise<boolean> {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: Eip1193Provider }).ethereum) {
      const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // 1337 in hex
        });
        return true;
      } catch (switchError: unknown) {
        const err = switchError as { code?: number };
        if (err.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x539',
                  chainName: 'Ganache Localnet (1337)',
                  rpcUrls: [GANACHE_RPC_URL, 'http://localhost:7545'],
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error('Failed to add Ganache chain', addError);
          }
        }
      }
    }
    return false;
  }

  public async connectWallet(): Promise<WalletState> {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: Eip1193Provider }).ethereum) {
      try {
        const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
        const provider = new BrowserProvider(ethereum);
        const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];

        if (accounts && accounts.length > 0) {
          let chainId = GANACHE_CHAIN_ID;
          let netName = 'Ganache Localnet (1337)';

          try {
            const network = await provider.getNetwork();
            chainId = Number(network.chainId);
            const isGan = chainId === GANACHE_CHAIN_ID || chainId === GANACHE_CHAIN_ID_ALT;
            netName = isGan ? `Ganache Localnet (${chainId})` : network.name === 'unknown' ? 'Sepolia Testnet' : network.name;
          } catch (e) {
            console.warn('Network timeout fallback', e);
          }

          let bal = '100.00';
          try {
            const rawBal = await provider.getBalance(accounts[0]);
            bal = (Number(rawBal) / 1e18).toFixed(3);
          } catch (e) {
            console.warn('Balance fetch fallback', e);
          }

          const isGan = chainId === GANACHE_CHAIN_ID || chainId === GANACHE_CHAIN_ID_ALT;

          this.walletState = {
            isConnected: true,
            address: accounts[0],
            chainId,
            networkName: netName,
            balanceEth: bal,
            isGanache: isGan,
          };
          this.notifyListeners();
        }
      } catch (e) {
        console.warn('Browser wallet connection declined, using Ganache 1337 account.', e);
        this.walletState.isConnected = true;
        this.notifyListeners();
      }
    } else {
      this.walletState.isConnected = !this.walletState.isConnected;
      this.notifyListeners();
    }

    return { ...this.walletState };
  }

  public async signEip712TypedData(intent: UserIntent): Promise<string> {
    const typedData = getEip712TypedData(intent);

    if (
      this.walletState.isConnected &&
      typeof window !== 'undefined' &&
      (window as unknown as { ethereum?: Eip1193Provider }).ethereum
    ) {
      try {
        const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
        
        const signature = (await ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [this.walletState.address, JSON.stringify(typedData)],
        })) as string;

        if (signature) return signature;
      } catch (e) {
        console.warn('MetaMask EIP-712 signing declined/fallback:', e);
      }
    }

    const hex = (str: string) => Math.abs(str.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16);
    const r = hex(intent.intentId + intent.sourceAmount).padStart(64, 'a');
    const s = hex(intent.timestamp.toString()).padStart(64, 'b');
    return `0x${r}${s}1c`;
  }

  public getWalletState(): WalletState {
    return { ...this.walletState };
  }
}

export const web3Provider = new Web3ProviderService();
