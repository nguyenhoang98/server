import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  numberPhone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dataCarts: {
    type: Array,
  },
  districts: {
    type: String,
    required: true,
  },
  provinces: {
    type: String,
  },
  wards: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  method_payment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['wait', 'delivery', 'complete'],
    default: 'wait',
    required: true,
  },
  intoMoney: {
    type: Number,
  },
});

const OrderSchema = new mongoose.model('order', schema);

export default OrderSchema;
