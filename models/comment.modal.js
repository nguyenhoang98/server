import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);
const commentSchema = new mongoose.model('comment', schema);
export default commentSchema;
