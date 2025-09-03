# MyToken - ERC721 NFT Contract

Un contrato inteligente ERC721 completo con funcionalidades avanzadas de pausa, burn y control de acceso, construido con Foundry y OpenZeppelin.

## 📋 Características

- **ERC721 Estándar**: Implementación completa del estándar NFT ERC721
- **Pausable**: Funcionalidad de pausar/despausar transferencias
- **Burnable**: Capacidad de quemar tokens
- **Ownable**: Control de acceso con propietario único
- **Safe Minting**: Minting seguro con verificación de contratos
- **OpenZeppelin**: Construido sobre las librerías probadas de OpenZeppelin

## 🏗️ Arquitectura del Contrato

### Contrato Principal: `MyToken`

```solidity
contract MyToken is ERC721, ERC721Pausable, Ownable, ERC721Burnable
```

**Herencia:**
- `ERC721`: Estándar base para tokens no fungibles
- `ERC721Pausable`: Permite pausar transferencias
- `Ownable`: Control de acceso con propietario
- `ERC721Burnable`: Permite quemar tokens

### Funciones Principales

| Función | Descripción | Acceso |
|---------|-------------|---------|
| `safeMint(address to, uint256 tokenId)` | Crear un nuevo token | Solo Owner |
| `pause()` | Pausar todas las transferencias | Solo Owner |
| `unpause()` | Reanudar transferencias | Solo Owner |
| `burn(uint256 tokenId)` | Quemar un token | Propietario del token |

## 🚀 Instalación y Configuración

### Prerrequisitos

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Git](https://git-scm.com/)

### Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd test-foundry
```

2. **Instalar dependencias:**
```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

3. **Compilar el contrato:**
```bash
forge build
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
forge test

# Ejecutar tests con gas report
forge test --gas-report

# Ejecutar tests con coverage
forge coverage
```

### Cobertura de Tests

El proyecto incluye **13 tests** que cubren:

- ✅ **Tests Básicos**: Constructor, mint, burn
- ✅ **Tests de Pausa**: Pausar/despausar y transferencias bloqueadas
- ✅ **Tests de Permisos**: Solo owner puede pausar/mint
- ✅ **Fuzz Tests**: Validación con inputs aleatorios
- ✅ **Tests de Integración**: Flujos completos de trabajo

## 📦 Despliegue

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
PRIVATE_KEY=tu_clave_privada_aqui
RPC_URL=https://sepolia.infura.io/v3/tu_api_key
ETHERSCAN_API_KEY=tu_etherscan_api_key
```

### 2. Crear Script de Despliegue

Crea el archivo `script/Deploy.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/Counter.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyToken token = new MyToken(deployer);
        
        console.log("MyToken deployed at:", address(token));
        console.log("Owner:", token.owner());
        
        vm.stopBroadcast();
    }
}
```

### 3. Desplegar en Redes

#### Red Local (Anvil)
```bash
# Terminal 1: Iniciar red local
anvil

# Terminal 2: Desplegar (el script usa automáticamente la clave por defecto)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# O especificar la clave privada explícitamente
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

**Resultado esperado:**
```
✅ MyToken deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✅ Token name: MyToken
✅ Token symbol: MTK
```

#### Sepolia Testnet
```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

#### Mainnet
```bash
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 4. Verificar Contrato

```bash
# Verificar en Etherscan
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/Counter.sol:MyToken \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --chain sepolia
```

## 🔧 Uso del Contrato

### Después del Despliegue

#### Usando Cast (CLI)

```bash
# Verificar información del contrato
cast call <CONTRACT_ADDRESS> "name()" --rpc-url <RPC_URL>
cast call <CONTRACT_ADDRESS> "symbol()" --rpc-url <RPC_URL>
cast call <CONTRACT_ADDRESS> "owner()" --rpc-url <RPC_URL>

# Mint un token (solo owner)
cast send <CONTRACT_ADDRESS> "safeMint(address,uint256)" <USER_ADDRESS> 1 --private-key <OWNER_PRIVATE_KEY> --rpc-url <RPC_URL>

# Verificar el propietario de un token
cast call <CONTRACT_ADDRESS> "ownerOf(uint256)" 1 --rpc-url <RPC_URL>

# Pausar el contrato (solo owner)
cast send <CONTRACT_ADDRESS> "pause()" --private-key <OWNER_PRIVATE_KEY> --rpc-url <RPC_URL>

# Verificar si está pausado
cast call <CONTRACT_ADDRESS> "paused()" --rpc-url <RPC_URL>
```

