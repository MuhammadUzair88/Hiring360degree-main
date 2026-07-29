import express from 'express';
import { getPipeline, roundCreation } from '../controllers/interviewPipelineController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/add/:advertisementId').post(authMiddleware,roundCreation);
router.route('/:advertisementId').get(authMiddleware,getPipeline);

export default router;