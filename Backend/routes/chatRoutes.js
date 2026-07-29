import express from 'express';
import { getStreamToken } from '../controllers/chatController.js';

const router = express.Router();

router.route('/stream-token').post(getStreamToken);

export default router;