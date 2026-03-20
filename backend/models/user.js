import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      // Not required — OAuth users won't have a password
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // OAuth
    googleId: { type: String, default: '' },
    facebookId: { type: String, default: '' },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    // Push notifications (Unit 2 / Term Test)
    pushToken: {
      type: String,
      default: '',
    },
    // Refresh token store
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Hash password before save (only if modified and exists)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hashed
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;