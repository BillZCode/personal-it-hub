import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authRateLimit } from '../middleware/rateLimit';
import { validate } from '../middleware/validation';
import { loginSchema } from '../utils/validation';
import { authMiddleware, loadUser } from '../middleware/auth';

const router = Router();

router.post('/login', authRateLimit, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', loadUser, authController.me);
router.post('/refresh', authController.refresh);

export default router;