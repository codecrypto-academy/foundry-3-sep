// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/Counter.sol";

contract DeployScript is Script {
    function run() external {
        // Try to get private key from environment, fallback to default for local testing
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // Tomar la clave privada de la variable de entorno DEPLOY_PRIVATE_KEY
            deployerPrivateKey = vm.envUint("DEPLOY_PRIVATE_KEY");
            console.log("Usando clave privada de la variable de entorno DEPLOY_PRIVATE_KEY");
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying MyToken...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyToken token = new MyToken(deployer);
        
        console.log("MyToken deployed at:", address(token));
        console.log("Owner:", token.owner());
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        
        vm.stopBroadcast();
    }
}
