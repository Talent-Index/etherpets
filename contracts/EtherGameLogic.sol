// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";
import "./EtherItem.sol";
import "./EtherReward.sol";

contract EtherGameLogic is Ownable {
    EtherPetNFT public petNFT;
    EtherItem public itemContract;

    // Game constants
    uint256 public constant DAILY_REWARD = 10;
    uint256 public constant MOOD_DECAY_RATE = 5; // per day
    uint256 public constant ENERGY_DECAY_RATE = 10; // per day
    uint256 public constant HUNGER_INCREASE_RATE = 8; // per day

    // Hidden information game mechanics
    struct HiddenChallenge {
        uint256 challengeId;
        string description;
        uint256 reward;
        bytes32 solutionHash;
        bool isActive;
        uint256 requiredPetLevel;
    }

    struct Garden {
        uint256 gardenId;
        string name;
        address[] members;
        uint256 totalEnergy;
        uint256 energyThreshold;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => HiddenChallenge) public hiddenChallenges;
    mapping(uint256 => Garden) public gardens;
    mapping(address => uint256) public lastDailyReward;
    mapping(address => uint256) public userStreaks;
    mapping(uint256 => mapping(address => bool)) public challengeCompleted;
    mapping(address => uint256) public gardenMembership;

    // Counters
    uint256 public challengeCount;
    uint256 public gardenCount;

    // Events
    event DailyRewardClaimed(address indexed user, uint256 reward, uint256 streak);
    event ChallengeCompleted(address indexed user, uint256 challengeId, uint256 reward);
    event GardenCreated(uint256 indexed gardenId, string name, address creator);
    event GardenEnergyUpdated(uint256 indexed gardenId, uint256 totalEnergy);
    event GardenBloom(uint256 indexed gardenId, uint256 reward);

    EtherReward public rewardToken;

    constructor(address _petNFT, address _itemContract, address _rewardToken) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
        itemContract = EtherItem(_itemContract);
        rewardToken = EtherReward(_rewardToken);
    }

    // Claim daily reward
    function claimDailyReward() external {
        uint256 lastClaim = lastDailyReward[msg.sender];
        uint256 currentDay = block.timestamp / 1 days;

        require(currentDay > lastClaim, "Daily reward already claimed");

        // Check streak
        if (lastClaim == currentDay - 1 days) {
            userStreaks[msg.sender]++;
        } else {
            userStreaks[msg.sender] = 1;
        }

        uint256 reward = DAILY_REWARD + (userStreaks[msg.sender] * 2); // Bonus for streaks
        lastDailyReward[msg.sender] = currentDay;

        // Mint reward items
        rewardToken.mint(msg.sender, reward * (10**rewardToken.decimals()));

        emit DailyRewardClaimed(msg.sender, reward, userStreaks[msg.sender]);
    }

    // Create hidden challenge
    function createHiddenChallenge(
        string memory description,
        uint256 reward,
        bytes32 solutionHash,
        uint256 requiredPetLevel
    ) external onlyOwner {
        challengeCount++;
        hiddenChallenges[challengeCount] = HiddenChallenge({
            challengeId: challengeCount,
            description: description,
            reward: reward,
            solutionHash: solutionHash,
            isActive: true,
            requiredPetLevel: requiredPetLevel
        });
    }

    // Solve hidden challenge
    function solveHiddenChallenge(uint256 challengeId, string memory solution) external {
        HiddenChallenge storage challenge = hiddenChallenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        require(!challengeCompleted[challengeId][msg.sender], "Already completed");
        
        // Check if user has a pet with required level
        uint256[] memory userPets = petNFT.getOwnerPets(msg.sender);
        bool hasRequiredLevel = false;
        for (uint256 i = 0; i < userPets.length; i++) {
            (, , , , , , uint256 growthStage, ,) = petNFT.pets(userPets[i]);
            if (growthStage >= challenge.requiredPetLevel) {
                hasRequiredLevel = true;
                break;
            }
        }
        require(hasRequiredLevel, "Pet level too low");

        // Verify solution
        require(keccak256(abi.encodePacked(solution)) == challenge.solutionHash, "Wrong solution");

        challengeCompleted[challengeId][msg.sender] = true;
        
        // Give reward
        rewardToken.mint(msg.sender, challenge.reward * (10**rewardToken.decimals()));

        emit ChallengeCompleted(msg.sender, challengeId, challenge.reward);
    }

    // Create garden
    function createGarden(string memory name, uint256 energyThreshold) external {
        gardenCount++;
        address[] memory members = new address[](1);
        members[0] = msg.sender;

        gardens[gardenCount] = Garden({
            gardenId: gardenCount,
            name: name,
            members: members,
            totalEnergy: 0,
            energyThreshold: energyThreshold,
            isActive: true
        });

        gardenMembership[msg.sender] = gardenCount;

        emit GardenCreated(gardenCount, name, msg.sender);
    }

    // Contribute energy to garden
    function contributeToGarden(uint256 gardenId, uint256 energy) external {
        Garden storage garden = gardens[gardenId];
        require(garden.isActive, "Garden not active");
        require(_isGardenMember(gardenId, msg.sender), "Not a garden member");

        garden.totalEnergy += energy;
        
        emit GardenEnergyUpdated(gardenId, garden.totalEnergy);

        // Check if garden can bloom
        if (garden.totalEnergy >= garden.energyThreshold) {
            _triggerGardenBloom(gardenId);
        }
    }

    // Trigger garden bloom event
    function _triggerGardenBloom(uint256 gardenId) internal {
        Garden storage garden = gardens[gardenId];
        garden.isActive = false; // Garden completes after bloom
        
        uint256 rewardPerMember = garden.energyThreshold / garden.members.length;
        
        for (uint256 i = 0; i < garden.members.length; i++) {
            rewardToken.mint(garden.members[i], rewardPerMember * (10**rewardToken.decimals()));
        }

        emit GardenBloom(gardenId, rewardPerMember);
    }

    // Update pet stats based on time decay
    function updatePetDecay(uint256 petId) external {
        EtherPetNFT.Pet memory pet = petNFT.getPet(petId);
        require(petNFT.ownerOf(petId) == msg.sender, "Not pet owner");

        uint256 timePassed = block.timestamp - pet.lastInteraction;
        uint256 daysPassed = timePassed / 1 days;

        if (daysPassed > 0) {
            uint256 newMood = pet.mood > (MOOD_DECAY_RATE * daysPassed) ? 
                            pet.mood - (MOOD_DECAY_RATE * daysPassed) : 0;
            
            uint256 newEnergy = pet.energy > (ENERGY_DECAY_RATE * daysPassed) ? 
                             pet.energy - (ENERGY_DECAY_RATE * daysPassed) : 0;
            
            uint256 newHunger = _min(pet.hunger + (HUNGER_INCREASE_RATE * daysPassed), 100);

            petNFT.updatePetStats(petId, newMood, newEnergy, newHunger, pet.happiness, pet.auraColor);
        }
    }

    // Helper function to check garden membership
    function _isGardenMember(uint256 gardenId, address user) internal view returns (bool) {
        Garden memory garden = gardens[gardenId];
        for (uint256 i = 0; i < garden.members.length; i++) {
            if (garden.members[i] == user) {
                return true;
            }
        }
        return false;
    }

    // Helper function to calculate minimum
    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Get user's current streak
    function getUserStreak(address user) external view returns (uint256) {
        return userStreaks[user];
    }

    // Get active challenges
    function getActiveChallenges() external view returns (HiddenChallenge[] memory) {
        uint256 activeCount;
        for (uint256 i = 1; i <= challengeCount; i++) {
            if (hiddenChallenges[i].isActive) {
                activeCount++;
            }
        }

        HiddenChallenge[] memory activeChallenges = new HiddenChallenge[](activeCount);
        uint256 index;
        for (uint256 i = 1; i <= challengeCount; i++) {
            if (hiddenChallenges[i].isActive) {
                activeChallenges[index] = hiddenChallenges[i];
                index++;
            }
        }
        return activeChallenges;
    }
}