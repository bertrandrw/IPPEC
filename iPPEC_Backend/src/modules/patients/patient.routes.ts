// src/modules/patients/patient.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { getMyProfileController } from './patient.controller.js';

const router = Router();

// All routes in this file are for logged-in patients
router.use(authMiddleware, roleMiddleware([ROLES.PATIENT]));

// Route to get the logged-in patient's own profile
router.get('/me', getMyProfileController);

export default router;