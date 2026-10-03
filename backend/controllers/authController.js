import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate signed JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'petcare_jwt_secret_key_super_secure_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create user in database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatarUrl: avatarUrl || undefined,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PetCare+.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data received',
      });
    }
  } catch (error) {
    console.error('Register Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (Requires Token)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('GetMe Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile',
    });
  }
};
