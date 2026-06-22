
import express from 'express';
import {
  applyOutpass,
  getMyOutpasses,
  getAllOutpasses,
  updateOutpassStatus,
} from '../controllers/outpassController.js';
import { protect } from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, applyOutpass);

router.get('/me', protect, getMyOutpasses);

router.get('/', protect, isAdmin, getAllOutpasses);

router.put('/:id', protect, isAdmin, updateOutpassStatus);

export default router;
