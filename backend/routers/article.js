import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.js';
import {
  getArticles,
  getArticleById,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/article.js';

const router = express.Router();

// Public
router.get('/',      getArticles);
router.get('/:id',   getArticleById);

// Admin
router.get('/admin/all',  protect, adminOnly, getAllArticles);
router.post('/',          protect, adminOnly, createArticle);
router.put('/:id',        protect, adminOnly, updateArticle);
router.delete('/:id',     protect, adminOnly, deleteArticle);

export default router;