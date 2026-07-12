import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

router.post('/register', registerValidator, handleValidationErrors, AuthController.register);
router.post('/login', loginValidator, handleValidationErrors, AuthController.login);

export default router;
