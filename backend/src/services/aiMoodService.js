class AIMoodService {
  // Analyze pet actions and predict mood changes
  static analyzePetBehavior(actions, currentMood) {
    const recentActions = actions.slice(-10); // Last 10 actions
    
    let moodScore = 50; // Neutral starting point
    
    // Analyze action patterns
    const actionWeights = {
      feed: { base: 5, frequency: 2 },
      play: { base: 8, frequency: 3 },
      rest: { base: 3, frequency: 1 },
      meditate: { base: 6, frequency: 2 },
      social: { base: 7, frequency: 4 },
    };

    // Calculate mood based on recent actions
    recentActions.forEach(action => {
      const weight = actionWeights[action.type] || { base: 1, frequency: 1 };
      moodScore += weight.base;
      
      // Bonus for variety
      const actionCount = recentActions.filter(a => a.type === action.type).length;
      if (actionCount > 3) {
        moodScore -= (actionCount - 3) * weight.frequency; // Penalize repetition
      }
    });

    // Time-based factors
    const now = new Date();
    const lastActionTime = recentActions.length > 0 ? 
      new Date(recentActions[recentActions.length - 1].timestamp) : now;
    const hoursSinceLastAction = (now - lastActionTime) / (1000 * 60 * 60);

    if (hoursSinceLastAction > 24) {
      moodScore -= 20; // Significant penalty for neglect
    } else if (hoursSinceLastAction > 12) {
      moodScore -= 10; // Moderate penalty
    }

    // Convert score to mood
    return this.scoreToMood(moodScore);
  }

  // Generate personalized message based on pet state
  static generateMoodMessage(pet, recentEvents) {
    const messages = {
      happy: [
        `${pet.name} is radiating positive energy!`,
        `Your care is making ${pet.name} very happy!`,
        `${pet.name} seems delighted today!`,
      ],
      calm: [
        `${pet.name} is in a peaceful state of mind.`,
        `A sense of tranquility surrounds ${pet.name}.`,
        `${pet.name} appears content and relaxed.`,
      ],
      excited: [
        `${pet.name} is full of energy and curiosity!`,
        `Adventure calls to ${pet.name} today!`,
        `${pet.name} is eager to explore and play!`,
      ],
      sad: [
        `${pet.name} could use some extra attention today.`,
        `A little care would brighten ${pet.name}'s day.`,
        `${pet.name} seems a bit lonely.`,
      ],
      tired: [
        `${pet.name} needs some rest and recovery.`,
        `Consider letting ${pet.name} take a break.`,
        `${pet.name} is feeling a bit exhausted.`,
      ],
      hungry: [
        `${pet.name} is looking for something to eat.`,
        `Your companion could use some nourishment.`,
        `${pet.name}'s energy is running low.`,
      ],
    };

    const moodMessages = messages[pet.mood] || messages.calm;
    return moodMessages[Math.floor(Math.random() * moodMessages.length)];
  }

  // Predict evolution based on hidden traits
  static predictEvolution(pet) {
    const { trust, empathy, curiosity } = pet.hiddenTraits;
    const totalScore = trust + empathy + curiosity;

    if (totalScore >= 240) {
      return { 
        possible: true, 
        type: 'majestic',
        message: 'Your pet shows signs of majestic evolution!' 
      };
    } else if (totalScore >= 180) {
      return { 
        possible: true, 
        type: 'advanced',
        message: 'Your pet is nearing an advanced evolution!' 
      };
    } else {
      return { 
        possible: false,
        message: 'Continue nurturing your pet for evolution.' 
      };
    }
  }

  // Convert numerical score to mood category
  static scoreToMood(score) {
    if (score >= 80) return 'excited';
    if (score >= 60) return 'happy';
    if (score >= 40) return 'calm';
    if (score >= 20) return 'sad';
    return 'tired';
  }

  /**
   * Generates a contextual chat response based on user input and pet state.
   * This simulates an AI's conversational ability and mood analysis.
   * @param {string} userMessage - The user's input message.
   * @param {object} pet - The pet object.
   * @returns {{reply: string, newMood: string}} The AI's reply and the suggested new mood.
   */
  static generateChatResponse(userMessage, pet) {
    const text = userMessage.toLowerCase();
    let reply = '';
    let newMood = pet.mood;

    const moodResponses = {
      happy: "I'm feeling absolutely fantastic! Full of energy and joy! 🌈",
      calm: "I'm very peaceful and content. Everything feels balanced. 🍃",
      excited: "So much energy! I feel like I could run for days! ⚡",
      sad: "I'm feeling a bit down today, but talking to you helps. 🌧️",
      hungry: "A bit peckish, but otherwise okay! 🍎",
      tired: "A little sleepy, but always happy to chat with you. 😴",
    };

    if (text.includes('how are you') || text.includes('how do you feel')) {
      reply = moodResponses[pet.mood] || "I'm doing okay, just taking things as they come.";
    } else if (text.includes('play') || text.includes('game')) {
      reply = "I'd love to play! What should we do together? 🎮";
      newMood = 'excited';
    } else if (text.includes('meditate') || text.includes('calm')) {
      reply = "Meditation sounds perfect. Let's find our center together. 🧘";
      newMood = 'calm';
    } else if (text.includes('love') || text.includes('care') || text.includes('amazing')) {
      reply = "I feel so loved and cared for. You're the best! 💖";
      newMood = 'happy';
    } else if (text.includes('hungry') || text.includes('feed')) {
      reply = "Thank you for thinking of me! A snack would be lovely. 🍎";
      newMood = 'happy';
    } else if (text.includes('tired') || text.includes('sleep')) {
      reply = "I could use some rest. Let's recharge together. 😴";
      newMood = 'calm';
    } else {
      const defaultReplies = [
        "That's really interesting! Tell me more about that. 💫",
        "I appreciate you sharing that with me. 🌟",
        "How does that make you feel? 🎭",
        "I'm here to listen whenever you need to talk. 🌙",
        `I wonder what that means in the world of a ${pet.species}.`,
      ];
      reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }

    return {
      reply,
      newMood,
    };
  }

  // Analyze hidden trait development
  static analyzeHiddenTraits(events) {
    const traits = { trust: 0, empathy: 0, curiosity: 0 };
    
    events.forEach(event => {
      if (event.hiddenTraitsChange) {
        traits.trust += event.hiddenTraitsChange.trust || 0;
        traits.empathy += event.hiddenTraitsChange.empathy || 0;
        traits.curiosity += event.hiddenTraitsChange.curiosity || 0;
      }
    });

    return traits;
  }
}

module.exports = AIMoodService;