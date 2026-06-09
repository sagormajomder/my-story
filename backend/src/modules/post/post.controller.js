import mongoose from 'mongoose';
import { HTTP_STATUS } from '../../shared/constants.js';
import ApiError from '../../utils/ApiError.js';
import { Post } from './post.model.js';

// ── Public ──────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/posts — list all published posts (public)
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: posts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/posts/:id — get a single published post (public)
 */
export const getPostById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
    }

    const post = await Post.findOne({ _id: req.params.id, status: 'published' })
      .populate('author', 'name email role');

    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');

    res.status(HTTP_STATUS.OK).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// ── Authenticated (user / moderator / super_admin) ──────────────────────────

/**
 * GET /api/v1/posts/my — list the authenticated user's own posts (all statuses)
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { author: req.user.userId };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: posts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/posts — create a post (user / moderator / super_admin)
 */
export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user.userId,
    });

    await post.populate('author', 'name email role');

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/posts/:id — update a post (owner, or moderator/super_admin for any)
 */
export const updatePost = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
    }

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');

    const isOwner = post.author.toString() === req.user.userId;
    const isPrivileged = ['moderator', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only edit your own posts');
    }

    Object.assign(post, req.body);
    await post.save();
    await post.populate('author', 'name email role');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/posts/:id — delete a post (owner, or moderator/super_admin for any)
 */
export const deletePost = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid post ID format');
    }

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Post not found');

    const isOwner = post.author.toString() === req.user.userId;
    const isPrivileged = ['moderator', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own posts');
    }

    await post.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
