import { ethers } from 'ethers';

// ABI del contrato (solo las funciones que necesitamos)
export const CONTRACT_ABI = [
  // Funciones de lectura
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function owner() view returns (address)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function paused() view returns (bool)",
  "function totalSupply() view returns (uint256)",
  
  // Funciones de escritura
  "function safeMint(address to, uint256 tokenId)",
  "function pause()",
  "function unpause()",
  "function burn(uint256 tokenId)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  
  // Eventos
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Paused(address account)",
  "event Unpaused(address account)"
];

export interface MyTokenConfig {
  contractAddress: string;
  rpcUrl: string;
  privateKey: string;
}

export class MyTokenClient {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(config: MyTokenConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, this.wallet);
  }

  // Funciones de lectura
  async getName(): Promise<string> {
    return await this.contract.name();
  }

  async getSymbol(): Promise<string> {
    return await this.contract.symbol();
  }

  async getOwner(): Promise<string> {
    return await this.contract.owner();
  }

  async getOwnerOf(tokenId: number): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }

  async getBalanceOf(address: string): Promise<bigint> {
    return await this.contract.balanceOf(address);
  }

  async isPaused(): Promise<boolean> {
    return await this.contract.paused();
  }

  async getTotalSupply(): Promise<bigint> {
    return await this.contract.totalSupply();
  }

  // Funciones de escritura
  async safeMint(to: string, tokenId: number): Promise<ethers.TransactionResponse> {
    const tx = await this.contract.safeMint(to, tokenId);
    console.log(`Minting token ${tokenId} to ${to}...`);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Token ${tokenId} minted successfully!`);
    return tx;
  }

  async pause(): Promise<ethers.TransactionResponse> {
    const tx = await this.contract.pause();
    console.log('Pausing contract...');
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log('Contract paused successfully!');
    return tx;
  }

  async unpause(): Promise<ethers.TransactionResponse> {
    const tx = await this.contract.unpause();
    console.log('Unpausing contract...');
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log('Contract unpaused successfully!');
    return tx;
  }

  async burn(tokenId: number): Promise<ethers.TransactionResponse> {
    const tx = await this.contract.burn(tokenId);
    console.log(`Burning token ${tokenId}...`);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Token ${tokenId} burned successfully!`);
    return tx;
  }

  async transferFrom(from: string, to: string, tokenId: number): Promise<ethers.TransactionResponse> {
    const tx = await this.contract.transferFrom(from, to, tokenId);
    console.log(`Transferring token ${tokenId} from ${from} to ${to}...`);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Token ${tokenId} transferred successfully!`);
    return tx;
  }

  // Función para escuchar eventos
  async listenToEvents() {
    console.log('Listening to contract events...');
    
    this.contract.on('Transfer', (from, to, tokenId, event) => {
      console.log(`Transfer event: Token ${tokenId} from ${from} to ${to}`);
    });

    this.contract.on('Paused', (account, event) => {
      console.log(`Paused event: Contract paused by ${account}`);
    });

    this.contract.on('Unpaused', (account, event) => {
      console.log(`Unpaused event: Contract unpaused by ${account}`);
    });
  }

  // Función para obtener información completa del contrato
  async getContractInfo(): Promise<void> {
    console.log('\n=== CONTRACT INFORMATION ===');
    console.log(`Name: ${await this.getName()}`);
    console.log(`Symbol: ${await this.getSymbol()}`);
    console.log(`Owner: ${await this.getOwner()}`);
    console.log(`Paused: ${await this.isPaused()}`);
    console.log(`Total Supply: ${await this.getTotalSupply()}`);
    console.log('=============================\n');
  }

  // Función para verificar si un token existe
  async tokenExists(tokenId: number): Promise<boolean> {
    try {
      await this.getOwnerOf(tokenId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Función para obtener información de un token específico
  async getTokenInfo(tokenId: number): Promise<{ owner: string; exists: boolean }> {
    const exists = await this.tokenExists(tokenId);
    if (exists) {
      const owner = await this.getOwnerOf(tokenId);
      return { owner, exists };
    }
    return { owner: '0x0000000000000000000000000000000000000000', exists: false };
  }

  // Función para obtener el balance de ETH del wallet
  async getWalletBalance(): Promise<bigint> {
    return await this.provider.getBalance(this.wallet.address);
  }

  // Función para obtener la dirección del wallet
  getWalletAddress(): string {
    return this.wallet.address;
  }
}
