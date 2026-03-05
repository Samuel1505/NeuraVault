import { network } from "hardhat";
import { Contract } from "ethers";

interface DeploymentInfo {
  contractName: string;
  address: string;
  txHash: string;
  blockNumber: number;
}

/**
 * Deploy all BCI contracts
 * Usage: npx hardhat run scripts/deploy.ts --network <network-name>
 */
async function main() {
  console.log("Starting contract deployment...\n");

  // Debug: Check if environment variable is loaded (without exposing full key)
  if (process.env.SEPOLIA_RPC_URL) {
    const url = process.env.SEPOLIA_RPC_URL;
    // Show URL structure without exposing full API key
    const urlParts = url.split('/');
    if (urlParts.length > 0) {
      const baseUrl = urlParts.slice(0, -1).join('/');
      console.log("RPC URL detected:", baseUrl + "/...");
    }
  } else {
    console.warn("⚠ Warning: SEPOLIA_RPC_URL not found in environment variables");
  }

  // Connect to the network
  const { ethers } = await network.connect();
  
  // Test RPC connection
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("✓ Connected to network. Current block:", blockNumber);
  } catch (error: any) {
    if (error.statusCode === 401 || error.cause?.statusCode === 401) {
      console.error("\n✗ RPC Authentication Error (401 Unauthorized)");
      console.error("Your SEPOLIA_RPC_URL appears to be invalid or missing an API key.");
      console.error("\nPlease check your .env file:");
      console.error("  - Ensure SEPOLIA_RPC_URL includes your API key");
      console.error("  - Format should be: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY");
      console.error("  - Or use another RPC provider like Infura: https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
      process.exit(1);
    }
    throw error;
  }
  
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  
  // Check account balance
  try {
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString(), "wei");
    if (balance === 0n) {
      console.warn("⚠ Warning: Account balance is 0. You may not have enough funds to deploy.");
    }
    console.log();
  } catch (error: any) {
    if (error.statusCode === 401 || error.cause?.statusCode === 401) {
      console.error("\n✗ RPC Authentication Error (401 Unauthorized)");
      console.error("Your SEPOLIA_RPC_URL appears to be invalid or missing an API key.");
      process.exit(1);
    }
    throw error;
  }

  const deployments: DeploymentInfo[] = [];

  // Deploy IdentityRegistry
  console.log("Deploying IdentityRegistry...");
  const IdentityRegistryFactory = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistryFactory.deploy();
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  const identityRegistryTx = identityRegistry.deploymentTransaction();
  
  console.log("✓ IdentityRegistry deployed to:", identityRegistryAddress);
  console.log("  Transaction hash:", identityRegistryTx?.hash);
  
  deployments.push({
    contractName: "IdentityRegistry",
    address: identityRegistryAddress,
    txHash: identityRegistryTx?.hash || "",
    blockNumber: identityRegistryTx?.blockNumber || 0,
  });

  // Deploy ConsentManager
  console.log("\nDeploying ConsentManager...");
  const ConsentManagerFactory = await ethers.getContractFactory("ConsentManager");
  const consentManager = await ConsentManagerFactory.deploy();
  await consentManager.waitForDeployment();
  const consentManagerAddress = await consentManager.getAddress();
  const consentManagerTx = consentManager.deploymentTransaction();
  
  console.log("✓ ConsentManager deployed to:", consentManagerAddress);
  console.log("  Transaction hash:", consentManagerTx?.hash);
  
  deployments.push({
    contractName: "ConsentManager",
    address: consentManagerAddress,
    txHash: consentManagerTx?.hash || "",
    blockNumber: consentManagerTx?.blockNumber || 0,
  });

  // Deploy PaymentDistributor
  console.log("\nDeploying PaymentDistributor...");
  const PaymentDistributorFactory = await ethers.getContractFactory("PaymentDistributor");
  const paymentDistributor = await PaymentDistributorFactory.deploy();
  await paymentDistributor.waitForDeployment();
  const paymentDistributorAddress = await paymentDistributor.getAddress();
  const paymentDistributorTx = paymentDistributor.deploymentTransaction();
  
  console.log("✓ PaymentDistributor deployed to:", paymentDistributorAddress);
  console.log("  Transaction hash:", paymentDistributorTx?.hash);
  
  deployments.push({
    contractName: "PaymentDistributor",
    address: paymentDistributorAddress,
    txHash: paymentDistributorTx?.hash || "",
    blockNumber: paymentDistributorTx?.blockNumber || 0,
  });

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("\nNetwork:", network.name);
  console.log("Deployer:", deployer.address);
  console.log("\nDeployed Contracts:");
  deployments.forEach((deployment) => {
    console.log(`  ${deployment.contractName}:`);
    console.log(`    Address: ${deployment.address}`);
    console.log(`    TX Hash: ${deployment.txHash}`);
  });
  console.log("\n" + "=".repeat(60));

  // Verify contract ownership
  console.log("\nVerifying contract ownership...");
  const identityRegistryOwner = await identityRegistry.owner();
  const consentManagerOwner = await consentManager.owner();
  const paymentDistributorOwner = await paymentDistributor.owner();
  
  console.log(`IdentityRegistry owner: ${identityRegistryOwner}`);
  console.log(`ConsentManager owner: ${consentManagerOwner}`);
  console.log(`PaymentDistributor owner: ${paymentDistributorOwner}`);
  
  if (
    identityRegistryOwner.toLowerCase() === deployer.address.toLowerCase() &&
    consentManagerOwner.toLowerCase() === deployer.address.toLowerCase() &&
    paymentDistributorOwner.toLowerCase() === deployer.address.toLowerCase()
  ) {
    console.log("✓ All contracts owned by deployer");
  } else {
    console.log("⚠ Warning: Contract ownership mismatch");
  }

  return {
    identityRegistry: identityRegistryAddress,
    consentManager: consentManagerAddress,
    paymentDistributor: paymentDistributorAddress,
  };
}

// Execute deployment
main()
  .then((addresses) => {
    console.log("\n✓ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error: any) => {
    console.error("\n✗ Deployment failed:");
    
    // Provide helpful error messages for common issues
    if (error.statusCode === 401 || error.cause?.statusCode === 401) {
      console.error("\nRPC Authentication Error (401 Unauthorized)");
      console.error("Your SEPOLIA_RPC_URL in .env is invalid or missing an API key.");
      console.error("\nFix by updating your .env file with a valid RPC URL:");
      console.error("  SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY");
      console.error("  or");
      console.error("  SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
    } else if (error.message?.includes("insufficient funds")) {
      console.error("\nInsufficient funds error:");
      console.error("Your deployer account doesn't have enough ETH to pay for gas.");
      console.error("Please fund your account:", error.from || "check your deployer address");
    } else if (error.message?.includes("nonce")) {
      console.error("\nNonce error:");
      console.error("There may be pending transactions. Wait a moment and try again.");
    } else {
      console.error(error);
    }
    
    process.exit(1);
  });
