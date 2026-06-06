const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, username, password, email } = req.body;
    const errors = {};

    // Basic Input Validations
    if (!name || name.trim().length < 2) {
      errors.name = 'Name is required (minimum 2 characters)';
    }

    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!username || !usernameRegex.test(username)) {
      errors.username = 'Username must be alphanumeric and between 3-20 characters';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check username uniqueness
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken',
        errors: { username: 'Username is already taken' }
      });
    }

    // Check email uniqueness if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: { email: 'Please enter a valid email address' }
        });
      }

      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered',
          errors: { email: 'Email is already registered' }
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      password,
      email: email && email.trim() ? email.toLowerCase() : undefined
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password'
      });
    }

    // Explicitly select password for verification
    const user = await User.findOne({ username: username.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile or password
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const errors = {};

    // Password Update Logic
    if (currentPassword || newPassword) {
      if (!currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
      }
      if (!newPassword) {
        errors.newPassword = 'New password is required';
      } else if (newPassword.length < 6) {
        errors.newPassword = 'New password must be at least 6 characters';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Password validation failed',
          errors
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password verification failed',
          errors: { currentPassword: 'Current password is incorrect' }
        });
      }

      user.password = newPassword;
    }

    // Profile Info Update Logic
    if (name !== undefined) {
      if (name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
      } else {
        user.name = name;
      }
    }

    if (email !== undefined) {
      const emailTrimmed = email.trim();
      if (emailTrimmed) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
          errors.email = 'Please enter a valid email address';
        } else if (emailTrimmed.toLowerCase() !== user.email) {
          const emailExists = await User.findOne({ email: emailTrimmed.toLowerCase() });
          if (emailExists) {
            errors.email = 'Email is already taken';
          } else {
            user.email = emailTrimmed.toLowerCase();
          }
        }
      } else {
        user.email = undefined; // Allow unsetting email since email is optional
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Update validation failed',
        errors
      });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
