import { Comment } from './comment.model.js';
import { Post } from '../post/post.model.js';

export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const getMyCommentCount = async (req, res, next) => {
  try {
    const count = await Comment.countDocuments({ author: req.user.userId });
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content, post: postId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user.userId,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name role');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate('post', 'author');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Authorization: User must be comment author, post author, OR have a privileged role
    const isCommentAuthor = comment.author.toString() === req.user.userId;
    const isPostAuthor = comment.post && comment.post.author.toString() === req.user.userId;
    const isPrivileged = req.user.role === 'super_admin' || req.user.role === 'moderator';

    if (!isCommentAuthor && !isPostAuthor && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to delete this comment.' });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
