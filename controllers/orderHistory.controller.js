import OrderHistorySchema from '../models/orderHistory.model.js';

export const postOrderHistory = async (req, res) => {
  try {
    const { dataCarts } = req.body;
    const history = await OrderHistorySchema.find({ userId: req.user._id });
    if (!history.length) {
      const createObj = new OrderHistorySchema({
        userId: req.user._id,
        dataCarts: dataCarts[0].cartItems,
      });
      await createObj.save();
      res.status(201).json({
        success: true,
        message: 'success',
      });
    } else {
      const promiseAll = dataCarts[0].cartItems.map(async item => {
        const check = history[0].dataCarts.find(value => {
          return (
            value.productId === item.productId &&
            value.size === item.size &&
            value.color === item.color
          );
        });
        if (check) {
          return await OrderHistorySchema.findOneAndUpdate(
            {
              userId: req.user._id,
              'dataCarts.productId': check.productId,
              'dataCarts.color': check.color,
              'dataCarts.size': check.size,
            },
            {
              $set: {
                'dataCarts.$.quantity': check.quantity + item.quantity,
              },
            }
          );
        } else {
          return await OrderHistorySchema.findOneAndUpdate(
            {
              userId: req.user._id,
            },
            {
              $push: {
                dataCarts: { ...item },
              },
            }
          );
        }
      });
      await Promise.all(promiseAll);
      res.status(201).json({
        success: true,
        message: 'Success',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const history = await OrderHistorySchema.find({ userId: req.user._id });
    res.status(200).json({
      success: true,
      message: 'get order history success',
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
