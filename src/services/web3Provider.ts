import { BrowserProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';

export interface WalletState {
  isConnected: boolean;
  address: string;
  chainId: number;
  networkName: string;
}

class Web3ProviderService {
  private walletState: WalletState = {
    isConnected: false,
    address: '0x71C8a92F1d4e08B991A54b4a1A59828453982845',
    chainId: 11155111,
    networkName: 'Ethereum Sepolia',
  };

  public async connectWallet(): Promise<WalletState> {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: unknown }).ethereum) {
      try {
        const ethereum = (window as unknown as { ethereum: Eip1193Provider }).ethereum;
        const provider = new BrowserProvider(ethereum);
        const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
        const network = await provider.getNetwork();

        if (accounts && accounts.length > 0) {
          this.walletState = {
            isConnected: true,
            address: accounts[0],
            chainId: Number(network.chainId),
            networkName: network.name === 'unknown' ? 'Sepolia Testnet' : network.name,
          };
        }
      } catch (e) {
        console.warn('Browser wallet connection declined, using Sepolia simulated account.', e);
        this.walletState.isConnected = true;
      }
    } else {
      this.walletState.isConnected = !this.walletState.isConnected;
    }

    return { ...this.walletState };
  }

  public getWalletState(): WalletState {
    return { ...this.walletState };
  }
}

export const web3Provider = new Web3ProviderService();
