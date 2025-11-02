// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherMarketplace is ReentrancyGuard, Ownable {
    IERC721 public petNFT;
    IERC1155 public itemContract;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public petListings; // tokenId => Listing
    mapping(uint256 => mapping(address => Listing)) public itemListings; // itemId => seller => Listing

    uint256 public platformFeePercent = 2; // 2%

    event PetListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event PetSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event PetListingCancelled(uint256 indexed tokenId, address indexed seller);

    constructor(address _petNFT, address _itemContract) Ownable(msg.sender) {
        petNFT = IERC721(_petNFT);
        itemContract = IERC1155(_itemContract);
    }

    function listPet(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(petNFT.ownerOf(tokenId) == msg.sender, "You are not the owner");

        petNFT.transferFrom(msg.sender, address(this), tokenId);
        petListings[tokenId] = Listing(msg.sender, price);

        emit PetListed(tokenId, msg.sender, price);
    }

    function buyPet(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = petListings[tokenId];
        require(listing.price > 0, "Pet not listed for sale");
        require(msg.value >= listing.price, "Insufficient funds");

        address seller = listing.seller;
        delete petListings[tokenId];

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 sellerProceeds = msg.value - platformFee;

        petNFT.transferFrom(address(this), msg.sender, tokenId);

        (bool sent, ) = seller.call{value: sellerProceeds}("");
        require(sent, "Failed to send Ether to seller");

        (bool feeSent, ) = owner().call{value: platformFee}("");
        require(feeSent, "Failed to send fee to owner");

        emit PetSold(tokenId, seller, msg.sender, msg.value);
    }

    function cancelPetListing(uint256 tokenId) external {
        Listing memory listing = petListings[tokenId];
        require(listing.seller == msg.sender, "You are not the seller");

        delete petListings[tokenId];
        petNFT.transferFrom(address(this), msg.sender, tokenId);

        emit PetListingCancelled(tokenId, msg.sender);
    }

    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }

    // Function to rescue tokens sent to this contract by mistake
    function rescueERC721(address tokenAddress, uint256 tokenId) external onlyOwner {
        IERC721(tokenAddress).transferFrom(address(this), owner(), tokenId);
    }

    // In case a listing is stuck, owner can cancel it
    function forceCancelPetListing(uint256 tokenId) external onlyOwner {
        Listing memory listing = petListings[tokenId];
        require(listing.price > 0, "Not a valid listing");

        address seller = listing.seller;
        delete petListings[tokenId];
        petNFT.transferFrom(address(this), seller, tokenId);

        emit PetListingCancelled(tokenId, seller);
    }
}