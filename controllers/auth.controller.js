import userSchema from '../models/auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const registerController = async (req, res) => {
  const { userName, password, role, contactNumber, email, profilePicture } =
    req.body;
  if (!userName || !password || !role || !contactNumber || !email) {
    return res.status(400).json({
      success: false,
      message:
        'userName or password or role or contactNumber or email is required',
    });
  }

  try {
    const isTrue = await userSchema.findOne({ userName });
    if (isTrue) {
      return res.status(400).json({
        success: false,
        message: 'userName is exists',
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userSchema({
      userName: userName,
      password: hashPassword,
      role: role,
      contactNumber: contactNumber,
      email: email,
      profilePicture: profilePicture,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công!',
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error`,
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: 'userName or password is required',
    });
  }
  try {
    const user = await userSchema.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'userName is incorrect',
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: 'password is incorrect',
      });
    }
    const token = jwt.sign({ user: user }, process.env.DB_TOKEN, {
      expiresIn: '1h',
    });
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const checkLoginController = async (req, res) => {
  try {
    const user = await userSchema
      .findOne({ _id: req.user._id })
      .select('-password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'token fail',
      });
    }
    res.status(200).json({
      success: true,
      message: 'logged',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUsersController = async (req, res) => {
  const query = req.query;
  const condition = {};
  for (let i in query) {
    if (query[i]) condition[i] = query[i];
  }
  try {
    const user = await userSchema.find(condition).select('-password');
    res.status(200).json({
      success: true,
      message: 'get list user success',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await userSchema.findOneAndDelete({ _id: id });
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: 'Not found user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Xóa thành công user',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateRoleController = async (req, res) => {
  const { id } = req.params;
  const { userName, password, role, contactNumber, email, profilePicture } =
    req.body;
  try {
    const user = await userSchema.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user not found',
      });
    }
    const newUser = {
      userName,
      password,
      role,
      contactNumber,
      email,
      profilePicture,
    };
    const condition = { _id: id };
    const updateUser = await userSchema.findOneAndUpdate(condition, newUser, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: 'Not found user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Update user success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const {
    userName,
    password,
    newPassword,
    oldPassword,
    role,
    contactNumber,
    email,
    profilePicture,
  } = req.body;
  try {
    const user = await userSchema.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user not found',
      });
    }
    let hashPassword;
    if (oldPassword && newPassword) {
      const comparePassword = await bcrypt.compare(oldPassword, user.password);
      if (!comparePassword) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu cũ không đúng',
        });
      }
      hashPassword = await bcrypt.hash(newPassword, 10);
    }
    const newUser = {
      userName,
      password: newPassword ? hashPassword : password,
      role,
      contactNumber,
      email,
      profilePicture,
    };
    const condition = { _id: id };
    const updateUser = await userSchema.findOneAndUpdate(condition, newUser, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: 'Not found user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Update user success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
