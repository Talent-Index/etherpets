// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract EtherPetNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;

    struct Pet {
        uint256 petId;
        string name;
        uint256 mood;
        uint256 energy;
        uint256 hunger;
        uint256 happiness;
        uint256 growthStage;
        uint256 lastInteraction;
        string auraColor;
        address owner;
    }

    mapping(uint256 => Pet) public pets;
    mapping(address => uint256[]) public ownerPets;
    mapping(address => bool) public hasMinted;

    event PetMinted(address indexed owner, uint256 indexed tokenId, string name);
    event PetUpdated(uint256 indexed tokenId, uint256 mood, uint256 energy, uint256 hunger, uint256 happiness);
    event PetEvolved(uint256 indexed tokenId, uint256 newGrowthStage);

    constructor() ERC721("EtherPet", "EPET") Ownable(msg.sender) {}

    function mintPet(string memory name, string memory tokenURI) external {
        require(!hasMinted[msg.sender], "Already minted a pet");
        require(bytes(name).length > 0, "Name cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        pets[tokenId] = Pet({
            petId: tokenId,
            name: name,
            mood: 50,
            energy: 70,
            hunger: 30,
            happiness: 60,
            growthStage: 1,
            lastInteraction: block.timestamp,
            auraColor: "#5BC0BE",
            owner: msg.sender
        });
        
        ownerPets[msg.sender].push(tokenId);
        hasMinted[msg.sender] = true;
        
        emit PetMinted(msg.sender, tokenId, name);
    }

    function updatePetStats(
        uint256 tokenId,
        uint256 mood,
        uint256 energy,
        uint256 hunger,
        uint256 happiness,
        string memory auraColor
    ) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner");
        require(mood <= 100 && energy <= 100 && hunger <= 100 && happiness <= 100, "Stats must be <= 100");
        
        Pet storage pet = pets[tokenId];
        pet.mood = mood;
        pet.energy = energy;
        pet.hunger = hunger;
        pet.happiness = happiness;
        pet.auraColor = auraColor;
        pet.lastInteraction = block.timestamp;

        _checkEvolution(tokenId);
        
        emit PetUpdated(tokenId, mood, energy, hunger, happiness);
    }

    function feedPet(uint256 tokenId, uint256 hungerDecrease) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner");
        
        Pet storage pet = pets[tokenId];
        if (pet.hunger >= hungerDecrease) {
            pet.hunger -= hungerDecrease;
        } else {
            pet.hunger = 0;
        }
        pet.happiness = _min(pet.happiness + 5, 100);
        pet.lastInteraction = block.timestamp;

        emit PetUpdated(tokenId, pet.mood, pet.energy, pet.hunger, pet.happiness);
    }

    function playWithPet(uint256 tokenId, uint256 energyDecrease) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner");
        
        Pet storage pet = pets[tokenId];
        if (pet.energy >= energyDecrease) {
            pet.energy -= energyDecrease;
        } else {
            pet.energy = 0;
        }
        pet.happiness = _min(pet.happiness + 10, 100);
        pet.lastInteraction = block.timestamp;

        emit PetUpdated(tokenId, pet.mood, pet.energy, pet.hunger, pet.happiness);
    }

    function restPet(uint256 tokenId, uint256 energyIncrease) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner");
        
        Pet storage pet = pets[tokenId];
        pet.energy = _min(pet.energy + energyIncrease, 100);
        pet.mood = _min(pet.mood + 5, 100);
        pet.lastInteraction = block.timestamp;

        emit PetUpdated(tokenId, pet.mood, pet.energy, pet.hunger, pet.happiness);
    }

    function _checkEvolution(uint256 tokenId) internal {
        Pet storage pet = pets[tokenId];
        uint256 currentStage = pet.growthStage;
        
        if (currentStage == 1 && pet.happiness >= 80 && pet.energy >= 70) {
            pet.growthStage = 2;
            emit PetEvolved(tokenId, 2);
        } else if (currentStage == 2 && pet.happiness >= 90 && pet.energy >= 80 && pet.mood >= 85) {
            pet.growthStage = 3;
            emit PetEvolved(tokenId, 3);
        }
    }

    function getPet(uint256 tokenId) external view returns (Pet memory) {
        return pets[tokenId];
    }

    function getOwnerPets(address owner) external view returns (uint256[] memory) {
        return ownerPets[owner];
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721URIStorage)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}