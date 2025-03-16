const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    featuredImage: {
      type: String,
      default: null
    },
    published: {
      type: Boolean,
      default: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate slug from title before saving
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    // Create slug from title
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Cascade delete comments when a post is deleted
PostSchema.pre('remove', async function(next) {
  await this.model('Comment').deleteMany({ post: this._id });
  next();
});

// Virtual field for comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false
});

module.exports = mongoose.model('Post', PostSchema);
