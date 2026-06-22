// models/LostItem.js  –  Mongoose model for Lost & Found items

import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Type is required'],
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact info is required'],
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
    dateReported: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;
