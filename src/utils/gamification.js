/**
 * Calculate user level from total XP
 * Formula: level = floor(totalXp / 100) + 1
 * Level 1: 0 XP, Level 2: 100 XP, Level 3: 200 XP, etc.
 */
const calculateLevel = (totalXp) => {
  return Math.floor(totalXp / 100) + 1;
};

/**
 * XP rewards based on task priority
 */
const XP_REWARDS = {
  LOW: 20,
  MEDIUM: 50,
  HIGH: 100,
  CRITICAL: 200,
};

/**
 * Get XP reward for a given task priority
 */
const getXpReward = (priority) => {
  return XP_REWARDS[priority] || 0;
};

module.exports = {
  calculateLevel,
  XP_REWARDS,
  getXpReward,
};
