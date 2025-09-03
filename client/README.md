# MyToken TypeScript Client

Cliente TypeScript para interactuar con el contrato MyToken ERC721 usando ethers.js.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

## 📖 Uso

### Ejecutar el ejemplo

```bash
# Ejecutar directamente con ts-node
npm start

# O compilar y ejecutar
npm run build
node dist/index.js
```

### Usar en tu propio código

```typescript
import { MyTokenClient, MyTokenConfig } from './src/MyTokenClient';

const config: MyTokenConfig = {
  contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  rpcUrl: 'http://localhost:8545',
  privateKey: 'tu_clave_privada_aqui'
};

const client = new MyTokenClient(config);

// Obtener información del contrato
await client.getContractInfo();

// Mint un token
await client.safeMint('0x...', 1);

// Verificar propietario
const owner = await client.getOwnerOf(1);
```

## 🔧 Configuración

Edita el archivo `src/index.ts` para cambiar:

- `contractAddress`: Dirección del contrato desplegado
- `rpcUrl`: URL del RPC (local, testnet, mainnet)
- `privateKey`: Tu clave privada

## 📚 API

### Funciones de Lectura

- `getName()`: Obtener nombre del token
- `getSymbol()`: Obtener símbolo del token
- `getOwner()`: Obtener propietario del contrato
- `getOwnerOf(tokenId)`: Obtener propietario de un token
- `getBalanceOf(address)`: Obtener balance de tokens
- `isPaused()`: Verificar si el contrato está pausado
- `getTotalSupply()`: Obtener suministro total

### Funciones de Escritura

- `safeMint(to, tokenId)`: Crear un nuevo token
- `pause()`: Pausar el contrato
- `unpause()`: Despausar el contrato
- `burn(tokenId)`: Quemar un token
- `transferFrom(from, to, tokenId)`: Transferir token

### Utilidades

- `getContractInfo()`: Mostrar información completa
- `listenToEvents()`: Escuchar eventos del contrato
- `tokenExists(tokenId)`: Verificar si un token existe
- `getTokenInfo(tokenId)`: Obtener información de un token
- `getWalletBalance()`: Obtener balance de ETH del wallet

## 🛡️ Seguridad

⚠️ **Nunca hardcodees claves privadas en producción**

Usa variables de entorno:

```typescript
const config: MyTokenConfig = {
  contractAddress: process.env.CONTRACT_ADDRESS!,
  rpcUrl: process.env.RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!
};
```

## 📝 Scripts Disponibles

- `npm start`: Ejecutar con ts-node
- `npm run build`: Compilar TypeScript
- `npm run dev`: Ejecutar en modo watch
- `npm run clean`: Limpiar archivos compilados
