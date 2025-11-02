// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";

contract EtherAura is Ownable {
    EtherPetNFT public petNFT;

    enum AuraType { CALM, JOYFUL, PEACEFUL, ENERGETIC, FOCUSED }

    struct Aura {
        AuraType auraType;
        uint256 intensity;
        uint256 expiration;
    }

    mapping(uint256 => Aura) public petAuras;

    event AuraActivated(uint256 indexed petId, AuraType auraType, uint256 intensity);

    constructor(address _petNFT) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
    }

    function activateAura(uint256 petId) external {
        require(petNFT.ownerOf(petId) == msg.sender, "Not pet owner");
        
        EtherPetNFT.Pet memory pet = petNFT.pets(petId);
        AuraType newAura = _calculateAuraType(pet);
        uint256 intensity = _calculateAuraIntensity(pet);
        uint256 duration = intensity * 1 hours;

        petAuras[petId] = Aura({
            auraType: newAura,
            intensity: intensity,
            expiration: block.timestamp + duration
        });

        emit AuraActivated(petId, newAura, intensity);
    }

    function _calculateAuraType(EtherPetNFT.Pet memory pet) internal pure returns (AuraType) {
        if (pet.mood >= 80 && pet.happiness >= 85) return AuraType.JOYFUL;
        if (pet.mood >= 75 && pet.energy >= 70) return AuraType.CALM;
        if (pet.happiness >= 90) return AuraType.PEACEFUL;
        if (pet.energy >= 85) return AuraType.ENERGETIC;
        if (pet.mood >= 70 && pet.happiness >= 75) return AuraType.FOCUSED;
        return AuraType.CALM; // Default
    }

    function _calculateAuraIntensity(EtherPetNFT.Pet memory pet) internal pure returns (uint256) {
        uint256 averageStat = (pet.mood + pet.energy + pet.happiness) / 3;
        if (averageStat >= 90) return 5;
        if (averageStat >= 80) return 4;
        if (averageStat >= 70) return 3;
        if (averageStat >= 60) return 2;
        return 1;
    }

    function isAuraActive(uint256 petId) external view returns (bool) {
        return petAuras[petId].expiration > block.timestamp;
    }

    function getPetAura(uint256 petId) external view returns (Aura memory) {
        if (petAuras[petId].expiration <= block.timestamp) {
            return Aura(AuraType.CALM, 0, 0);
        }
        return petAuras[petId];
    }
}