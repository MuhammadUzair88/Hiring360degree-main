import express from 'express';
import { home, login, organization, register, updateOrganization } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(home);
router.route('/register').post(register)
router.route('/login').post(login)

router.route("/organization").get(authMiddleware, organization)
router.route("/organization/update").put(authMiddleware, updateOrganization)

export default router;