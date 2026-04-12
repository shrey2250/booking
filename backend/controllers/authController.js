import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    user = new User({
      name,
      email,
      password,
      phoneNumber,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Email or password is wrong' });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Email or password is wrong' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id).populate('bookings');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure bookings is always an array
    const safeUser = {
      ...user.toObject(),
      bookings: Array.isArray(user.bookings) ? user.bookings : []
    };

    res.json(safeUser);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('bookings');
    
    // Ensure each user has a bookings array
    const safeUsers = users.map(user => {
      if (!user) return null;
      if (!Array.isArray(user.bookings)) {
        user.bookings = [];
      }
      return user;
    }).filter(user => user !== null);
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: error.message });
  }
};
