
import express from 'express';
import {
  createItem,
  getAllItems,
  resolveItem,
} from '../controllers/lostItemController.js';
import { protect } from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createItem);

router.get('/', protect, getAllItems);

router.put('/:id/resolve', protect, isAdmin, resolveItem);

export default router;
