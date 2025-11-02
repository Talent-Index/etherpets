// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EtherPetNFT.sol";
import "./EtherReward.sol";

contract EtherMeditation is Ownable {
    EtherPetNFT public petNFT;
    EtherReward public rewardToken;

    struct MeditationSession {
        uint256 sessionId;
        uint256 petId;
        uint256 startTime;
        uint256 duration;
        uint256 reward;
        bool completed;
    }

    mapping(uint256 => MeditationSession) public meditationSessions;
    mapping(address => uint256[]) public userSessions;
    mapping(address => uint256) public meditationStreaks;
    mapping(address => uint256) public lastMeditationDay;

    uint256 public sessionCount;

    uint256 public constant MIN_MEDITATION_TIME = 300; // 5 minutes
    uint256 public constant BASE_REWARD = 10 ether;

    event MeditationStarted(uint256 indexed sessionId, uint256 indexed petId, address user);
    event MeditationCompleted(uint256 indexed sessionId, uint256 reward, uint256 streak);

    constructor(address _petNFT, address _rewardToken) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
        rewardToken = EtherReward(_rewardToken);
    }

    function startMeditation(uint256 petId) external {
        require(petNFT.ownerOf(petId) == msg.sender, "Not pet owner");
        
        sessionCount++;
        meditationSessions[sessionCount] = MeditationSession({
            sessionId: sessionCount,
            petId: petId,
            startTime: block.timestamp,
            duration: 0,
            reward: 0,
            completed: false
        });

        userSessions[msg.sender].push(sessionCount);
        emit MeditationStarted(sessionCount, petId, msg.sender);
    }

    function completeMeditation(uint256 sessionId, uint256 duration) external {
        MeditationSession storage session = meditationSessions[sessionId];
        require(petNFT.ownerOf(session.petId) == msg.sender, "Not session owner");
        require(!session.completed, "Session already completed");
        require(duration >= MIN_MEDITATION_TIME, "Duration too short");

        session.duration = duration;
        session.completed = true;

        uint256 currentDay = block.timestamp / 1 days;
        if (lastMeditationDay[msg.sender] == currentDay - 1) {
            meditationStreaks[msg.sender]++;
        } else if (lastMeditationDay[msg.sender] != currentDay) {
            meditationStreaks[msg.sender] = 1;
        }
        lastMeditationDay[msg.sender] = currentDay;

        uint256 streakBonus = (meditationStreaks[msg.sender] * BASE_REWARD) / 10; // 10% bonus per streak day
        uint256 reward = BASE_REWARD + streakBonus;
        session.reward = reward;

        rewardToken.mint(msg.sender, reward);
        emit MeditationCompleted(sessionId, reward, meditationStreaks[msg.sender]);
    }
}