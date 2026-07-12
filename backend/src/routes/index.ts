import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './auth.routes';
import swaggerDocument from '../config/swagger.json';

const router = Router();

// Routes
router.use('/auth', authRoutes);

// Swagger Documentation Route
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
