
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: Generate a JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerUser = async (req, res) => {

  const { name, email, password, secretKey } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine Role
    let userRole = 'student';
    
    // Upgrade to admin if secretKey matches
    const validSecret = process.env.ADMIN_SECRET;
    if (secretKey && secretKey === validSecret) {
      userRole = 'admin';
    } else if (secretKey) {
      return res.status(401).json({ message: 'Invalid Admin Secret Code.' });
    }

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);


    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {

      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);


    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
