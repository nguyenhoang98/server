import { io } from '../index.js';
import OrderSchema from '../models/order.modal.js';
import nodemailer from 'nodemailer';
import subVn from 'sub-vn';
import userSchema from '../models/auth.model.js';
import cartSchema from '../models/cart.model.js';
import productSchema from '../models/product.model.js';

export const postOrderController = async (req, res) => {
  try {
    const {
      name,
      numberPhone,
      address,
      districts,
      provinces,
      wards,
      email,
      method_payment,
      status,
      dataCarts,
    } = req.body;
    const provincesAll = subVn.getProvinces();
    const districtAll = subVn.getDistricts();
    const wardAll = subVn.getWards();
    const provincesName = provincesAll.find(item => {
      if (item.code === provinces) return item.name;
    });
    const districtsName = districtAll.find(item => {
      if (item.code === districts) return item.name;
    });
    const wardsName = wardAll.find(item => {
      if (item.code === wards) return item.name;
    });
    const userId = req.user._id;
    const username = await userSchema.find({ _id: userId });

    const newOrder = new OrderSchema({
      userId,
      username: username[0].userName,
      name,
      numberPhone,
      address,
      dataCarts: dataCarts[0].cartItems,
      districts: districtsName.name,
      provinces: provincesName.name,
      wards: wardsName.name,
      email,
      method_payment,
      status,
      intoMoney: dataCarts[0].cartItems.reduce((total, value) => {
        return total + value.afterPrice * value.quantity;
      }, 0),
    });
    await newOrder.save();
    const orders = await OrderSchema.find();
    io.emit('add-order', orders);
    await cartSchema.findOneAndDelete({ user: userId });
    sendEmail(email, 'Đơn đặt hàng của bạn tại shop đang được phê duyệt!');
    res.status(200).json({
      success: true,
      message: 'the order success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

export const getOrderController = async (req, res) => {
  try {
    const dataOrders = await OrderSchema.find();
    return res.status(200).json({
      success: true,
      message: 'get data order success',
      dataOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOrder = await OrderSchema.findOneAndDelete({ _id: id });
    if (!deleteOrder) {
      return res.status(400).json({
        success: false,
        message: 'The Order not found',
      });
    }
    res.status(200).json({
      success: false,
      message: 'Delete order success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error`,
    });
  }
};

export const deliveryOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const updateOrder = await OrderSchema.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (!updateOrder) {
      return res.status(400).json({
        success: false,
        message: 'The Order not found',
      });
    }
    sendEmail(email, 'Đơn đặt hàng của bạn tại shop đang được vận chuyển!');
    return res.status(200).json({
      success: true,
      message: `update success`,
    });
  } catch (error) {}
  return res.status(500).json({
    success: false,
    message: `Internal server error ${error.message}`,
  });
};

export const completeOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, dataCarts } = req.body;
    const promiseAll = dataCarts.map(async item => {
      const product = await productSchema.find({ _id: item.productId });
      if (!product.length) {
        return res.status(404).json({
          success: false,
          message: 'Not found product',
        });
      }
      const check = product[0].info.find(
        value => value.color === item.color && value.size === item.size
      );
      if (check) {
        const resultQuantity = check.quantity - item.quantity;
        if (resultQuantity === 0) {
          return await productSchema.findOneAndUpdate(
            {
              _id: item.productId,
              'info.color': item.color,
              'info.size': item.size,
            },
            {
              $pull: {
                info: {
                  color: item.color,
                  size: item.size,
                },
              },
            }
          );
        } else {
          return await productSchema.findOneAndUpdate(
            {
              _id: item.productId,
              'info.color': item.color,
              'info.size': item.size,
            },
            {
              $set: {
                'info.$.color': item.color,
                'info.$.size': item.size,
                'info.$.quantity': check.quantity - item.quantity,
              },
            }
          );
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
    });
    await Promise.all(promiseAll);
    await OrderSchema.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    sendEmail(email, 'Đơn đặt hàng của bạn tại shop đã giao dịch thành công!');
    return res.status(200).json({
      success: false,
      message: 'Confirm product success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

const sendEmail = (email, content) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: false,
    auth: {
      user: 'nguyenvanhoang98it@gmail.com',
      pass: 'ylyljpfakirijjgq',
    },
  });

  let mailOptions = {
    from: 'nguyenvanhoang98it@gmail.com',
    to: email,
    subject: 'Shop quần áo',
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Lỗi', error.message);
    }
    console.log('success');
  });
};
