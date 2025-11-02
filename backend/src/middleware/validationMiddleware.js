const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for pet creation
const validatePetCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Name must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Name can only contain letters, numbers, and spaces'),
  
  body('species')
    .isIn(['dragon', 'phoenix', 'unicorn', 'griffin', 'spirit'])
    .withMessage('Invalid species selected'),
  
  body('owner')
    .isEthereumAddress()
    .withMessage('Valid Ethereum address required'),
  
  handleValidationErrors,
];

// Validation rules for pet actions
const validatePetAction = [
  body('foodType')
    .optional()
    .isIn(['basic', 'premium', 'treat'])
    .withMessage('Invalid food type'),
  
  body('gameType')
    .optional()
    .isIn(['fetch', 'puzzle', 'training'])
    .withMessage('Invalid game type'),
  
  body('trainingType')
    .optional()
    .isIn(['agility', 'intelligence', 'strength'])
    .withMessage('Invalid training type'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Duration must be between 1 and 60 minutes'),
  
  handleValidationErrors,
];

// Validation rules for user operations
const validateUser = [
  body('walletAddress')
    .isEthereumAddress()
    .withMessage('Valid Ethereum address required'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Username must be between 3 and 15 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  handleValidationErrors,
];

module.exports = {
  validatePetCreation,
  validatePetAction,
  validateUser,
  handleValidationErrors,
};