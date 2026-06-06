const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to handle express-validator results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(err => {
      formattedErrors[err.path] = err.msg;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

// Validation rules for creating a lead
const createValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'])
    .withMessage('Invalid status value'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// Validation rules for updating a lead
const updateValidationRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('company')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'])
    .withMessage('Invalid status value'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

// Register stats route before protect to make it public, and before /:id to prevent routing conflict
router.route('/stats')
  .get(getLeadStats);

// Apply protection middleware to all lead routes below
router.use(protect);

// Routes mapping
router.route('/')
  .post(createValidationRules, validateResults, createLead)
  .get(getAllLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateValidationRules, validateResults, updateLead)
  .delete(deleteLead);

module.exports = router;
