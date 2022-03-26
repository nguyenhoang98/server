import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      require: false,
    },
    productAvatar: [String],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        review: String,
      },
    ],
    rating: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        count: Number,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    /////////////////////////////////////
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['stock', 'outStock'],
      required: true,
    },
    statusText: {
      type: String,
      required: true,
    },
    flashSale: {
      type: Boolean,
      require: false,
    },
    info: [
      {
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
schema.index({ title: 'text', description: 'text' });
const productSchema = new mongoose.model('products', schema);
export default productSchema;
