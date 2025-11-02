// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";

contract EtherAura is Ownable {
    EtherPetNFT public petNFT;

    // Aura types representing different emotional states
    enum AuraType {
        CALM,       // #5BC0BE - Teal
        JOYFUL,     // #FFD166 - Yellow
        PEACEFUL,   // #06D6A0 - Green
        ENERGETIC,  // #EF476F - Pink
        FOCUSED,    // #118AB2 - Blue
        LOVING,     // #FF9E6D - Orange
        MYSTERIOUS, // #9D4EDD - Purple
        HARMONIOUS // #C9A0DC - Lavender
    }

    struct Aura {
        AuraType auraType;
        uint256 intensity;
        uint256 duration;
        uint256 expiration;
        string colorHex;
    }

    // Aura effects mapping
    mapping(AuraType => string) public auraColors;
    mapping(AuraType => uint256) public auraBonuses;
    mapping(uint256 => Aura) public petAuras;
    mapping(uint256 => AuraType[]) public petAuraHistory;

    // Events
    event AuraActivated(uint256 indexed petId, AuraType auraType, uint256 intensity, uint256 duration);
    event AuraExpired(uint256 indexed petId, AuraType auraType);
    event AuraSynergy(uint256 indexed petId1, uint256 indexed petId2, AuraType combinedAura);

    constructor(address _petNFT) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
        
        // Initialize aura colors
        auraColors[AuraType.CALM] = "#5BC0BE";
        auraColors[AuraType.JOYFUL] = "#FFD166";
        auraColors[AuraType.PEACEFUL] = "#06D6A0";
        auraColors[AuraType.ENERGETIC] = "#EF476F";
        auraColors[AuraType.FOCUSED] = "#118AB2";
        auraColors[AuraType.LOVING] = "#FF9E6D";
        auraColors[AuraType.MYSTERIOUS] = "#9D4EDD";
        auraColors[AuraType.HARMONIOUS] = "#C9A0DC";

        // Initialize aura bonuses (percentage boosts)
        auraBonuses[AuraType.CALM] = 15;    // +15% mood
        auraBonuses[AuraType.JOYFUL] = 20;  // +20% happiness
        auraBonuses[AuraType.PEACEFUL] = 10; // +10% all stats
        auraBonuses[AuraType.ENERGETIC] = 25; // +25% energy
        auraBonuses[AuraType.FOCUSED] = 30;  // +30% evolution speed
        auraBonuses[AuraType.LOVING] = 15;   // +15% social interactions
        auraBonuses[AuraType.MYSTERIOUS] = 40; // +40% hidden challenge rewards
        auraBonuses[AuraType.HARMONIOUS] = 20; // +20% garden contributions
    }

    // Activate aura based on pet's emotional state
    function activateAura(uint256 petId) external {
        require(petNFT.ownerOf(petId) == msg.sender, "Not pet owner");
        
        EtherPetNFT.Pet memory pet = petNFT.getPet(petId);
        AuraType newAura = _calculateAuraType(pet);
        
        uint256 intensity = _calculateAuraIntensity(pet);
        uint256 duration = intensity * 1 hours; // 1 hour per intensity point

        petAuras[petId] = Aura({
            auraType: newAura,
            intensity: intensity,
            duration: duration,
            expiration: block.timestamp + duration,
            colorHex: auraColors[newAura]
        });

        petAuraHistory[petId].push(newAura);

        // Update pet's aura color
        petNFT.updatePetStats(
            petId,
            pet.mood,
            pet.energy,
            pet.hunger,
            pet.happiness,
            auraColors[newAura]
        );

        emit AuraActivated(petId, newAura, intensity, duration);
    }

    // Calculate aura type based on pet stats
    function _calculateAuraType(EtherPetNFT.Pet memory pet) internal pure returns (AuraType) {
        if (pet.mood >= 80 && pet.happiness >= 85) {
            return AuraType.JOYFUL;
        } else if (pet.mood >= 75 && pet.energy >= 70) {
            return AuraType.CALM;
        } else if (pet.happiness >= 90) {
            return AuraType.PEACEFUL;
        } else if (pet.energy >= 85) {
            return AuraType.ENERGETIC;
        } else if (pet.mood >= 70 && pet.happiness >= 75) {
            return AuraType.FOCUSED;
        } else if (pet.happiness >= 80) {
            return AuraType.LOVING;
        } else {
            return AuraType.MYSTERIOUS;
        }
    }

    // Calculate aura intensity
    function _calculateAuraIntensity(EtherPetNFT.Pet memory pet) internal pure returns (uint256) {
        uint256 averageStat = (pet.mood + pet.energy + pet.happiness) / 3;
        
        if (averageStat >= 90) return 5;
        if (averageStat >= 80) return 4;
        if (averageStat >= 70) return 3;
        if (averageStat >= 60) return 2;
        return 1;
    }

    // Check and apply aura synergy between two pets
    function checkSynergy(uint256 petId1, uint256 petId2) external {
        require(petNFT.ownerOf(petId1) == msg.sender || petNFT.ownerOf(petId2) == msg.sender, "Not owner of both pets");
        
        Aura memory aura1 = petAuras[petId1];
        Aura memory aura2 = petAuras[petId2];
        
        require(aura1.expiration > block.timestamp, "Aura 1 expired");
        require(aura2.expiration > block.timestamp, "Aura 2 expired");

        AuraType combinedAura = _combineAuras(aura1.auraType, aura2.auraType);
        
        // Apply synergy bonus to both pets
        _applySynergyBonus(petId1, combinedAura);
        _applySynergyBonus(petId2, combinedAura);

        emit AuraSynergy(petId1, petId2, combinedAura);
    }

    // Combine two auras to create a harmonious aura
    function _combineAuras(AuraType aura1, AuraType aura2) internal pure returns (AuraType) {
        if (
            (aura1 == AuraType.CALM && aura2 == AuraType.PEACEFUL) ||
            (aura1 == AuraType.PEACEFUL && aura2 == AuraType.CALM)
        ) {
            return AuraType.HARMONIOUS;
        }
        
        if (
            (aura1 == AuraType.JOYFUL && aura2 == AuraType.LOVING) ||
            (aura1 == AuraType.LOVING && aura2 == AuraType.JOYFUL)
        ) {
            return AuraType.HARMONIOUS;
        }
        
        return AuraType.HARMONIOUS; // Default to harmonious
    }

    // Apply synergy bonus to pet
    function _applySynergyBonus(uint256 petId, AuraType synergyAura) internal {
        EtherPetNFT.Pet memory pet = petNFT.getPet(petId);
        
        // Increase all stats by synergy bonus
        uint256 newMood = _min(pet.mood + 10, 100);
        uint256 newEnergy = _min(pet.energy + 10, 100);
        uint256 newHappiness = _min(pet.happiness + 15, 100);
        
        petNFT.updatePetStats(
            petId,
            newMood,
            newEnergy,
            pet.hunger,
            newHappiness,
            auraColors[synergyAura]
        );
    }

    // Check if aura is active
    function isAuraActive(uint256 petId) external view returns (bool) {
        return petAuras[petId].expiration > block.timestamp;
    }

    // Get current aura for pet
    function getPetAura(uint256 petId) external view returns (Aura memory) {
        return petAuras[petId];
    }

    // Get aura history for pet
    function getAuraHistory(uint256 petId) external view returns (AuraType[] memory) {
        return petAuraHistory[petId];
    }

    // Calculate aura bonus for specific activity
    function getAuraBonus(uint256 petId, string memory activityType) external view returns (uint256) {
        Aura memory aura = petAuras[petId];
        if (aura.expiration <= block.timestamp) {
            return 0;
        }

        // Apply different bonuses based on activity type
        if (keccak256(abi.encodePacked(activityType)) == keccak256(abi.encodePacked("meditation"))) {
            if (aura.auraType == AuraType.CALM || aura.auraType == AuraType.PEACEFUL) {
                return auraBonuses[aura.auraType];
            }
        } else if (keccak256(abi.encodePacked(activityType)) == keccak256(abi.encodePacked("play"))) {
            if (aura.auraType == AuraType.JOYFUL || aura.auraType == AuraType.ENERGETIC) {
                return auraBonuses[aura.auraType];
            }
        } else if (keccak256(abi.encodePacked(activityType)) == keccak256(abi.encodePacked("garden"))) {
            if (aura.auraType == AuraType.HARMONIOUS || aura.auraType == AuraType.LOVING) {
                return auraBonuses[aura.auraType];
            }
        }

        return auraBonuses[aura.auraType] / 2; // Default half bonus
    }

    // Helper function to calculate minimum
    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}