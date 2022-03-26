import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

const Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      min: 6,
      max: 10,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'block'],
      default: 'user',
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.model('users', Schema);
export default userSchema;

// require : firstName , lastName , userName , email , hash_password
