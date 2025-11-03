// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    struct WellnessChallenge {
        uint256 challengeId;
        string description;
        uint256 duration;
        uint256 reward;
        uint256 participantLimit;
        address[] participants;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => MeditationSession) public meditationSessions;
    mapping(uint256 => WellnessChallenge) public wellnessChallenges;
    mapping(address => uint256[]) public userSessions;
    mapping(address => uint256) public meditationStreaks;
    mapping(address => uint256) public lastMeditationDate;

    // Counters
    uint256 public sessionCount;
    uint256 public challengeCount;

    // Constants
    uint256 public constant MIN_MEDITATION_TIME = 300; // 5 minutes in seconds
    uint256 public constant BASE_REWARD = 10;

    // Events
    event MeditationStarted(uint256 indexed sessionId, uint256 indexed petId, address user);
    event MeditationCompleted(uint256 indexed sessionId, uint256 reward, uint256 streak);
    event WellnessChallengeCreated(uint256 indexed challengeId, string description, uint256 reward);
    event ChallengeJoined(uint256 indexed challengeId, address participant);
    event ChallengeCompleted(uint256 indexed challengeId, address participant, uint256 reward);

    constructor(address _petNFT, address _rewardToken) Ownable(msg.sender) {
        petNFT = EtherPetNFT(_petNFT);
        rewardToken = EtherReward(_rewardToken);
    }

    // Start meditation session
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

    // Complete meditation session
    function completeMeditation(uint256 sessionId, uint256 duration) external {
        MeditationSession storage session = meditationSessions[sessionId];
        require(session.startTime > 0, "Session not found");
        require(!session.completed, "Already completed");
        require(petNFT.ownerOf(session.petId) == msg.sender, "Not pet owner");
        require(duration >= MIN_MEDITATION_TIME, "Duration too short");

        session.duration = duration;
        session.completed = true;

        // Calculate reward based on duration
        uint256 reward = _calculateReward(duration);
        
        // Check and update streak
        uint256 currentDay = block.timestamp / 1 days; // Use 'days' for clarity
        if (lastMeditationDate[msg.sender] == currentDay - 1 days) {
            meditationStreaks[msg.sender]++;
        } else if (lastMeditationDate[msg.sender] != currentDay) {
            meditationStreaks[msg.sender] = 1;
        }
        
        lastMeditationDate[msg.sender] = currentDay;

        // Apply streak bonus
        reward += (reward * meditationStreaks[msg.sender]) / 10;

        session.reward = reward;

        // Update pet stats (meditation improves mood and energy)
        EtherPetNFT.Pet memory pet = petNFT.getPet(session.petId);
        uint256 newMood = _min(pet.mood + 15, 100);
        uint256 newEnergy = _min(pet.energy + 10, 100);
        
        petNFT.updatePetStats(
            session.petId,
            newMood,
            newEnergy,
            pet.hunger,
            pet.happiness,
            pet.auraColor
        );

        // Mint rewards
        rewardToken.mint(msg.sender, reward);

        emit MeditationCompleted(sessionId, reward, meditationStreaks[msg.sender]);
    }

    // Create wellness challenge
    function createWellnessChallenge(
        string memory description,
        uint256 duration,
        uint256 reward,
        uint256 participantLimit
    ) external onlyOwner {
        challengeCount++;
        
        address[] memory emptyParticipants;
        wellnessChallenges[challengeCount] = WellnessChallenge({
            challengeId: challengeCount,
            description: description,
            duration: duration,
            reward: reward,
            participantLimit: participantLimit,
            participants: emptyParticipants,
            isActive: true
        });

        emit WellnessChallengeCreated(challengeCount, description, reward);
    }

    // Join wellness challenge
    function joinWellnessChallenge(uint256 challengeId) external {
        WellnessChallenge storage challenge = wellnessChallenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        require(challenge.participants.length < challenge.participantLimit, "Challenge full");
        
        // Check if already joined
        for (uint256 i = 0; i < challenge.participants.length; i++) {
            require(challenge.participants[i] != msg.sender, "Already joined");
        }

        challenge.participants.push(msg.sender);

        emit ChallengeJoined(challengeId, msg.sender);
    }

    // Complete wellness challenge
    function completeWellnessChallenge(uint256 challengeId) external {
        WellnessChallenge storage challenge = wellnessChallenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        
        bool isParticipant = false;
        for (uint256 i = 0; i < challenge.participants.length; i++) {
            if (challenge.participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(isParticipant, "Not a participant");

        // Award reward to all participants (collaborative)
        uint256 rewardPerParticipant = challenge.reward / challenge.participants.length;
        
        for (uint256 i = 0; i < challenge.participants.length; i++) {
            rewardToken.mint(challenge.participants[i], rewardPerParticipant);
        }

        challenge.isActive = false;

        emit ChallengeCompleted(challengeId, msg.sender, rewardPerParticipant);
    }

    // Calculate reward based on meditation duration
    function _calculateReward(uint256 duration) internal pure returns (uint256) {
        uint256 reward = BASE_REWARD;
        
        if (duration >= 1800) { // 30 minutes
            reward *= 3;
        } else if (duration >= 900) { // 15 minutes
            reward *= 2;
        } else if (duration >= 600) { // 10 minutes
            reward = (reward * 3) / 2;
        }
        
        return reward;
    }

    // Helper function to calculate minimum
    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Get user's meditation history
    function getUserSessions(address user) external view returns (MeditationSession[] memory) {
        uint256[] memory sessionIds = userSessions[user];
        MeditationSession[] memory sessions = new MeditationSession[](sessionIds.length);
        
        for (uint256 i = 0; i < sessionIds.length; i++) {
            sessions[i] = meditationSessions[sessionIds[i]];
        }
        
        return sessions;
    }

    // Get active wellness challenges
    function getActiveChallenges() external view returns (WellnessChallenge[] memory) {
        uint256 activeCount;
        for (uint256 i = 1; i <= challengeCount; i++) {
            if (wellnessChallenges[i].isActive) {
                activeCount++;
            }
        }

        WellnessChallenge[] memory activeChallenges = new WellnessChallenge[](activeCount);
        uint256 index;
        for (uint256 i = 1; i <= challengeCount; i++) {
            if (wellnessChallenges[i].isActive) {
                activeChallenges[index] = wellnessChallenges[i];
                index++;
            }
        }
        return activeChallenges;
    }
}