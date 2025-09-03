import { MyTokenClient, MyTokenConfig } from './MyTokenClient';

// Configuración del contrato
const config: MyTokenConfig = {
  contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Dirección del contrato desplegado
  rpcUrl: 'http://localhost:8545', // URL del RPC
  privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // Clave privada del owner
};

// Función principal de ejemplo
async function main() {
  try {
    console.log('🚀 Starting MyToken Client...\n');
    
    // Crear instancia del cliente
    const tokenClient = new MyTokenClient(config);
    
    // Mostrar información del wallet
    console.log(`Wallet Address: ${tokenClient.getWalletAddress()}`);
    console.log(`Wallet Balance: ${ethers.formatEther(await tokenClient.getWalletBalance())} ETH\n`);
    
    // Obtener información del contrato
    await tokenClient.getContractInfo();
    
    // Escuchar eventos
    await tokenClient.listenToEvents();
    
    // Ejemplo de uso: Mint un token
    const userAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    const tokenId = 1;
    
    console.log(`\n🔍 Checking if token ${tokenId} exists...`);
    const tokenInfo = await tokenClient.getTokenInfo(tokenId);
    
    if (tokenInfo.exists) {
      console.log(`✅ Token ${tokenId} already exists, owner: ${tokenInfo.owner}`);
    } else {
      console.log(`❌ Token ${tokenId} does not exist, minting...`);
      await tokenClient.safeMint(userAddress, tokenId);
    }
    
    // Verificar el propietario del token
    const owner = await tokenClient.getOwnerOf(tokenId);
    console.log(`👤 Token ${tokenId} owner: ${owner}`);
    
    // Verificar balance del usuario
    const balance = await tokenClient.getBalanceOf(userAddress);
    console.log(`💰 User ${userAddress} balance: ${balance} tokens`);
    
    // Ejemplo: Pausar el contrato (descomenta para usar)
    // console.log('\n⏸️  Pausing contract...');
    // await tokenClient.pause();
    
    // Ejemplo: Despausar el contrato (descomenta para usar)
    // console.log('\n▶️  Unpausing contract...');
    // await tokenClient.unpause();
    
    console.log('\n✅ MyToken Client example completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

export { MyTokenClient, MyTokenConfig };
