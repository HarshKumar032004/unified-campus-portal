// models/Grievance.js  –  Mongoose model for a Grievance

import mongoose from 'mongoose';

// Define the shape (schema) of a Grievance document in MongoDB
const grievanceSchema = new mongoose.Schema(
  {
    // Reference to the student who submitted this grievance
    // ObjectId links this document to a document in the "users" collection
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // tells Mongoose which model this refers to
      required: [true, 'Student ID is required'],
    },

    // Short headline of the grievance
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    // Detailed explanation of the grievance
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    // Which department / area the grievance belongs to
    category: {
      type: String,
      enum: ['Academics', 'Hostel', 'Exam', 'Fees', 'Infrastructure', 'Library', 'Anti-Ragging', 'Placements', 'Other'], // allowed categories
      required: [true, 'Category is required'],
    },

    // Current state of the grievance
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'], // allowed statuses
      default: 'Pending', // every new grievance starts as Pending
    },

    // Users who upvoted to support this grievance
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Admin's official response/remark
    adminRemark: {
      type: String,
      default: '',
      trim: true,
    },

    // Whether the student chose to hide their identity
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // Auto-flag if the grievance has been pending for over 3 days
    isEscalated: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    // createdAt  → when the grievance was filed
    // updatedAt  → when the status was last changed
    timestamps: true,
  }
);

// Create and export the Grievance model
// Mongoose will create a "grievances" collection in MongoDB automatically
const Grievance = mongoose.model('Grievance', grievanceSchema);

export default Grievance;
