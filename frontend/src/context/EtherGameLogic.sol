// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";
import "./EtherItem.sol";

contract EtherGameLogic is Ownable {
    EtherPetNFT public petNFT;
    EtherItem public itemContract;

    event ItemUsed(address indexed user, uint256 indexed petId, uint256 indexed itemId, uint256 amount);

    constructor(address _petNFT, address _itemContract) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
        itemContract = EtherItem(_itemContract);
    }

    function useItem(uint256 petId, uint256 itemId, uint256 amount) external {
        require(petNFT.ownerOf(petId) == msg.sender, "Not pet owner");
        require(itemContract.balanceOf(msg.sender, itemId) >= amount, "Insufficient items");

        EtherItem.ItemInfo memory item = itemContract.items(itemId);
        EtherPetNFT.Pet memory pet = petNFT.pets(petId);

        // Burn the used item
        itemContract.safeTransferFrom(msg.sender, address(this), itemId, amount, "");
        // Ideally burn from address(this) if items are meant to be consumed permanently

        uint256 newMood = pet.mood;
        uint256 newEnergy = pet.energy;
        uint256 newHunger = pet.hunger;
        uint256 newHappiness = pet.happiness;

        if (item.itemType == EtherItem.ItemType.FOOD) {
            newHunger = pet.hunger > item.effectValue ? pet.hunger - item.effectValue : 0;
            newHappiness = _min(pet.happiness + 5, 100);
        } else if (item.itemType == EtherItem.ItemType.POTION) {
            newEnergy = _min(pet.energy + item.effectValue, 100);
        } else if (item.itemType == EtherItem.ItemType.TOY) {
            newHappiness = _min(pet.happiness + item.effectValue, 100);
            newEnergy = pet.energy > 5 ? pet.energy - 5 : 0;
        }

        petNFT.updatePetStats(
            petId,
            newMood,
            newEnergy,
            newHunger,
            newHappiness,
            pet.auraColor
        );

        emit ItemUsed(msg.sender, petId, itemId, amount);
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}