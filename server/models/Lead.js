const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
        message: '{VALUE} is not a valid status'
      },
      default: 'New'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for search on name, email, and company
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
