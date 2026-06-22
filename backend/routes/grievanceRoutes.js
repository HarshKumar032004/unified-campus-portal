
import { Router } from 'express';
import {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus,
  getPublicGrievances,
  upvoteGrievance,
} from '../controllers/grievanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = Router();

router.post('/', protect, createGrievance);

router.get('/public', protect, getPublicGrievances);

router.get('/me', protect, getMyGrievances);

router.get('/', protect, isAdmin, getAllGrievances);

router.put('/:id', protect, isAdmin, updateGrievanceStatus);

router.put('/:id/upvote', protect, upvoteGrievance);

export default router;
