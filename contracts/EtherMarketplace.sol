// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";
import "./EtherItem.sol";

contract EtherMarketplace is ReentrancyGuard, Ownable {
    EtherPetNFT public petNFT;
    EtherItem public itemContract;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 listingTime;
    }

    struct ItemListing {
        uint256 itemId;
        uint256 amount;
        address seller;
        uint256 price;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => Listing) public petListings;
    mapping(uint256 => mapping(address => ItemListing)) public itemListings;
    mapping(address => uint256) public earnings;

    // Fees
    uint256 public platformFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Events
    event PetListed(uint256 indexed tokenId, address seller, uint256 price);
    event PetSold(uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event ItemListed(uint256 indexed itemId, address seller, uint256 amount, uint256 price);
    event ItemSold(uint256 indexed itemId, address seller, address buyer, uint256 amount, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address seller);

    constructor(address _petNFT, address _itemContract) {
        petNFT = EtherPetNFT(_petNFT);
        itemContract = EtherItem(_itemContract);
    }

    // List pet for sale
    function listPet(uint256 tokenId, uint256 price) external {
        require(petNFT.ownerOf(tokenId) == msg.sender, "Not pet owner");
        require(price > 0, "Price must be > 0");
        require(!petListings[tokenId].isActive, "Already listed");

        // Transfer pet to marketplace (escrow)
        petNFT.transferFrom(msg.sender, address(this), tokenId);

        petListings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listingTime: block.timestamp
        });

        emit PetListed(tokenId, msg.sender, price);
    }

    // Buy listed pet
    function buyPet(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = petListings[tokenId];
        require(listing.isActive, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 fee = (listing.price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;

        // Transfer payment
        earnings[listing.seller] += sellerAmount;
        earnings[owner()] += fee;

        // Transfer pet to buyer
        petNFT.transferFrom(address(this), msg.sender, tokenId);

        listing.isActive = false;

        emit PetSold(tokenId, listing.seller, msg.sender, listing.price);
    }

    // List items for sale
    function listItem(uint256 itemId, uint256 amount, uint256 price) external {
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        require(itemContract.balanceOf(msg.sender, itemId) >= amount, "Insufficient items");

        // Transfer items to marketplace (escrow)
        itemContract.safeTransferFrom(msg.sender, address(this), itemId, amount, "");

        itemListings[itemId][msg.sender] = ItemListing({
            itemId: itemId,
            amount: amount,
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit ItemListed(itemId, msg.sender, amount, price);
    }

    // Buy listed items
    function buyItem(uint256 itemId, address seller, uint256 amount) external payable nonReentrant {
        ItemListing storage listing = itemListings[itemId][seller];
        require(listing.isActive, "Not for sale");
        require(listing.amount >= amount, "Insufficient amount");
        require(msg.value >= listing.price * amount, "Insufficient payment");

        uint256 totalPrice = listing.price * amount;
        uint256 fee = (totalPrice * platformFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = totalPrice - fee;

        earnings[listing.seller] += sellerAmount;
        earnings[owner()] += fee;

        // Transfer items to buyer
        itemContract.safeTransferFrom(address(this), msg.sender, itemId, amount, "");

        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.isActive = false;
        }

        emit ItemSold(itemId, seller, msg.sender, amount, totalPrice);
    }

    // Cancel listing
    function cancelPetListing(uint256 tokenId) external {
        Listing storage listing = petListings[tokenId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Not active");

        // Return pet to seller
        petNFT.transferFrom(address(this), msg.sender, tokenId);

        listing.isActive = false;

        emit ListingCancelled(tokenId, msg.sender);
    }

    // Withdraw earnings
    function withdrawEarnings() external nonReentrant {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "No earnings");

        earnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Update platform fee (only owner)
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    // Get active pet listings
    function getActivePetListings() external view returns (Listing[] memory) {
        uint256 totalPets = petNFT.totalSupply();
        uint256 activeCount;
        
        // Count active listings
        for (uint256 i = 0; i < totalPets; i++) {
            if (petListings[i].isActive) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index;
        for (uint256 i = 0; i < totalPets; i++) {
            if (petListings[i].isActive) {
                activeListings[index] = petListings[i];
                index++;
            }
        }
        return activeListings;
    }
}