#### Usando Solidity

```solidity
// Solo el owner puede hacer mint
token.safeMint(userAddress, tokenId);

// Solo el owner puede pausar
token.pause();

// El propietario del token puede transferir
token.transferFrom(from, to, tokenId);

// El propietario del token puede quemar
token.burn(tokenId);
```

#### Ejemplo de Interacción Completa

```bash
# 1. Mint un token
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "safeMint(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

# 2. Verificar el propietario
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "ownerOf(uint256)" 1 --rpc-url http://localhost:8545

# 3. Verificar balance
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "balanceOf(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --rpc-url http://localhost:8545
```

#### Usando TypeScript/JavaScript (ethers.js)

**Instalación de dependencias:**
```bash
npm install ethers
npm install -D @types/node typescript ts-node
```

**Código TypeScript completo:**

```typescript
import { ethers } from 'ethers';

// Configuración del contrato
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Dirección del contrato desplegado
const RPC_URL = 'http://localhost:8545'; // URL del RPC
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Clave privada del owner

// ABI del contrato (solo las funciones que necesitamos)
const CONTRACT_ABI = [
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

class MyTokenClient {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(contractAddress: string, rpcUrl: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
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
}

// Función principal de ejemplo
async function main() {
  try {
    // Crear instancia del cliente
    const tokenClient = new MyTokenClient(CONTRACT_ADDRESS, RPC_URL, PRIVATE_KEY);
    
    // Obtener información del contrato
    await tokenClient.getContractInfo();
    
    // Escuchar eventos
    await tokenClient.listenToEvents();
    
    // Ejemplo de uso: Mint un token
    const userAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    const tokenId = 1;
    
    // Verificar si el token ya existe
    try {
      const owner = await tokenClient.getOwnerOf(tokenId);
      console.log(`Token ${tokenId} already exists, owner: ${owner}`);
    } catch (error) {
      // Token no existe, podemos hacer mint
      await tokenClient.safeMint(userAddress, tokenId);
    }
    
    // Verificar el propietario del token
    const owner = await tokenClient.getOwnerOf(tokenId);
    console.log(`Token ${tokenId} owner: ${owner}`);
    
    // Verificar balance del usuario
    const balance = await tokenClient.getBalanceOf(userAddress);
    console.log(`User ${userAddress} balance: ${balance}`);
    
    // Ejemplo: Pausar el contrato
    // await tokenClient.pause();
    
    // Ejemplo: Despausar el contrato
    // await tokenClient.unpause();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

export { MyTokenClient };
```

**Archivo package.json:**
```json
{
  "name": "mytoken-client",
  "version": "1.0.0",
  "description": "TypeScript client for MyToken ERC721 contract",
  "main": "index.js",
  "scripts": {
    "start": "ts-node index.ts",
    "build": "tsc",
    "dev": "ts-node --watch index.ts"
  },
  "dependencies": {
    "ethers": "^6.8.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

**Uso del cliente:**
```bash
# Instalar dependencias
npm install

# Ejecutar el script
npm start

# O compilar y ejecutar
npm run build
node dist/index.js
```

## 📊 Gas Usage

| Función | Gas Cost |
|---------|----------|
| Constructor | ~22,319 |
| safeMint | ~62,376 |
| pause | ~12,978 |
| unpause | ~12,490 |
| burn | ~52,433 |
| transferFrom | ~45,000 |

## 🛡️ Seguridad

- ✅ **OpenZeppelin**: Usa librerías auditadas y probadas
- ✅ **Access Control**: Solo el owner puede pausar/mint
- ✅ **Pausable**: Protección contra emergencias
- ✅ **Safe Minting**: Verificación de contratos en minting
- ✅ **Comprehensive Testing**: 13 tests con fuzz testing

## 📚 Documentación Adicional

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
