const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Reward Token
  const EtherReward = await ethers.getContractFactory("EtherReward");
  const rewardToken = await EtherReward.deploy();
  await rewardToken.deployed();
  console.log("EtherReward deployed to:", rewardToken.address);

  // Deploy Pet NFT
  const EtherPetNFT = await ethers.getContractFactory("EtherPetNFT");
  const petNFT = await EtherPetNFT.deploy();
  await petNFT.deployed();
  console.log("EtherPetNFT deployed to:", petNFT.address);

  // Deploy Item Contract
  const EtherItem = await ethers.getContractFactory("EtherItem");
  const itemContract = await EtherItem.deploy();
  await itemContract.deployed();
  console.log("EtherItem deployed to:", itemContract.address);

  // Deploy Game Logic
  const EtherGameLogic = await ethers.getContractFactory("EtherGameLogic");
  const gameLogic = await EtherGameLogic.deploy(petNFT.address, itemContract.address);
  await gameLogic.deployed();
  console.log("EtherGameLogic deployed to:", gameLogic.address);

  // Deploy Meditation System
  const EtherMeditation = await ethers.getContractFactory("EtherMeditation");
  const meditation = await EtherMeditation.deploy(petNFT.address, rewardToken.address);
  await meditation.deployed();
  console.log("EtherMeditation deployed to:", meditation.address);

  // Deploy Aura System
  const EtherAura = await ethers.getContractFactory("EtherAura");
  const auraSystem = await EtherAura.deploy(petNFT.address);
  await auraSystem.deployed();
  console.log("EtherAura deployed to:", auraSystem.address);

  // Deploy Marketplace
  const EtherMarketplace = await ethers.getContractFactory("EtherMarketplace");
  const marketplace = await EtherMarketplace.deploy(petNFT.address, itemContract.address);
  await marketplace.deployed();
  console.log("EtherMarketplace deployed to:", marketplace.address);

  // Setup permissions
  await rewardToken.addMinter(meditation.address);
  await rewardToken.addMinter(gameLogic.address);
  console.log("Minter roles configured");

  // Create initial items
  await itemContract.createItem(
    "Calming Treat",
    0, // FOOD
    10, // effectValue
    ethers.utils.parseEther("0.001"),
    "https://api.etherpets.com/items/1.json"
  );

  await itemContract.createItem(
    "Energy Potion",
    1, // POTION
    20, // effectValue
    ethers.utils.parseEther("0.002"),
    "https://api.etherpets.com/items/2.json"
  );

  await itemContract.createItem(
    "Joyful Toy",
    2, // TOY
    15, // effectValue
    ethers.utils.parseEther("0.0015"),
    "https://api.etherpets.com/items/3.json"
  );

  console.log("Initial items created");

  // Save deployment info
  const deploymentInfo = {
    rewardToken: rewardToken.address,
    petNFT: petNFT.address,
    itemContract: itemContract.address,
    gameLogic: gameLogic.address,
    meditation: meditation.address,
    auraSystem: auraSystem.address,
    marketplace: marketplace.address,
    network: await ethers.provider.getNetwork()
  };

  console.log("Deployment completed:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });