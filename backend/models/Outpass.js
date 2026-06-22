// models/Outpass.js  –  Mongoose model for Hostel Outpass

import mongoose from 'mongoose';

const outpassSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Outpass = mongoose.model('Outpass', outpassSchema);
export default Outpass;
