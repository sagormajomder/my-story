import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Comment = mongoose.model('Comment', commentSchema);
