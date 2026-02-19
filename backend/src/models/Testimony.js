const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Testimony content is required'],
      trim: true,
    },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimony', testimonySchema);
