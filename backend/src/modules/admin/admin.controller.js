import mongoose from 'mongoose';
import { User } from '../user/user.model.js';
import { Post } from '../post/post.model.js';
import { Comment } from '../comment/comment.model.js';

// ---- USER MANAGEMENT ----

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['super_admin', 'moderator', 'user', 'guest'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Optional: prevent super_admin from changing their own role to prevent lockout
    if (user._id.toString() === req.user.userId && role !== 'super_admin') {
      return res.status(400).json({ success: false, message: 'Cannot demote yourself' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    // Optional: Delete user's posts and comments as well
    await Post.deleteMany({ author: id });
    await Comment.deleteMany({ author: id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and all associated content deleted' });
  } catch (error) {
    next(error);
  }
};

// ---- GLOBAL CONTENT MANAGEMENT ----

export const getAllPostsAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const comments = await Comment.find({})
      .populate('author', 'name role')
      .populate('post', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};
