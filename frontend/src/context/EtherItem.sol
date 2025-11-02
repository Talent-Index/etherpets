// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EtherItem is ERC1155, Ownable {
    using Strings for uint256;

    // Item types
    enum ItemType { 
        FOOD, 
        POTION, 
        TOY
    }

    struct ItemInfo {
        uint256 itemId;
        string name;
        ItemType itemType;
        uint256 effectValue;
        uint256 price;
        string uri;
    }

    // Mapping from item ID to ItemInfo
    mapping(uint256 => ItemInfo) public items;
    
    // Total items count
    uint256 public itemCount;

    // Events
    event ItemCreated(uint256 indexed itemId, string name, ItemType itemType, uint256 price);
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 amount);

    constructor() ERC1155("https://api.etherpets.com/api/item/{id}.json") Ownable(msg.sender) {}

    // Create new item (only owner)
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

    // Purchase items
    function purchaseItem(uint256 itemId, uint256 amount) external payable {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        ItemInfo memory item = items[itemId];
        require(msg.value >= item.price * amount, "Insufficient payment");

        _mint(msg.sender, itemId, amount, "");
        emit ItemPurchased(msg.sender, itemId, amount);
    }

    // Get item info
    function getItemInfo(uint256 itemId) external view returns (ItemInfo memory) {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        return items[itemId];
    }

    // URI override for metadata
    function uri(uint256 itemId) public view override returns (string memory) {
        require(itemId > 0 && itemId <= itemCount, "Invalid item ID");
        return items[itemId].uri;
    }

    // Withdraw funds (only owner)
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed.");
    }
}