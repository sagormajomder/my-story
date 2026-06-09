import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { VALIDATION } from '../../shared/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [1, 'Name cannot be empty'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      validate: {
        validator: v => v != null && v.trim().length > 0,
        message: 'Name cannot be blank',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      ],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'moderator', 'user', 'guest'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    this.password = await bcrypt.hash(
      this.password,
      VALIDATION.BCRYPT_SALT_ROUNDS,
    );
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
