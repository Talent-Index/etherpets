const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy Reward Token
  console.log("\n1. Deploying EtherReward...");
  const EtherReward = await ethers.getContractFactory("EtherReward");
  const rewardToken = await EtherReward.deploy();
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log("✅ EtherReward deployed to:", rewardTokenAddress);

  // Deploy Pet NFT
  console.log("\n2. Deploying EtherPetNFT...");
  const EtherPetNFT = await ethers.getContractFactory("EtherPetNFT");
  const petNFT = await EtherPetNFT.deploy();
  await petNFT.waitForDeployment();
  const petNFTAddress = await petNFT.getAddress();
  console.log("✅ EtherPetNFT deployed to:", petNFTAddress);

  // Deploy Item Contract
  console.log("\n3. Deploying EtherItem...");
  const EtherItem = await ethers.getContractFactory("EtherItem");
  const itemContract = await EtherItem.deploy();
  await itemContract.waitForDeployment();
  const itemContractAddress = await itemContract.getAddress();
  console.log("✅ EtherItem deployed to:", itemContractAddress);

  // Deploy Game Logic
  console.log("\n4. Deploying EtherGameLogic...");
  const EtherGameLogic = await ethers.getContractFactory("EtherGameLogic");
  const gameLogic = await EtherGameLogic.deploy(petNFTAddress, itemContractAddress, rewardTokenAddress);
  await gameLogic.waitForDeployment();
  const gameLogicAddress = await gameLogic.getAddress();
  console.log("✅ EtherGameLogic deployed to:", gameLogicAddress);

  // Deploy Meditation System
  console.log("\n5. Deploying EtherMeditation...");
  const EtherMeditation = await ethers.getContractFactory("EtherMeditation");
  const meditation = await EtherMeditation.deploy(petNFTAddress, rewardTokenAddress);
  await meditation.waitForDeployment();
  const meditationAddress = await meditation.getAddress();
  console.log("✅ EtherMeditation deployed to:", meditationAddress);

  // Deploy Aura System
  console.log("\n6. Deploying EtherAura...");
  const EtherAura = await ethers.getContractFactory("EtherAura");
  const auraSystem = await EtherAura.deploy(petNFTAddress);
  await auraSystem.waitForDeployment();
  const auraSystemAddress = await auraSystem.getAddress();
  console.log("✅ EtherAura deployed to:", auraSystemAddress);

  // Deploy Marketplace
  console.log("\n7. Deploying EtherMarketplace...");
  const EtherMarketplace = await ethers.getContractFactory("EtherMarketplace");
  const marketplace = await EtherMarketplace.deploy(petNFTAddress, itemContractAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ EtherMarketplace deployed to:", marketplaceAddress);

  // Setup permissions
  console.log("\n8. Configuring permissions...");
  await rewardToken.addMinter(meditationAddress);
  await rewardToken.addMinter(gameLogicAddress);
  console.log("✅ Minter roles configured");

  // Create initial items
  console.log("\n9. Creating initial items...");
  await itemContract.createItem(
    "Calming Treat",
    0, // FOOD
    10, // effectValue
    ethers.parseEther("0.001"),
    "https://api.etherpets.com/items/1.json"
  );

  await itemContract.createItem(
    "Energy Potion",
    1, // POTION
    20, // effectValue
    ethers.parseEther("0.002"),
    "https://api.etherpets.com/items/2.json"
  );

  await itemContract.createItem(
    "Joyful Toy",
    2, // TOY
    15, // effectValue
    ethers.parseEther("0.0015"),
    "https://api.etherpets.com/items/3.json"
  );

  console.log("✅ Initial items created");

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: {
      rewardToken: rewardTokenAddress,
      petNFT: petNFTAddress,
      itemContract: itemContractAddress,
      gameLogic: gameLogicAddress,
      meditation: meditationAddress,
      auraSystem: auraSystemAddress,
      marketplace: marketplaceAddress
    }
  };

  console.log("\n=== DEPLOYMENT COMPLETED ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📝 Save these addresses to your .env file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });