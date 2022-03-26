import commentSchema from '../models/comment.modal.js';
import { io } from '../index.js';

export const getCommentController = async (req, res) => {
  const { productId } = req.params;
  try {
    const comments = await commentSchema.find({ productId: productId });
    return res.status(200).json({
      success: true,
      message: 'Get list comment success',
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
export const postCommentController = async (req, res) => {
  try {
    const { comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;
    const username = req.user.userName;
    const avatar = req.user.profilePicture;
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'comment is required',
      });
    }
    const objComment = new commentSchema({
      productId: productId,
      userId: userId,
      username: username,
      avatar: avatar,
      comment: comment,
    });
    await objComment.save();
    const comments = await commentSchema.find({ productId: productId });
    io.emit('add-comment', comments);
    res.status(201).json({
      success: true,
      message: 'post comment success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId, productId } = req.params;
  try {
    const productDelete = await commentSchema.findOneAndDelete({
      _id: commentId,
    });
    if (!productDelete) {
      return res.status(400).json({
        success: false,
        message: 'Comment not found',
      });
    }
    const comments = await commentSchema.find({ productId: productId });
    io.emit('delete-comment', comments);
    res.status(200).json({
      success: true,
      message: 'delete comment success',
      productDelete,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateComment = async (req, res) => {
  const { commentId, productId } = req.params;
  const { comment } = req.body;
  const userId = req.user._id;
  const username = req.user.userName;
  const avatar = req.user.profilePicture;
  try {
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'comment is required',
      });
    }
    const commentUpdate = {
      productId,
      comment,
      userId,
      username,
      avatar,
    };
    const condition = { _id: commentId, productId: productId };
    await commentSchema.findOneAndUpdate(condition, commentUpdate, {
      new: true,
    });
    const comments = await commentSchema.find({ productId: productId });
    io.emit('update-comment', comments);
    res.status(200).json({
      success: true,
      message: 'update comment success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
