// models/User.js  –  Mongoose model for a User

import mongoose from 'mongoose';

// Define the shape (schema) of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes extra whitespace from both ends
    },

    // Email must be unique across all users
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,    // MongoDB will reject duplicate emails
      lowercase: true, // store emails in lower case for consistency
      trim: true,
    },

    // Hashed password (plain-text passwords should never be stored)
    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    // A user is either a regular student or an admin
    role: {
      type: String,
      enum: ['student', 'admin'], // only these two values are allowed
      default: 'student',         // new users are students by default
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the User model
// Mongoose will create a "users" collection in MongoDB automatically
const User = mongoose.model('User', userSchema);

export default User;
