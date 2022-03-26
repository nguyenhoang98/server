import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        productSrc: {
          type: String,
          require: true,
        },
        description: {
          type: String,
          require: true,
        },
        title: {
          type: String,
          require: true,
        },
        discount: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        afterPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const cartSchema = new mongoose.model('carts', Schema);
export default cartSchema;
