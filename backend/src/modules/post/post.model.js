import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [1, 'Content must be at least 1 character'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Auto-calculate read time and excerpt before save
postSchema.pre('save', function () {
  // Estimate ~200 words per minute reading speed
  const wordCount = this.content?.split(/\s+/).length || 0;
  this.readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-generate excerpt from content if not set
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/(<([^>]+)>)/gi, '').slice(0, 200) + '...';
  }
});

export const Post = mongoose.model('Post', postSchema);
