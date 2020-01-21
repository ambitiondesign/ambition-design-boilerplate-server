import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import auth from '../util/auth';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

router.post('/password', auth, AuthController.passwordChange);

router.post('/reset/:token', AuthController.reset);
router.get('/reset/:token', AuthController.validateResetToken);

export default router;