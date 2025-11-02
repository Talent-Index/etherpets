// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EtherPetNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;

    // Pet structure to store pet attributes
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
    }

    // Mapping from token ID to Pet
    mapping(uint256 => Pet) public pets;
    
    // Mapping from owner to their pet tokens
    mapping(address => uint256[]) public ownerPets;
    
    // Mapping to track if address has already minted a pet
    mapping(address => bool) public hasMinted;

    // Events
    event PetMinted(address indexed owner, uint256 indexed tokenId, string name);
    event PetUpdated(uint256 indexed tokenId, uint256 mood, uint256 energy, uint256 hunger, uint256 happiness);
    event PetEvolved(uint256 indexed tokenId, uint256 newGrowthStage);

    constructor() ERC721("EtherPet", "EPET") Ownable(msg.sender) {}

    // Mint a new pet NFT (one per wallet)
    function mintPet(string memory name, string memory tokenURI) external {
        require(!hasMinted[msg.sender], "Already minted a pet");
        require(bytes(name).length > 0, "Name cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Initialize pet with default values
        pets[tokenId] = Pet({
            petId: tokenId,
            name: name,
            mood: 50, // Neutral mood
            energy: 70,
            hunger: 30,
            happiness: 60,
            growthStage: 1,
            lastInteraction: block.timestamp,
            auraColor: "#5BC0BE"
        });
        
        ownerPets[msg.sender].push(tokenId);
        hasMinted[msg.sender] = true;
        
        emit PetMinted(msg.sender, tokenId, name);
    }

    // Update pet stats (only owner)
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

    // Check if pet can evolve
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

    // Get pet details
    function getPet(uint256 tokenId) external view returns (Pet memory) {
        return pets[tokenId];
    }

    // Get all pets owned by an address
    function getOwnerPets(address owner) external view returns (uint256[] memory) {
        return ownerPets[owner];
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}