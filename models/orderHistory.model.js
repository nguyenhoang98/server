import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  dataCarts: {
    type: Array,
  },
});

const OrderHistorySchema = new mongoose.model('orderHistory', schema);

export default OrderHistorySchema;
