// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EtherItem is ERC1155, Ownable {
    using Strings for uint256;

    enum ItemType { FOOD, POTION, TOY, GIFT, ENERGY_BOOST }

    struct ItemInfo {
        uint256 itemId;
        string name;
        ItemType itemType;
        uint256 effectValue;
        uint256 price;
        string uri;
    }

    mapping(uint256 => ItemInfo) public items;
    uint256 public itemCount;

    event ItemCreated(uint256 indexed itemId, string name, ItemType itemType, uint256 price);
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 amount);
    event ItemUsed(address indexed user, uint256 indexed petId, uint256 itemId, uint256 amount);

    constructor() ERC1155("https://api.etherpets.com/api/item/{id}.json") Ownable(msg.sender) {}

    function createItem(
        string memory name,
        ItemType itemType,
        uint256 effectValue,
        uint256 price,
        string memory uri
    ) external onlyOwner returns (uint256) {
        itemCount++;
        items[itemCount] = ItemInfo({
            itemId: itemCount,
            name: name,
            itemType: itemType,
            effectValue: effectValue,
            price: price,
            uri: uri
        });

        emit ItemCreated(itemCount, name, itemType, price);
        return itemCount;
    }

    function purchaseItem(uint256 itemId, uint256 amount) external payable {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        ItemInfo memory item = items[itemId];
        require(msg.value >= item.price * amount, "Insufficient payment");

        _mint(msg.sender, itemId, amount, "");
        emit ItemPurchased(msg.sender, itemId, amount);
    }

    function useItem(uint256 petId, uint256 itemId, uint256 amount) external {
        require(balanceOf(msg.sender, itemId) >= amount, "Insufficient items");
        
        _burn(msg.sender, itemId, amount);
        emit ItemUsed(msg.sender, petId, itemId, amount);
    }

    function purchaseBatch(uint256[] memory itemIds, uint256[] memory amounts) external payable {
        require(itemIds.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalPrice;
        for (uint256 i = 0; i < itemIds.length; i++) {
            require(itemIds[i] > 0 && itemIds[i] <= itemCount, "Invalid item ID");
            totalPrice += items[itemIds[i]].price * amounts[i];
        }
        
        require(msg.value >= totalPrice, "Insufficient payment");
        
        for (uint256 i = 0; i < itemIds.length; i++) {
            _mint(msg.sender, itemIds[i], amounts[i], "");
            emit ItemPurchased(msg.sender, itemIds[i], amounts[i]);
        }
    }

    function getItemInfo(uint256 itemId) external view returns (ItemInfo memory) {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        return items[itemId];
    }

    function getAllItems() external view returns (ItemInfo[] memory) {
        ItemInfo[] memory allItems = new ItemInfo[](itemCount);
        for (uint256 i = 1; i <= itemCount; i++) {
            allItems[i - 1] = items[i];
        }
        return allItems;
    }

    function uri(uint256 itemId) public view override returns (string memory) {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        return items[itemId].uri;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}