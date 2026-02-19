import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { signupDto } from './dto/signup.dto.js';
import { loginDto } from './dto/login.dto.js';
import { signupController, loginController } from './auth.controller.js';

const router = Router();

router.post('/signup', validate(signupDto), signupController);
router.post('/login', validate(loginDto), loginController);

export default router;
