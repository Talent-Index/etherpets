// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherReward is ERC20, Ownable {
    // Mapping to track minters
    mapping(address => bool) public minters;

    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    constructor() ERC20("EtherPets Reward", "EPR") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply
    }

    // Add minter (only owner)
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    // Remove minter (only owner)
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    // Mint tokens (only minters)
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not a minter");
        _mint(to, amount);
    }

    // Burn tokens
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}