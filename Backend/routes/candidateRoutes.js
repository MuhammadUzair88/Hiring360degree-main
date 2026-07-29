import express from 'express';
import { getCandidateFormAd } from '../controllers/candidateController.js';

const router = express.Router();

router.route('/apply/:id').get(getCandidateFormAd);

export default router;