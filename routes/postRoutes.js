const express = require('express');
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost, 
  toggleLike 
} = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Post routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .put(protect, toggleLike);

// Comment routes
router.route('/:postId/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;
